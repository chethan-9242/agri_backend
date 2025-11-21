from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import List

from pypdf import PdfReader

# Ensure we can import the FastAPI app package when running as a script
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.rag.graph_rag import RagChunk, index_chunks  # type: ignore  # noqa: E402


RESEARCH_DIR = ROOT_DIR / "research_papers"


def extract_text_from_pdf(path: Path) -> str:
    reader = PdfReader(str(path))
    texts: List[str] = []
    for page in reader.pages:
        try:
            txt = page.extract_text() or ""
        except Exception:
            txt = ""
        if txt:
            texts.append(txt)
    return "\n".join(texts)


def chunk_text(text: str, max_chars: int = 2000) -> List[str]:
    """Very simple character-based chunking.

    For better semantic chunks you can later improve this using paragraphs/sections.
    """
    text = text.replace("\r", "\n")
    text = "\n".join(line.strip() for line in text.splitlines() if line.strip())

    chunks: List[str] = []
    start = 0
    while start < len(text):
        end = min(start + max_chars, len(text))
        # Try to cut at last sentence boundary within the window
        window = text[start:end]
        last_dot = window.rfind(". ")
        if last_dot != -1 and end < len(text):
            end = start + last_dot + 1
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end
    return chunks


def ingest_all_papers() -> None:
    if not RESEARCH_DIR.exists():
        print(f"research_papers directory not found at: {RESEARCH_DIR}")
        return

    pdf_files = sorted(RESEARCH_DIR.glob("*.pdf"))
    if not pdf_files:
        print("No PDF files found in research_papers directory.")
        return

    all_chunks: List[RagChunk] = []

    for pdf_path in pdf_files:
        print(f"[INGEST] Reading {pdf_path.name}...")
        full_text = extract_text_from_pdf(pdf_path)
        if not full_text.strip():
            print(f"[WARN] No text extracted from {pdf_path.name}, skipping.")
            continue

        text_chunks = chunk_text(full_text)
        print(f"[INGEST] {pdf_path.name}: {len(text_chunks)} chunks.")

        base_id = pdf_path.stem.replace(" ", "_")
        for idx, chunk in enumerate(text_chunks, start=1):
            chunk_id = f"{base_id}_chunk_{idx}"
            metadata = {
                "source_file": pdf_path.name,
                "chunk_index": idx,
            }
            all_chunks.append(RagChunk(id=chunk_id, text=chunk, metadata=metadata))

    if not all_chunks:
        print("[INGEST] No chunks to index.")
        return

    print(f"[INGEST] Indexing {len(all_chunks)} chunks into Chroma...")
    index_chunks(all_chunks)
    print("[INGEST] Done.")


if __name__ == "__main__":
    ingest_all_papers()
