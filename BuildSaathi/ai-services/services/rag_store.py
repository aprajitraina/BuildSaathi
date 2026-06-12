from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from uuid import UUID

import chromadb
from openai import AsyncOpenAI

from config import Settings


@dataclass
class RetrievedChunk:
    text: str
    score: float
    metadata: dict[str, Any]


class RagStore:
    def __init__(self, settings: Settings):
        self._settings = settings
        self._embedding_client = AsyncOpenAI(
            api_key=settings.openai_api_key,
            timeout=float(settings.ai_timeout_seconds),
        )

    async def upsert_document(
        self,
        collection_name: str,
        doc_id: UUID,
        content: str,
        source_type: str,
        trace_id: str | None = None,
    ) -> None:
        chunks = self._chunk_text(content)
        if not chunks:
            return

        embeddings = await self._embed_many(chunks, trace_id)
        collection = self._get_collection(collection_name)
        ids = [f"{doc_id}:{idx}" for idx in range(len(chunks))]
        metadatas = [
            {
                "doc_id": str(doc_id),
                "chunk_index": idx,
                "source_type": source_type,
            }
            for idx in range(len(chunks))
        ]
        collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas,
        )

    async def retrieve(
        self,
        collection_name: str,
        query_text: str,
        top_k: int | None = None,
        where: dict[str, Any] | None = None,
        trace_id: str | None = None,
    ) -> list[RetrievedChunk]:
        if not query_text.strip():
            return []

        embedding = await self._embed(query_text, trace_id)
        collection = self._get_collection(collection_name)
        result = collection.query(
            query_embeddings=[embedding],
            n_results=top_k or self._settings.rag_top_k,
            where=where,
            include=["documents", "metadatas", "distances"],
        )
        documents = (result.get("documents") or [[]])[0]
        metadatas = (result.get("metadatas") or [[]])[0]
        distances = (result.get("distances") or [[]])[0]

        retrieved: list[RetrievedChunk] = []
        for index, text in enumerate(documents):
            metadata = metadatas[index] if index < len(metadatas) else {}
            distance = float(distances[index]) if index < len(distances) else 1.0
            score = max(0.0, 1.0 - distance)
            retrieved.append(RetrievedChunk(text=text, score=round(score, 4), metadata=metadata or {}))
        return retrieved

    async def _embed(self, text: str, trace_id: str | None) -> list[float]:
        response = await self._embedding_client.embeddings.create(
            model=self._settings.openai_embedding_model,
            input=text,
            dimensions=1536,
            user=trace_id or "buildsaathi-rag",
        )
        return response.data[0].embedding

    async def _embed_many(self, texts: list[str], trace_id: str | None) -> list[list[float]]:
        response = await self._embedding_client.embeddings.create(
            model=self._settings.openai_embedding_model,
            input=texts,
            dimensions=1536,
            user=trace_id or "buildsaathi-rag",
        )
        return [item.embedding for item in response.data]

    def _get_collection(self, collection_name: str):
        client = chromadb.HttpClient(
            host=self._settings.chroma_host,
            port=self._settings.chroma_port,
        )
        return client.get_or_create_collection(name=collection_name)

    def _chunk_text(self, text: str) -> list[str]:
        clean = " ".join(text.split())
        if not clean:
            return []

        chunk_size = max(300, self._settings.rag_chunk_size)
        overlap = max(0, min(self._settings.rag_chunk_overlap, chunk_size // 2))

        chunks: list[str] = []
        start = 0
        while start < len(clean):
            end = min(len(clean), start + chunk_size)
            chunks.append(clean[start:end])
            if end == len(clean):
                break
            start = max(end - overlap, start + 1)
        return chunks
