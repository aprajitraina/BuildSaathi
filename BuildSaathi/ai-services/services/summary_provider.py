import asyncio
import json
from abc import ABC, abstractmethod
from typing import Any
from uuid import UUID

from openai import AsyncOpenAI

from config import Settings
from services.rag_store import RagStore


class SummaryProvider(ABC):
    @abstractmethod
    async def summarize(self, tender_id: UUID, content: str, language: str, trace_id: str | None) -> dict[str, Any]:
        raise NotImplementedError


class OpenAISummaryProvider(SummaryProvider):
    def __init__(self, settings: Settings):
        self._settings = settings
        self._client = AsyncOpenAI(
            api_key=settings.openai_api_key,
            timeout=float(settings.ai_timeout_seconds),
        )
        self._rag_store = RagStore(settings)

    async def summarize(self, tender_id: UUID, content: str, language: str, trace_id: str | None) -> dict[str, Any]:
        retrieved_context = ""
        try:
            await self._rag_store.upsert_document(
                collection_name=self._settings.rag_collection_tender,
                doc_id=tender_id,
                content=content,
                source_type="tender",
                trace_id=trace_id,
            )
            retrieved = await self._rag_store.retrieve(
                collection_name=self._settings.rag_collection_tender,
                query_text=f"Summarize tender scope and risks for {tender_id}",
                where={"doc_id": str(tender_id)},
                trace_id=trace_id,
            )
            if retrieved:
                retrieved_context = "\n\nRetrieved context:\n" + "\n".join(
                    f"- {chunk.text}" for chunk in retrieved
                )
        except Exception:
            retrieved_context = ""

        system_prompt = (
            "You are a senior government tender analyst for Indian construction contractors. "
            "Return ONLY valid JSON with keys: scope_of_work, key_requirements, eligibility_criteria, "
            "key_risks, recommendation, recommendation_reason. recommendation must be one of high, medium, low."
        )
        user_prompt = (
            f"Tender ID: {tender_id}\n"
            f"Language: {language}\n"
            f"Content:\n{content}\n\n"
            "Requirements:\n"
            "- Scope should be concise (2-4 sentences)\n"
            "- key_requirements: 3-7 bullet-like strings\n"
            "- eligibility_criteria: 3-7 strings\n"
            "- key_risks: 2-6 strings\n"
            "- recommendation_reason: practical decision support for contractor"
            f"{retrieved_context}"
        )

        response_text = await self._call_with_retries(system_prompt, user_prompt, trace_id)
        payload = json.loads(response_text)
        return {
            "scope_of_work": str(payload.get("scope_of_work", "")).strip(),
            "key_requirements": [str(v).strip() for v in payload.get("key_requirements", []) if str(v).strip()],
            "eligibility_criteria": [str(v).strip() for v in payload.get("eligibility_criteria", []) if str(v).strip()],
            "key_risks": [str(v).strip() for v in payload.get("key_risks", []) if str(v).strip()],
            "recommendation": str(payload.get("recommendation", "medium")).strip().lower(),
            "recommendation_reason": str(payload.get("recommendation_reason", "")).strip(),
            "model_used": self._settings.openai_model,
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
                    raise ValueError("OpenAI returned empty content.")
                return content
            except Exception as exc:
                last_error = exc
                if attempt >= attempts:
                    break
                await asyncio.sleep(self._settings.ai_retry_delay_ms / 1000)

        raise RuntimeError("OpenAI summarization failed after retries.") from last_error


def get_summary_provider(settings: Settings) -> SummaryProvider:
    provider = settings.ai_provider.strip().lower()
    if provider == "openai":
        return OpenAISummaryProvider(settings)
    raise ValueError(f"Unsupported AI provider: {settings.ai_provider}")
