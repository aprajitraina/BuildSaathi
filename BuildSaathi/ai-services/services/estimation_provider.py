import asyncio
import json
from abc import ABC, abstractmethod
from typing import Any
from uuid import UUID

from openai import AsyncOpenAI

from config import Settings
from services.rag_store import RagStore


def _build_heuristic_items(work_category: str, state: str, estimated_area_sqm: float | None, estimated_length_km: float | None) -> list[dict[str, Any]]:
    area = max(estimated_area_sqm or 100.0, 10.0)
    length = max(estimated_length_km or 1.0, 0.1)
    category = (work_category or "general").strip().lower()

    if "road" in category:
        return [
            {
                "description": f"Earthwork excavation and embankment preparation ({state})",
                "unit": "m3",
                "quantity": round(length * 1800, 2),
                "unit_rate": 320.0,
                "dsr_code": "DSR-2.25",
                "category": "Earthwork",
                "quantity_hint": "Quantity scales with road length and cross-section assumptions.",
                "confidence": 0.68,
            },
            {
                "description": "Granular sub-base laying and compaction",
                "unit": "m2",
                "quantity": round(length * 4200, 2),
                "unit_rate": 410.0,
                "dsr_code": "DSR-4.12",
                "category": "Pavement",
                "quantity_hint": "Assumes 7m carriageway with shoulders.",
                "confidence": 0.64,
            },
            {
                "description": "Bituminous concrete surface layer",
                "unit": "m2",
                "quantity": round(length * 3600, 2),
                "unit_rate": 780.0,
                "dsr_code": "DSR-5.6",
                "category": "Pavement",
                "quantity_hint": "Should be validated with final pavement design thickness.",
                "confidence": 0.62,
            },
        ]

    if "building" in category:
        return [
            {
                "description": "PCC for foundation bed",
                "unit": "m3",
                "quantity": round(area * 0.18, 2),
                "unit_rate": 6200.0,
                "dsr_code": "DSR-3.1",
                "category": "Civil",
                "quantity_hint": "Derived from typical shallow foundation assumption.",
                "confidence": 0.66,
            },
            {
                "description": "RCC work in slab and beams",
                "unit": "m3",
                "quantity": round(area * 0.22, 2),
                "unit_rate": 9200.0,
                "dsr_code": "DSR-5.22",
                "category": "Structural",
                "quantity_hint": "Check against structural drawings before freeze.",
                "confidence": 0.63,
            },
            {
                "description": "Brick masonry in cement mortar",
                "unit": "m3",
                "quantity": round(area * 0.32, 2),
                "unit_rate": 7300.0,
                "dsr_code": "DSR-6.4",
                "category": "Masonry",
                "quantity_hint": "Based on assumed wall density for low-rise structure.",
                "confidence": 0.6,
            },
        ]

    return [
        {
            "description": f"General site preparation and layout marking ({state})",
            "unit": "lump-sum",
            "quantity": 1.0,
            "unit_rate": 150000.0,
            "dsr_code": "DSR-GEN-1",
            "category": "General",
            "quantity_hint": "Baseline preparatory package for project mobilization.",
            "confidence": 0.58,
        },
        {
            "description": "Material handling and transportation",
            "unit": "lump-sum",
            "quantity": 1.0,
            "unit_rate": 220000.0,
            "dsr_code": "DSR-GEN-2",
            "category": "General",
            "quantity_hint": "Validate against project location and haul distances.",
            "confidence": 0.57,
        },
    ]


class EstimationProvider(ABC):
    @abstractmethod
    async def estimate(
        self,
        boq_id: UUID,
        project_scope: str,
        state: str,
        work_category: str,
        estimated_area_sqm: float | None,
        estimated_length_km: float | None,
        trace_id: str | None,
    ) -> dict[str, Any]:
        raise NotImplementedError


