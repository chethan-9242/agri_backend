from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional, Dict, Any

from .client import get_or_create_collection, embed_texts, generate_answer
from .config import rag_config


@dataclass
class RagChunk:
    id: str
    text: str
    metadata: Dict[str, Any]


def index_chunks(chunks: List[RagChunk]) -> None:
    """Index text chunks into Chroma for retrieval.

    This is intended to be called from an offline ingestion script that parses PDFs.
    """
    if not chunks:
        return

    collection = get_or_create_collection(rag_config.collection_name)
    texts = [c.text for c in chunks]
    ids = [c.id for c in chunks]
    metadatas = [c.metadata for c in chunks]

    embeddings = embed_texts(texts)
    collection.add(ids=ids, documents=texts, metadatas=metadatas, embeddings=embeddings)


def _search_chunks(query: str, top_k: Optional[int] = None) -> List[RagChunk]:
    collection = get_or_create_collection(rag_config.collection_name)
    k = top_k or rag_config.top_k
    query_embeddings = embed_texts([query])
    if not query_embeddings:
        return []

    results = collection.query(
        query_embeddings=query_embeddings,
        n_results=k,
    )

    docs = results.get("documents", [[]])[0]
    ids = results.get("ids", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances") or results.get("embeddings")

    rag_chunks: List[RagChunk] = []
    for i, (cid, doc, meta) in enumerate(zip(ids, docs, metadatas)):
        # Chroma returns distances or similarity scores depending on config. We do a simple presence check.
        if not doc:
            continue
        rag_chunks.append(RagChunk(id=cid, text=doc, metadata=meta or {}))

    # Only keep the single most relevant chunk and ignore the rest.
    if not rag_chunks:
        return []

    # If Chroma returned distances (lower is better), pick the smallest one;
    # otherwise, assume the results are already sorted by relevance.
    if isinstance(distances, list) and distances and isinstance(distances[0], list) and distances[0]:
        dist_list = distances[0]
        best_idx = min(range(len(rag_chunks)), key=lambda i: dist_list[i] if i < len(dist_list) else float("inf"))
        return [rag_chunks[best_idx]]

    return rag_chunks[:1]


def answer_with_graph_rag(question: str, role: str, use_case: Optional[str] = None) -> str:
    """Main entry for Graph-RAG.

    - Always tries retrieval first.
    - If relevant chunks are found, answer using ONLY that context.
    - If nothing is found, we still answer helpfully using the same generation model
      but without context (the caller should treat this as transparent to the user).

    The caller (router) is responsible for providing role (farmer/distributor).
    """
    # Step 1: retrieve context
    chunks = _search_chunks(question, top_k=rag_config.top_k)
    context_texts = [c.text for c in chunks]

    # Step 2: build a tailored prompt based on role and use_case
    role_note = ""
    if role == "farmer":
        role_note = (
            "You are answering a question from a FARMER. Focus on very practical field-level "
            "advice: clear symptoms, step-by-step controls, safe waiting periods, and cost-effective options."
        )
    elif role == "distributor":
        role_note = (
            "You are answering a question from a DISTRIBUTOR. Focus only on transport, storage, "
            "spoilage reduction, temperature/moisture control, and packaging. Do not give farm-level crop advice."
        )

    uc_note = ""
    if use_case:
        uc_note = f"This question is categorized as: {use_case}. Prioritize answering that aspect."

    full_prompt = (
        f"{role_note}\n\n{uc_note}\n\n"
        "Answer in simple language that a non-technical farmer could understand. "
        "Do not mention research papers, RAG, retrieval, or any internal systems."
        f"\n\nQuestion: {question}"
    )

    # Step 3: call Gemini with or without context. We do not expose fallback behavior to the user.
    answer = generate_answer(full_prompt, context_texts)
    return answer
