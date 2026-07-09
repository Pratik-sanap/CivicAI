from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "CivicAI API",
        "message": "Backend is healthy and ready to accept civic reports.",
    }
