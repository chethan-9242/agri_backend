from pydantic import BaseModel


class RagConfig(BaseModel):
    collection_name: str = "agri_research_chunks"
    concept_collection: str = "agri_concepts"
    edge_collection: str = "agri_edges"
    persist_directory: str = "./chroma_db"
    embedding_model: str = "models/text-embedding-004"  # Gemini embedding
    generation_model: str = "gemini-2.0-flash"  # Gemini 2.0 Flash
    top_k: int = 8
    min_relevance_score: float = 0.2


rag_config = RagConfig()
