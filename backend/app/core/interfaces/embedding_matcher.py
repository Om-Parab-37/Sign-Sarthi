"""
Embedding Matcher Interface.
Defines contract for semantic word matching using embeddings.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class MatchResult:
    """Result of embedding-based word matching."""
    
    query_word: str
    matched_word: str | None
    similarity: float
    is_match: bool  # True if similarity >= threshold


class IEmbeddingMatcher(ABC):
    """
    Abstract interface for semantic word matching.
    
    Uses word embeddings and cosine similarity to find
    the best matching sign word from the vocabulary.
    """

    @abstractmethod
    def find_best_match(self, word: str) -> MatchResult:
        """
        Find the best matching sign word for the input word.
        
        Args:
            word: Input word to match
            
        Returns:
            MatchResult with matched word and similarity score
        """
        pass

    @abstractmethod
    def get_vocabulary_size(self) -> int:
        """Get the number of words in the sign vocabulary."""
        pass
