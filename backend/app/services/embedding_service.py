"""
Embedding Service - Semantic word matching using sentence-transformers.
Pre-computes embeddings for sign vocabulary for fast similarity search.
"""

import numpy as np
from functools import lru_cache
from sentence_transformers import SentenceTransformer

from app.core.interfaces.embedding_matcher import IEmbeddingMatcher, MatchResult


class EmbeddingService(IEmbeddingMatcher):
    """
    Embedding-based semantic word matcher.
    
    Uses sentence-transformers to compute embeddings and
    cosine similarity to find best matching sign words.
    """

    def __init__(
        self,
        vocabulary: list[str],
        model_name: str = "all-MiniLM-L6-v2",
        similarity_threshold: float = 0.7,
    ):
        """
        Initialize the embedding service.
        
        Args:
            vocabulary: List of available sign words
            model_name: Sentence transformer model name
            similarity_threshold: Minimum similarity for a match
        """
        self._vocabulary = [word.lower() for word in vocabulary]
        self._threshold = similarity_threshold
        
        # Load the model
        print(f"Loading embedding model: {model_name}...")
        self._model = SentenceTransformer(model_name)
        
        # Pre-compute embeddings for all vocabulary words
        print(f"Computing embeddings for {len(self._vocabulary)} words...")
        self._vocab_embeddings = self._model.encode(
            self._vocabulary,
            convert_to_numpy=True,
            normalize_embeddings=True,  # For faster cosine similarity
            show_progress_bar=False,
        )
        print("Embeddings ready!")
        
        # Create word to index mapping for fast lookup
        self._word_to_idx = {word: idx for idx, word in enumerate(self._vocabulary)}

    def find_best_match(self, word: str) -> MatchResult:
        """
        Find the best matching sign word using cosine similarity.
        
        Args:
            word: Input word to match
            
        Returns:
            MatchResult with best match and similarity score
        """
        word_lower = word.lower()
        
        # Check for exact match first (fast path)
        if word_lower in self._word_to_idx:
            return MatchResult(
                query_word=word,
                matched_word=word_lower,
                similarity=1.0,
                is_match=True,
            )
        
        # Compute embedding for query word
        query_embedding = self._model.encode(
            word_lower,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )
        
        # Compute cosine similarities (dot product since normalized)
        similarities = np.dot(self._vocab_embeddings, query_embedding)
        
        # Find best match
        best_idx = np.argmax(similarities)
        best_similarity = float(similarities[best_idx])
        best_word = self._vocabulary[best_idx]
        
        return MatchResult(
            query_word=word,
            matched_word=best_word if best_similarity >= self._threshold else None,
            similarity=best_similarity,
            is_match=best_similarity >= self._threshold,
        )

    def get_vocabulary_size(self) -> int:
        """Get the number of words in the sign vocabulary."""
        return len(self._vocabulary)

    @property
    def threshold(self) -> float:
        """Get the similarity threshold."""
        return self._threshold