class OpenAIEstimationProvider(EstimationProvider):
    def __init__(self, settings: Settings):
        self._settings = settings
        self._client = AsyncOpenAI(
            api_key=settings.openai_api_key,
            timeout=float(settings.ai_timeout_seconds),
        )
        self._rag_store = RagStore(settings)

    async def estimate(
        self,
        boq_id: UUID,
        project_scope: str,
        state: str,
        work_category: str,
        estimated_area_sqm: float | None,
        estimated_length_km: float | None,
        trace_id: str | None,
    ) -> dict[str, Any]:
        heuristic_items = _build_heuristic_items(work_category, state, estimated_area_sqm, estimated_length_km)
        fallback_payload = self._build_payload(boq_id, heuristic_items, is_ai_generated=False)
        retrieved_context = ""
        rag_document = (
            f"BOQ ID: {boq_id}\n"
            f"Project scope: {project_scope}\n"
            f"State: {state}\n"
            f"Work category: {work_category}\n"
            f"Area: {estimated_area_sqm}\n"
            f"Length: {estimated_length_km}\n"
            f"Heuristic seed: {json.dumps(heuristic_items)}"
        )
        try:
            await self._rag_store.upsert_document(
                collection_name=self._settings.rag_collection_boq,
                doc_id=boq_id,
                content=rag_document,
                source_type="boq",
                trace_id=trace_id,
            )
            retrieved = await self._rag_store.retrieve(
                collection_name=self._settings.rag_collection_boq,
                query_text=f"BOQ suggestions for {work_category} work in {state}",
                where={"doc_id": str(boq_id)},
                trace_id=trace_id,
            )
            if retrieved:
                retrieved_context = "\n\nRetrieved context:\n" + "\n".join(
                    f"- {chunk.text}" for chunk in retrieved
                )
        except Exception:
            retrieved_context = ""

        system_prompt = (
            "You are a BOQ estimation copilot for Indian contractors. "
            "Return ONLY valid JSON with top-level key 'suggested_items'. "
            "Each item must include: description, unit, quantity, unit_rate, dsr_code, category, quantity_hint, confidence."
        )
        user_prompt = (
            f"BOQ ID: {boq_id}\n"
            f"Project scope: {project_scope}\n"
            f"State: {state}\n"
            f"Work category: {work_category}\n"
            f"Estimated area (sqm): {estimated_area_sqm}\n"
            f"Estimated length (km): {estimated_length_km}\n\n"
            f"Seed suggestions:\n{json.dumps(heuristic_items)}\n\n"
            "Rules:\n"
            "- Suggest 3 to 6 line items.\n"
            "- Quantities should be plausible and numeric.\n"
            "- confidence between 0 and 1.\n"
            "- Keep dsr_code as hint-level code.\n"
            "- quantity_hint should briefly mention the quantity assumption."
            f"{retrieved_context}"
        )

        try:
            response_text = await self._call_with_retries(system_prompt, user_prompt, trace_id)
            payload = json.loads(response_text)
            items = payload.get("suggested_items", [])
            normalized_items = []
            for item in items:
                quantity = max(float(item.get("quantity", 0) or 0), 0.01)
                unit_rate = max(float(item.get("unit_rate", 0) or 0), 0.0)
                confidence = float(item.get("confidence", 0.55) or 0.55)
                normalized_items.append(
                    {
                        "description": str(item.get("description", "")).strip(),
                        "unit": str(item.get("unit", "lump-sum")).strip(),
                        "quantity": round(quantity, 2),
                        "unit_rate": round(unit_rate, 2),
                        "dsr_code": str(item.get("dsr_code", "")).strip() or None,
                        "category": str(item.get("category", "General")).strip(),
                        "quantity_hint": str(item.get("quantity_hint", "Validate quantity assumptions.")).strip(),
                        "confidence": min(max(confidence, 0.0), 1.0),
                    }
                )
            normalized_items = [i for i in normalized_items if i["description"]]
            if not normalized_items:
                return fallback_payload
            return self._build_payload(boq_id, normalized_items, is_ai_generated=True)
        except Exception:
            return fallback_payload

    def _build_payload(self, boq_id: UUID, items: list[dict[str, Any]], is_ai_generated: bool) -> dict[str, Any]:
        total = sum(float(item["quantity"]) * float(item["unit_rate"]) for item in items)
        return {
            "boq_id": boq_id,
            "suggested_items": items,
            "total_estimated_cost": round(total, 2),
            "disclaimer": (
                "AI-generated suggestions are draft estimates. Verify quantities and rates against approved DSR and drawings."
                if is_ai_generated
                else "Heuristic fallback suggestions generated. Validate quantities and rates before use."
            ),
            "is_ai_generated": is_ai_generated,
        }

    async def _call_with_retries(self, system_prompt: str, user_prompt: str, trace_id: str | None) -> str:
        attempts = max(1, self._settings.ai_retry_count + 1)
        last_error: Exception | None = None

        for attempt in range(1, attempts + 1):
            try:
                completion = await self._client.chat.completions.create(
                    model=self._settings.openai_model,
                    response_format={"type": "json_object"},
                    temperature=0.2,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    max_tokens=self._settings.openai_max_tokens,
                    metadata={"trace_id": trace_id or ""},
                )
                content = completion.choices[0].message.content or ""
                if not content.strip():
                    raise ValueError("OpenAI returned empty estimation content.")
                return content
            except Exception as exc:
                last_error = exc
                if attempt >= attempts:
                    break
                await asyncio.sleep(self._settings.ai_retry_delay_ms / 1000)

        raise RuntimeError("OpenAI estimation failed after retries.") from last_error


def get_estimation_provider(settings: Settings) -> EstimationProvider:
    provider = settings.ai_provider.strip().lower()
    if provider == "openai":
        return OpenAIEstimationProvider(settings)
    raise ValueError(f"Unsupported AI provider: {settings.ai_provider}")
