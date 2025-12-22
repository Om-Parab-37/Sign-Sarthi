"""
Translation Service - Core business logic with semantic matching.
Uses embedding similarity for word matching and NER for fingerspelling.
"""

import re
from dataclasses import dataclass

from app.core.interfaces.embedding_matcher import IEmbeddingMatcher
from app.core.interfaces.ner_detector import INerDetector
from app.core.interfaces.video_repository import IVideoRepository


@dataclass
class TranslationItem:
    """Represents a single translated item."""

    original_word: str
    matched_word: str | None
    type: str  # "video", "fingerspell", or "skipped"
    url: str | None = None
    letters: list[str] | None = None
    similarity: float | None = None


@dataclass
class TranslationResult:
    """Complete translation result."""

    original_text: str
    items: list[TranslationItem]
    video_count: int
    fingerspell_count: int
    skipped_count: int


class TranslationService:
    """
    Service for translating text to sign language video URLs.
    
    Processing Flow:
    1. Tokenize text into words
    2. For each word, find best embedding match
    3. If similarity >= threshold → use matched sign video
    4. If no match, check NER → if named entity → fingerspell
    5. Otherwise → skip word
    
    Follows Dependency Inversion - depends on abstractions.
    """

    def __init__(
        self,
        embedding_matcher: IEmbeddingMatcher,
        ner_detector: INerDetector,
        video_repository: IVideoRepository,
    ):
        """
        Initialize the translation service.
        
        Args:
            embedding_matcher: Semantic word matcher
            ner_detector: Named entity detector
            video_repository: Repository for video lookup
        """
        self._embedding_matcher = embedding_matcher
        self._ner_detector = ner_detector
        self._video_repository = video_repository
        self._word_pattern = re.compile(r"[a-zA-Z]+")

    def translate(self, text: str) -> TranslationResult:
        """
        Translate text to sign language video references.
        
        Args:
            text: Input text to translate
            
        Returns:
            TranslationResult with video URLs, fingerspelling, and skipped words
        """
        # Extract words from text
        words = self._word_pattern.findall(text)
        
        # Get named entities for the full text (for context)
        entity_words = self._ner_detector.get_entity_words(text)
        
        items: list[TranslationItem] = []
        video_count = 0
        fingerspell_count = 0
        skipped_count = 0
        
        for word in words:
            word_lower = word.lower()
            
            # Step 1: Try semantic matching
            match_result = self._embedding_matcher.find_best_match(word_lower)
            
            if match_result.is_match and match_result.matched_word:
                # Found a good match - look up the video
                video_result = self._video_repository.find_video(match_result.matched_word)
                
                if video_result.found:
                    items.append(
                        TranslationItem(
                            original_word=word,
                            matched_word=match_result.matched_word,
                            type="video",
                            url=video_result.url,
                            similarity=match_result.similarity,
                        )
                    )
                    video_count += 1
                    continue
            
            # Step 2: No match - check if it's a named entity
            if word_lower in entity_words:
                # Fingerspell named entities
                letters = self._create_fingerspell_sequence(word)
                items.append(
                    TranslationItem(
                        original_word=word,
                        matched_word=None,
                        type="fingerspell",
                        letters=letters,
                        similarity=match_result.similarity,
                    )
                )
                fingerspell_count += 1
            else:
                # Step 3: Skip non-matching, non-entity words
                items.append(
                    TranslationItem(
                        original_word=word,
                        matched_word=None,
                        type="skipped",
                        similarity=match_result.similarity,
                    )
                )
                skipped_count += 1
        
        return TranslationResult(
            original_text=text,
            items=items,
            video_count=video_count,
            fingerspell_count=fingerspell_count,
            skipped_count=skipped_count,
        )

    def _create_fingerspell_sequence(self, word: str) -> list[str]:
        """Create list of letters for fingerspelling."""
        return [char.lower() for char in word if char.isalpha()]

    def get_available_word_count(self) -> int:
        """Get the number of words with available videos."""
        return self._embedding_matcher.get_vocabulary_size()
