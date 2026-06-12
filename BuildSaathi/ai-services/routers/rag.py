"""
RAG (Retrieval-Augmented Generation) Router

POST /rag/query
  Input:  query (natural language), contractor_context (optional)
  Output: Grounded answer with source citations

Phase 1: Mock response
Phase 3: LangChain + ChromaDB vector retrieval + GPT-4o generation

The RAG pipeline indexes:
  - DSR rate documents
  - Tender documents saved by the contractor
  - Government construction guidelines
  - BuildSaathi knowledge base
"""

from fastapi import APIRouter, Request
from pydantic import BaseModel

from config import get_settings
from services.rag_store import RagStore

router = APIRouter()


class RAGQueryRequest(BaseModel):
    query: str
    contractor_id: str | None = None  # For personalized context
    max_results: int = 5


class SourceDocument(BaseModel):
    title: str
    excerpt: str
    relevance_score: float
    source_type: str  # "dsr" | "tender" | "guideline" | "knowledge_base"


class RAGQueryResponse(BaseModel):
    query: str
    answer: str
    sources: list[SourceDocument]
    is_ai_generated: bool
    disclaimer: str | None = None


@router.post("/query", response_model=RAGQueryResponse)
async def rag_query(request: RAGQueryRequest, http_request: Request) -> RAGQueryResponse:
    settings = get_settings()
    trace_id = http_request.headers.get("x-trace-id")

    if settings.mock_ai:
        return RAGQueryResponse(
            query=request.query,
            answer=(
                "Mock mode is active. Use this endpoint in non-mock mode to retrieve indexed tender/BOQ chunks."
            ),
            sources=[],
            is_ai_generated=False,
            disclaimer="RAG retrieval disabled in mock mode.",
        )

    rag_store = RagStore(settings)
    tender_hits = await rag_store.retrieve(
        collection_name=settings.rag_collection_tender,
        query_text=request.query,
        top_k=max(1, request.max_results),
        trace_id=trace_id,
    )
    boq_hits = await rag_store.retrieve(
        collection_name=settings.rag_collection_boq,
        query_text=request.query,
        top_k=max(1, request.max_results),
        trace_id=trace_id,
    )
    merged = sorted(
        [("tender", hit) for hit in tender_hits] + [("boq", hit) for hit in boq_hits],
        key=lambda pair: pair[1].score,
        reverse=True,
    )[: request.max_results]

    sources = [
        SourceDocument(
            title=f"{source_type.upper()} chunk #{hit.metadata.get('chunk_index', 0)}",
            excerpt=hit.text[:280],
            relevance_score=hit.score,
            source_type=source_type,
        )
        for source_type, hit in merged
    ]
    if not sources:
        return RAGQueryResponse(
            query=request.query,
            answer="No indexed tender/BOQ context found yet. Generate a summary or estimation first.",
            sources=[],
            is_ai_generated=False,
            disclaimer="RAG index is currently empty for this workspace.",
        )

    answer_lines = "\n".join(f"- {source.excerpt}" for source in sources[:3])
    return RAGQueryResponse(
        query=request.query,
        answer=f"Top retrieved context snippets:\n{answer_lines}",
        sources=sources,
        is_ai_generated=False,
        disclaimer="Retrieved snippets only. Use summary/estimate endpoints for full AI responses.",
    )
