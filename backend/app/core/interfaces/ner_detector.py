"""
NER Detector Interface.
Defines contract for Named Entity Recognition.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class EntityInfo:
    """Information about a detected named entity."""
    
    text: str
    label: str  # PERSON, ORG, GPE, LOC, etc.
    start: int
    end: int


class INerDetector(ABC):
    """
    Abstract interface for Named Entity Recognition.
    
    Detects named entities (people, places, organizations)
    in text for fingerspelling fallback.
    """

    @abstractmethod
    def detect_entities(self, text: str) -> list[EntityInfo]:
        """
        Detect all named entities in the text.
        
        Args:
            text: Full sentence/text to analyze
            
        Returns:
            List of detected entities with labels
        """
        pass

    @abstractmethod
    def is_named_entity(self, word: str, context: str) -> bool:
        """
        Check if a specific word is a named entity in context.
        
        Args:
            word: The word to check
            context: Full sentence for context
            
        Returns:
            True if word is a named entity
        """
        pass
