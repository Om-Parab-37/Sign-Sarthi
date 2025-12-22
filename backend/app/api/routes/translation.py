"""
Translation API Routes.
Semantic matching with embedding similarity and NER fallback.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_translation_service
from app.schemas.translation import (
    TranslationRequest,
    TranslationResponse,
    TranslationItemSchema,
)
from app.services.translation_service import TranslationService

router = APIRouter(prefix="/translate", tags=["Translation"])


@router.post(
    "",
    response_model=TranslationResponse,
    status_code=status.HTTP_200_OK,
    summary="Translate text to sign language",
    description="""
    Translates input text to sign language video references using semantic matching.
    
    Processing:
    1. Semantic match using word embeddings
    2. If similarity >= threshold → use matched sign video
    3. If no match, check NER → if named entity → fingerspell
    4. Otherwise → skip word
    """,
)
async def translate_text(
    request: TranslationRequest,
    translation_service: TranslationService = Depends(get_translation_service),
) -> TranslationResponse:
    """Translate text to sign language video URLs."""
    try:
        result = translation_service.translate(request.text)
        
        return TranslationResponse(
            success=True,
            original_text=result.original_text,
            translations=[
                TranslationItemSchema(
                    original_word=item.original_word,
                    matched_word=item.matched_word,
                    type=item.type,
                    url=item.url,
                    letters=item.letters,
                    similarity=item.similarity,
                )
                for item in result.items
            ],
            stats={
                "video_count": result.video_count,
                "fingerspell_count": result.fingerspell_count,
                "skipped_count": result.skipped_count,
                "total": len(result.items),
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}",
        )

