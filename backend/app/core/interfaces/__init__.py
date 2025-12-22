"""Interfaces package - abstract contracts for dependency inversion."""

from app.core.interfaces.text_processor import ITextProcessor
from app.core.interfaces.video_repository import IVideoRepository
from app.core.interfaces.embedding_matcher import IEmbeddingMatcher, MatchResult
from app.core.interfaces.ner_detector import INerDetector, EntityInfo

__all__ = [
    "ITextProcessor",
    "IVideoRepository", 
    "IEmbeddingMatcher",
    "MatchResult",
    "INerDetector",
    "EntityInfo",
]
