from __future__ import annotations

from functools import lru_cache
from typing import Any, Dict, List

import chromadb
import google.generativeai as genai

from app.config import settings
from .config import rag_config


@lru_cache(maxsize=1)
def get_chroma_client() -> chromadb.ClientAPI:
    """Return a persistent Chroma client backed by rag_config.persist_directory."""
    return chromadb.PersistentClient(path=rag_config.persist_directory)


def get_or_create_collection(name: str):
    client = get_chroma_client()
    return client.get_or_create_collection(name=name)


@lru_cache(maxsize=1)
def _configure_gemini() -> None:
    if not settings.gemini_api_key:
        # We purposely do not raise here to keep the app importable; runtime calls should handle missing key.
        print("[RAG] Warning: GEMINI_API_KEY is not set; RAG will not function correctly.")
        return
    genai.configure(api_key=settings.gemini_api_key)


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Embed a list of texts using Gemini embeddings.

    We call the embedding API once per text to avoid shape/compat issues and
    always return List[List[float]] suitable for Chroma.
    """
    _configure_gemini()
    if not texts:
        return []

    embeddings: List[List[float]] = []
    for text in texts:
        if not text:
            # Keep alignment: append an empty vector placeholder
            embeddings.append([])
            continue

        result = genai.embed_content(
            model=rag_config.embedding_model,
            content=text,
            task_type="retrieval_document",
        )

        # google-generativeai returns either {"embedding": [...]} or
        # {"embedding": {"values": [...]}} for text-embedding-004.
        if isinstance(result, dict) and "embedding" in result:
            emb = result["embedding"]
            if isinstance(emb, dict) and "values" in emb:
                vec = emb["values"]
            else:
                vec = emb
        else:
            raise RuntimeError("Unexpected embedding response from Gemini: missing 'embedding' key")

        if not isinstance(vec, list):
            raise RuntimeError("Gemini embedding is not a list of floats")
        embeddings.append(vec)

    return embeddings

def generate_answer(prompt: str, context_chunks: List[str]) -> str:
    """Call Gemini 2.0 Flash to generate an answer.

    The prompt must tell the model to base its answer primarily on the given context.
    """
    _configure_gemini()
    model = genai.GenerativeModel(rag_config.generation_model)

    system_instructions = (
        "You are an agricultural expert assistant for Indian smallholder farmers. "
        "Always give practical, step-by-step guidance in a warm, friendly tone. "
        "Present every answer in a clearly structured way using short headings and bullet "
        "points instead of long paragraphs. When context from research papers is provided, "
        "base your core factual statements primarily on that context, but you may also add "
        "extra practical tips and general agronomy knowledge if it will help the farmer. "
        "Do not mention research papers, retrieval, or any internal systems. At the end of "
        "your answer, add one short, friendly follow-up question asking if they would like "
        "more suggestions or recommendations."
    )

    parts: List[Any] = [
        system_instructions,
        "\n\nCONTEXT FROM RESEARCH PAPERS:\n",
    ]
    if context_chunks:
        for i, chunk in enumerate(context_chunks, start=1):
            parts.append(f"[Chunk {i}] {chunk}\n")
    else:
        parts.append("[No context provided]\n")

    parts.append("\nUSER QUESTION:\n")
    parts.append(prompt)

    response = model.generate_content(parts)
    return response.text or "I am unable to generate an answer right now. Please try again later."
