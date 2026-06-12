"""
BOQ Estimation Router

POST /estimate
  Input:  boq_id, project_scope (description), state, work_category
  Output: List of suggested BOQ line items with DSR codes and rates

Phase 1: Mock/empty response
Phase 4: LLM reasoning over DSR rate context via RAG
"""

from fastapi import APIRouter, Request
from pydantic import BaseModel
from uuid import UUID

from config import get_settings
from services.estimation_provider import get_estimation_provider

router = APIRouter()


class EstimationRequest(BaseModel):
    boq_id: UUID
    project_scope: str
    state: str
    work_category: str
    estimated_area_sqm: float | None = None
    estimated_length_km: float | None = None


class BOQLineItemSuggestion(BaseModel):
    description: str
    unit: str
    quantity: float
    unit_rate: float
    amount: float
    dsr_code: str | None = None
    category: str
    quantity_hint: str | None = None
    confidence: float  # 0.0 - 1.0


class EstimationResponse(BaseModel):
    boq_id: UUID
    suggested_items: list[BOQLineItemSuggestion]
    total_estimated_cost: float
    disclaimer: str
    is_ai_generated: bool


@router.post("", response_model=EstimationResponse)
async def estimate_boq(request: EstimationRequest, http_request: Request) -> EstimationResponse:
    settings = get_settings()
    trace_id = http_request.headers.get("x-trace-id")

    if settings.mock_ai:
        seed_items = [
            BOQLineItemSuggestion(
                description=f"Initial mobilization and temporary site setup ({request.state})",
                unit="lump-sum",
                quantity=1.0,
                unit_rate=175000.0,
                amount=175000.0,
                dsr_code="DSR-MOCK-SETUP",
                category="General",
                quantity_hint="Base mobilization quantity for one project package.",
                confidence=0.62,
            ),
            BOQLineItemSuggestion(
                description="Site clearing and leveling",
                unit="m2",
                quantity=max(request.estimated_area_sqm or 1000.0, 200.0),
                unit_rate=120.0,
                amount=max(request.estimated_area_sqm or 1000.0, 200.0) * 120.0,
                dsr_code="DSR-MOCK-EARTH",
                category="Earthwork",
                quantity_hint="Estimated from provided/assumed site area.",
                confidence=0.6,
            ),
        ]
        return EstimationResponse(
            boq_id=request.boq_id,
            suggested_items=seed_items,
            total_estimated_cost=round(sum(item.amount for item in seed_items), 2),
            disclaimer="Mock estimation response. Validate with DSR rates before use.",
            is_ai_generated=False,
        )

    provider = get_estimation_provider(settings)
    result = await provider.estimate(
        boq_id=request.boq_id,
        project_scope=request.project_scope,
        state=request.state,
        work_category=request.work_category,
        estimated_area_sqm=request.estimated_area_sqm,
        estimated_length_km=request.estimated_length_km,
        trace_id=trace_id,
    )
    mapped_items = [
        BOQLineItemSuggestion(
            description=item["description"],
            unit=item["unit"],
            quantity=item["quantity"],
            unit_rate=item["unit_rate"],
            amount=round(item["quantity"] * item["unit_rate"], 2),
            dsr_code=item.get("dsr_code"),
            category=item["category"],
            quantity_hint=item.get("quantity_hint"),
            confidence=item.get("confidence", 0.55),
        )
        for item in result["suggested_items"]
    ]
    return EstimationResponse(
        boq_id=request.boq_id,
        suggested_items=mapped_items,
        total_estimated_cost=result["total_estimated_cost"],
        disclaimer=result["disclaimer"],
        is_ai_generated=result["is_ai_generated"],
    )
