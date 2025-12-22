"""
Health Check Routes.
Provides API health and status information.
"""

from fastapi import APIRouter, Depends

from app.api.dependencies import get_translation_service
from app.config import get_settings, Settings
from app.schemas.translation import HealthResponse
from app.services.translation_service import TranslationService

router = APIRouter(prefix="/health", tags=["Health"])


@router.get(
    "",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns API health status and available word count",
)
async def health_check(
    settings: Settings = Depends(get_settings),
    translation_service: TranslationService = Depends(get_translation_service),
) -> HealthResponse:
    """
    Get API health status.
    
    Returns:
        Health status with version and available word count
    """
    return HealthResponse(
        status="healthy",
        version=settings.app_version,
        available_words=translation_service.get_available_word_count(),
    )
