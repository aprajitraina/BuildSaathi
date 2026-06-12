# ai-services/

Python FastAPI microservices for BuildSaathi AI features.

## Services

| Service | Port | Purpose |
|---|---|---|
| `tender-summary/` | 8000 (default) | Summarize tender PDFs using GPT-4o |
| `estimation/` | 8000 (sub-route) | BOQ AI estimation from project scope |
| `rag-services/` | 8000 (sub-route) | RAG pipeline for contractor Q&A |

## Architecture Note

All services are co-hosted on a single FastAPI app during development (Phase 1).
They can be split into independent deployments as load demands in Phase 4+.
The .NET API calls this service at `http://ai-services:8000` (Docker) or `http://localhost:8000` (local).

## Mock Mode

Set `AI_MOCK_MODE=true` in `.env` to return deterministic mock responses without calling OpenAI.
This is the default in development so you don't burn API credits during scaffolding.

## Running Locally

```bash
cd ai-services
python -m venv .venv
.venv\Scripts\activate    # Windows
source .venv/bin/activate  # Mac/Linux

pip install -r requirements.txt

AI_MOCK_MODE=true uvicorn main:app --reload --port 8000
# Docs at http://localhost:8000/docs
```

Use `ai-services/.env.example` as the source template for local environment values.

## Docker Compose Startup

```bash
# from repository root
docker compose up -d mysql redis chromadb ai-services api frontend
docker compose ps
```

If you only need the AI side for API integration testing:

```bash
docker compose up -d chromadb ai-services
```

## Mock vs Real Provider

- `AI_MOCK_MODE=true`: deterministic mock responses, no OpenAI calls.
- `AI_MOCK_MODE=false`: real provider path enabled (requires `OPENAI_API_KEY`).
- Keep keys server-side in `.env`; do not expose in frontend vars.

## Quick cURL Checks

```bash
curl -X POST http://localhost:8000/summarize \
  -H "Content-Type: application/json" \
  -H "X-Trace-Id: manual-test-summary" \
  -d "{\"tender_id\":\"11111111-1111-1111-1111-111111111111\",\"content\":\"Road widening and drainage works for 2.5km stretch\",\"language\":\"en\"}"
```

```bash
curl -X POST http://localhost:8000/estimate \
  -H "Content-Type: application/json" \
  -H "X-Trace-Id: manual-test-estimate" \
  -d "{\"boq_id\":\"22222222-2222-2222-2222-222222222222\",\"project_scope\":\"Road strengthening and resurfacing\",\"state\":\"Maharashtra\",\"work_category\":\"Road Works\",\"estimated_length_km\":2.5}"
```

```bash
curl -X POST http://localhost:8000/rag/query \
  -H "Content-Type: application/json" \
  -H "X-Trace-Id: manual-test-rag" \
  -d "{\"query\":\"Show me key earthwork assumptions\",\"max_results\":3}"
```

## Lightweight Endpoint Tests

```bash
# from repository root
python -m unittest discover -s ai-services/tests -p "test_*.py"
```

## Thin RAG Path (Phase 6C)

- Tender summary and BOQ estimation now chunk and index request context in ChromaDB.
- The same flows retrieve top matching chunks and inject them into LLM prompts.
- `/rag/query` can be used to inspect retrieved tender/BOQ snippets.

## Phase Roadmap

| Phase | AI Feature |
|---|---|
| Phase 1 | Mocked responses for all endpoints |
| Phase 3 | Real OpenAI integration for tender summary |
| Phase 3 | LangChain RAG pipeline with ChromaDB |
| Phase 4 | BOQ estimation copilot with DSR context |
