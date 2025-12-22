"""
Custom exceptions for the application.
Following Single Responsibility - only defines exception types.
"""


class TranslationError(Exception):
    """Base exception for translation-related errors."""

    pass


class VideoNotFoundError(TranslationError):
    """Raised when a video file for a word is not found."""

    def __init__(self, word: str):
        self.word = word
        super().__init__(f"Video not found for word: {word}")


class TextProcessingError(TranslationError):
    """Raised when text processing fails."""

    pass


class ConfigurationError(Exception):
    """Raised when application configuration is invalid."""

    pass
