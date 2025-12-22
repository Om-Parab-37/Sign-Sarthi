"""
Text Processor Interface.
Follows Interface Segregation Principle - minimal interface for text processing.
Enables Strategy Pattern - different implementations can be swapped.
"""

from abc import ABC, abstractmethod


class ITextProcessor(ABC):
    """
    Abstract interface for text processing.
    
    Implementations can include:
    - Stemming (Porter, Snowball)
    - Lemmatization
    - No processing (passthrough)
    """

    @abstractmethod
    def process_word(self, word: str) -> str:
        """
        Process a single word and return the normalized form.
        
        Args:
            word: The input word to process
            
        Returns:
            The processed/normalized word
        """
        pass

    @abstractmethod
    def process_text(self, text: str) -> list[str]:
        """
        Process a full text and return list of processed words.
        
        Args:
            text: The input text to process
            
        Returns:
            List of processed words
        """
        pass
