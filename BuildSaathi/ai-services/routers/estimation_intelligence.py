"""
Estimation Intelligence — item normalization and improvement suggestions.

POST /normalize-items
POST /suggest-improvements
"""

from fastapi import APIRouter, Request
from pydantic import BaseModel

from config import get_settings

router = APIRouter()


class ItemIn(BaseModel):
    item_name: str
    quantity: float
    unit: str
    rate: float
    amount: float


class ItemsPayload(BaseModel):
    items: list[ItemIn]


class NormalizedItemOut(BaseModel):
    index: int
    normalized_name: str
    suggestion: str | None = None


class NormalizeResponse(BaseModel):
    items: list[NormalizedItemOut]


class SuggestResponse(BaseModel):
    suggestions: list[str]


@router.post("/normalize-items", response_model=NormalizeResponse)
async def normalize_items(payload: ItemsPayload, http_request: Request) -> NormalizeResponse:
    settings = get_settings()
    _ = http_request.headers.get("x-trace-id")

    items: list[NormalizedItemOut] = []
    for i, row in enumerate(payload.items):
        name = (row.item_name or "").strip()
        if settings.mock_ai or not name:
            normalized = name or "Item"
            if normalized:
                normalized = normalized[0].upper() + normalized[1:]
            items.append(
                NormalizedItemOut(
                    index=i,
                    normalized_name=normalized,
                    suggestion="Mock: validate naming against your BOQ template.",
                )
            )
            continue

        # Non-mock minimal pass-through (LLM hook can replace this later)
        items.append(
            NormalizedItemOut(
                index=i,
                normalized_name=name[0].upper() + name[1:] if name else name,
                suggestion=None,
            )
        )

    return NormalizeResponse(items=items)


@router.post("/suggest-improvements", response_model=SuggestResponse)
async def suggest_improvements(payload: ItemsPayload, http_request: Request) -> SuggestResponse:
    settings = get_settings()
    _ = http_request.headers.get("x-trace-id")

    if settings.mock_ai:
        return SuggestResponse(
            suggestions=[
                "Mock: Compare material factors with local CPWD/PWD schedules for your state.",
                "Mock: Add explicit wastage percentages for cement and steel if not already covered.",
            ]
        )

    return SuggestResponse(
        suggestions=[
            "Review rate inputs against current market / DSR for the project state.",
            "Ensure foundation and finishing items are separated for clearer bid breakdown.",
        ]
    )
