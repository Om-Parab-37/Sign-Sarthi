"""
NER Service - Named Entity Recognition using spaCy.
Detects named entities for fingerspelling fallback.
"""

import spacy
from spacy.language import Language

from app.core.interfaces.ner_detector import INerDetector, EntityInfo


class NerService(INerDetector):
    """
    Named Entity Recognition service using spaCy.
    
    Detects entities like PERSON, ORG, GPE (countries/cities), LOC.
    Used to determine if unmatched words should be fingerspelled.
    """

    # Entity types that should be fingerspelled
    FINGERSPELL_ENTITY_TYPES = {"PERSON", "ORG", "GPE", "LOC", "FAC", "PRODUCT", "EVENT"}

    def __init__(self, model_name: str = "en_core_web_sm"):
        """
        Initialize the NER service.
        
        Args:
            model_name: spaCy model name
        """
        print(f"Loading spaCy model: {model_name}...")
        try:
            self._nlp: Language = spacy.load(model_name)
        except OSError:
            # Model not installed, download it
            print(f"Downloading spaCy model: {model_name}...")
            spacy.cli.download(model_name)
            self._nlp = spacy.load(model_name)
        print("spaCy model ready!")

    def detect_entities(self, text: str) -> list[EntityInfo]:
        """
        Detect all named entities in the text.
        
        Args:
            text: Full sentence/text to analyze
            
        Returns:
            List of detected entities with labels
        """
        doc = self._nlp(text)
        
        return [
            EntityInfo(
                text=ent.text,
                label=ent.label_,
                start=ent.start_char,
                end=ent.end_char,
            )
            for ent in doc.ents
        ]

    def is_named_entity(self, word: str, context: str) -> bool:
        """
        Check if a word is a named entity in the given context.
        
        Args:
            word: The word to check
            context: Full sentence for context
            
        Returns:
            True if word is a named entity that should be fingerspelled
        """
        entities = self.detect_entities(context)
        word_lower = word.lower()
        
        for entity in entities:
            # Check if word is part of an entity
            if word_lower in entity.text.lower():
                # Only fingerspell certain entity types
                return entity.label in self.FINGERSPELL_ENTITY_TYPES
        
        return False

    def get_entity_words(self, text: str) -> set[str]:
        """
        Get all words that are part of named entities.
        
        Args:
            text: Full text to analyze
            
        Returns:
            Set of words (lowercase) that are named entities
        """
        entities = self.detect_entities(text)
        entity_words = set()
        
        for entity in entities:
            if entity.label in self.FINGERSPELL_ENTITY_TYPES:
                # Split entity into individual words
                for word in entity.text.lower().split():
                    entity_words.add(word)
        
        return entity_words
