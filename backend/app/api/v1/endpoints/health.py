"""
GET /health endpoint — lightweight liveness probe.

Used by Docker Compose healthcheck and any external monitoring tool
to verify the backend is up and ready to accept requests.
"""
from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "CivicAI API",
        "message": "Backend is healthy and ready to accept civic reports.",
    }
