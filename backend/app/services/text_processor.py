"""
Text Processor Service.
Concrete implementation of ITextProcessor using NLTK Porter Stemmer.
Follows Strategy Pattern - can be swapped with other processors.
"""

import re

from nltk.stem import PorterStemmer

from app.core.interfaces.text_processor import ITextProcessor


class PorterStemmerProcessor(ITextProcessor):
    """
    Text processor using NLTK's Porter Stemmer algorithm.
    
    Stems words to their root form to improve video matching.
    Example: "running" -> "run", "cats" -> "cat"
    """

    def __init__(self):
        """Initialize the Porter Stemmer."""
        self._stemmer = PorterStemmer()
        # Pattern to extract words (alphanumeric)
        self._word_pattern = re.compile(r"[a-zA-Z]+")

    def process_word(self, word: str) -> str:
        """
        Stem a single word using Porter Stemmer.
        
        Args:
            word: Input word to stem
            
        Returns:
            Stemmed word in lowercase
        """
        cleaned = word.strip().lower()
        if not cleaned:
            return ""
        return self._stemmer.stem(cleaned)

    def process_text(self, text: str) -> list[str]:
        """
        Process text into list of stemmed words.
        
        Args:
            text: Input text to process
            
        Returns:
            List of stemmed words (preserving order, filtering empty)
        """
        # Extract only alphabetic words
        words = self._word_pattern.findall(text.lower())
        
        # Stem each word
        processed = [self.process_word(word) for word in words]
        
        # Filter out empty strings
        return [w for w in processed if w]


class PassthroughProcessor(ITextProcessor):
    """
    No-op text processor that passes words through unchanged.
    Useful for testing or when stemming is not desired.
    """

    def __init__(self):
        self._word_pattern = re.compile(r"[a-zA-Z]+")

    def process_word(self, word: str) -> str:
        """Return word as-is (lowercase)."""
        return word.strip().lower()

    def process_text(self, text: str) -> list[str]:
        """Split text into words without stemming."""
        words = self._word_pattern.findall(text.lower())
        return [w for w in words if w]
