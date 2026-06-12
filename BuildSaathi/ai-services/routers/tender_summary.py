"""
Tender Summary Router

POST /summarize
  Input:  tender_id (UUID), content (raw text or PDF-extracted text)
  Output: Structured TenderSummaryResponse

Phase 1: Mock responses
Phase 3: Real GPT-4o integration with prompt template
"""

from fastapi import APIRouter, HTTPException
from fastapi import Request
from pydantic import BaseModel
from uuid import UUID
from typing import Literal

from config import get_settings
from services.summary_provider import get_summary_provider

router = APIRouter()


class SummarizeRequest(BaseModel):
    tender_id: UUID
    content: str
    language: str = "en"  # "en" | "hi" — Hindi support Phase 3


class TenderSummaryResponse(BaseModel):
    tender_id: UUID
    scope_of_work: str
    key_requirements: list[str]
    eligibility_criteria: list[str]
    key_risks: list[str]
    recommendation: Literal["high", "medium", "low"]
    recommendation_reason: str
    is_ai_generated: bool
    model_used: str | None = None


MOCK_RESPONSE = TenderSummaryResponse(
    tender_id="00000000-0000-0000-0000-000000000000",  # type: ignore
    scope_of_work=(
        "Construction of 2-lane road, including earthwork, subgrade preparation, "
        "WBM layers, bituminous surface, and drainage structures as per MORTH specifications."
    ),
    key_requirements=[
        "Valid PWD contractor registration (Class A or above)",
        "EMD submission via DD/BG before deadline",
        "Technical bid and financial bid submitted separately",
        "Experience certificate for similar road work > ₹1 Cr",
    ],
    eligibility_criteria=[
        "Minimum annual turnover ₹2 Cr for last 3 years",
        "Similar completed works certificate from competent authority",
        "Valid PAN, GST registration",
        "No blacklisting order from any government department",
    ],
    key_risks=[
        "Tight submission deadline — only 12 days from publication",
        "High EMD (3% of estimated cost) blocks working capital",
        "Monsoon season may affect site mobilization timeline",
    ],
    recommendation="medium",
    recommendation_reason=(
        "Standard road construction tender with moderate complexity. "
        "Viable if you have relevant road work experience and can mobilize EMD quickly."
    ),
    is_ai_generated=False,
    model_used="mock",
)


@router.post("", response_model=TenderSummaryResponse)
async def summarize_tender(request: SummarizeRequest, http_request: Request) -> TenderSummaryResponse:
    settings = get_settings()
    trace_id = http_request.headers.get("x-trace-id")

    if settings.mock_ai:
        response = MOCK_RESPONSE.model_copy(update={"tender_id": request.tender_id})
        return response

    try:
        provider = get_summary_provider(settings)
        ai_result = await provider.summarize(
            tender_id=request.tender_id,
            content=request.content,
            language=request.language,
            trace_id=trace_id,
        )

        recommendation = ai_result.get("recommendation", "medium")
        if recommendation not in ("high", "medium", "low"):
            recommendation = "medium"

        return TenderSummaryResponse(
            tender_id=request.tender_id,
            scope_of_work=ai_result.get("scope_of_work", ""),
            key_requirements=ai_result.get("key_requirements", []),
            eligibility_criteria=ai_result.get("eligibility_criteria", []),
            key_risks=ai_result.get("key_risks", []),
            recommendation=recommendation,
            recommendation_reason=ai_result.get("recommendation_reason", "No recommendation reasoning generated."),
            is_ai_generated=True,
            model_used=ai_result.get("model_used"),
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI summarization failed. trace_id={trace_id}") from exc
