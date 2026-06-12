"""
BuildSaathi AI Services — FastAPI Application

Single FastAPI app hosting all AI endpoints:
  - /summarize         → Tender PDF summarization
  - /estimate          → BOQ AI estimation
  - /rag/query         → Retrieval-Augmented Generation (RAG)

Mock mode is controlled by AI_MOCK_MODE environment variable.
Set AI_MOCK_MODE=true (default in dev) to return deterministic responses without calling OpenAI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import get_settings
from routers import tender_summary, estimation, estimation_intelligence, rag


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    print(f"BuildSaathi AI Services starting...")
    print(f"Mock mode: {settings.mock_ai}")
    print(f"AI provider: {settings.ai_provider}")
    print(f"OpenAI model: {settings.openai_model}")
    yield
    print("BuildSaathi AI Services shutting down.")


app = FastAPI(
    title="BuildSaathi AI Services",
    description="AI microservices for tender summarization, BOQ estimation, and RAG.",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — only the .NET API should call this in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://api:5000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Routers
app.include_router(tender_summary.router, prefix="/summarize", tags=["Tender Summary"])
app.include_router(estimation.router, prefix="/estimate", tags=["BOQ Estimation"])
app.include_router(estimation_intelligence.router, tags=["Estimation Intelligence"])
app.include_router(rag.router, prefix="/rag", tags=["RAG"])


@app.get("/health")
async def health():
    settings = get_settings()
    return {
        "status": "ok",
        "service": "BuildSaathi AI Services",
        "mock_mode": settings.mock_ai,
    }
