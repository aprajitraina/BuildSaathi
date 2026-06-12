from functools import lru_cache
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mock_ai: bool = Field(
        default=True,
        validation_alias=AliasChoices("AI_MOCK_MODE", "MOCK_AI")
    )
    ai_provider: str = Field(default="openai", validation_alias=AliasChoices("AI_PROVIDER"))
    openai_api_key: str = Field(default="mock", validation_alias=AliasChoices("OPENAI_API_KEY"))
    openai_model: str = Field(default="gpt-4o", validation_alias=AliasChoices("OPENAI_MODEL"))
    openai_embedding_model: str = Field(
        default="text-embedding-3-small",
        validation_alias=AliasChoices("OPENAI_EMBEDDING_MODEL")
    )
    openai_max_tokens: int = Field(default=4096, validation_alias=AliasChoices("OPENAI_MAX_TOKENS"))
    ai_timeout_seconds: int = Field(default=30, validation_alias=AliasChoices("AI_TIMEOUT_SECONDS"))
    ai_retry_count: int = Field(default=2, validation_alias=AliasChoices("AI_RETRY_COUNT"))
    ai_retry_delay_ms: int = Field(default=500, validation_alias=AliasChoices("AI_RETRY_DELAY_MS"))
    rag_chunk_size: int = Field(default=900, validation_alias=AliasChoices("RAG_CHUNK_SIZE"))
    rag_chunk_overlap: int = Field(default=150, validation_alias=AliasChoices("RAG_CHUNK_OVERLAP"))
    rag_top_k: int = Field(default=4, validation_alias=AliasChoices("RAG_TOP_K"))
    rag_collection_tender: str = Field(default="tender_chunks", validation_alias=AliasChoices("RAG_COLLECTION_TENDER"))
    rag_collection_boq: str = Field(default="boq_chunks", validation_alias=AliasChoices("RAG_COLLECTION_BOQ"))
    chroma_host: str = Field(default="localhost", validation_alias=AliasChoices("CHROMA_HOST"))
    chroma_port: int = Field(default=8001, validation_alias=AliasChoices("CHROMA_PORT"))
    redis_host: str = Field(default="localhost", validation_alias=AliasChoices("REDIS_HOST"))
    redis_port: int = Field(default=6379, validation_alias=AliasChoices("REDIS_PORT"))

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
