"""
API Dependencies - Dependency Injection setup.
Uses FastAPI's Depends() for clean dependency injection.
"""

from functools import lru_cache
from pathlib import Path

from app.config import get_settings
from app.repositories.video_repository import FileSystemVideoRepository
from app.services.embedding_service import EmbeddingService
from app.services.ner_service import NerService
from app.services.translation_service import TranslationService


@lru_cache
def get_video_repository() -> FileSystemVideoRepository:
    """Factory for video repository."""
    settings = get_settings()
    videos_dir = settings.videos_directory
    
    return FileSystemVideoRepository(
        videos_directory=videos_dir,
        base_url="/signs",
    )


@lru_cache
def get_embedding_service() -> EmbeddingService:
    """
    Factory for embedding service.
    Pre-computes embeddings for all sign words on first call.
    """
    settings = get_settings()
    video_repo = get_video_repository()
    
    # Get vocabulary from video repository
    vocabulary = video_repo.get_available_words()
    
    return EmbeddingService(
        vocabulary=vocabulary,
        model_name=settings.embedding_model,
        similarity_threshold=settings.similarity_threshold,
    )


@lru_cache
def get_ner_service() -> NerService:
    """Factory for NER service."""
    settings = get_settings()
    return NerService(model_name=settings.spacy_model)


@lru_cache
def get_translation_service() -> TranslationService:
    """Factory for translation service with all dependencies."""
    return TranslationService(
        embedding_matcher=get_embedding_service(),
        ner_detector=get_ner_service(),
        video_repository=get_video_repository(),
    )
