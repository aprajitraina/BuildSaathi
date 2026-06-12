import os
import unittest
from uuid import uuid4

from fastapi.testclient import TestClient

from config import get_settings
from main import app


class AIEndpointsMockModeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        os.environ["AI_MOCK_MODE"] = "true"
        get_settings.cache_clear()
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        get_settings.cache_clear()

    def test_summarize_returns_structured_response_in_mock_mode(self):
        response = self.client.post(
            "/summarize",
            json={
                "tender_id": str(uuid4()),
                "content": "Tender for road drainage and widening with strict timeline.",
                "language": "en",
            },
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("scope_of_work", payload)
        self.assertIn("key_requirements", payload)
        self.assertIn("eligibility_criteria", payload)
        self.assertIn("key_risks", payload)
        self.assertIn(payload["recommendation"], ("high", "medium", "low"))
        self.assertFalse(payload["is_ai_generated"])

    def test_estimate_returns_suggestions_in_mock_mode(self):
        response = self.client.post(
            "/estimate",
            json={
                "boq_id": str(uuid4()),
                "project_scope": "Road overlay and culvert repair for district road segment.",
                "state": "Maharashtra",
                "work_category": "Road Works",
                "estimated_length_km": 2.5,
            },
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("suggested_items", payload)
        self.assertGreaterEqual(len(payload["suggested_items"]), 1)
        self.assertGreater(payload["total_estimated_cost"], 0)
        self.assertFalse(payload["is_ai_generated"])

    def test_rag_query_returns_mock_disclaimer_in_mock_mode(self):
        response = self.client.post(
            "/rag/query",
            json={
                "query": "Show me tender retrieval context",
                "max_results": 3,
            },
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("answer", payload)
        self.assertIn("disclaimer", payload)
        self.assertEqual(payload["sources"], [])
        self.assertFalse(payload["is_ai_generated"])


if __name__ == "__main__":
    unittest.main()
