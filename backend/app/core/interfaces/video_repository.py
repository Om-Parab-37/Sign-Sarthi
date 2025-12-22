"""
Video Repository Interface.
Follows Repository Pattern - abstracts data access from business logic.
Follows Dependency Inversion - high-level modules depend on this abstraction.
"""

from abc import ABC, abstractmethod
from pathlib import Path


class VideoLookupResult:
    """Result of a video lookup operation."""

    def __init__(
        self,
        word: str,
        found: bool,
        video_path: Path | None = None,
        url: str | None = None,
    ):
        self.word = word
        self.found = found
        self.video_path = video_path
        self.url = url


class IVideoRepository(ABC):
    """
    Abstract interface for video file access.
    
    Implementations can include:
    - FileSystemVideoRepository (local files)
    - S3VideoRepository (cloud storage)
    - CachedVideoRepository (with caching layer)
    """

    @abstractmethod
    def find_video(self, word: str) -> VideoLookupResult:
        """
        Find a video file for the given word.
        
        Args:
            word: The processed word to look up
            
        Returns:
            VideoLookupResult with found status and path/url if found
        """
        pass

    @abstractmethod
    def video_exists(self, word: str) -> bool:
        """
        Check if a video exists for the given word.
        
        Args:
            word: The processed word to check
            
        Returns:
            True if video exists, False otherwise
        """
        pass

    @abstractmethod
    def get_available_words(self) -> list[str]:
        """
        Get list of all available words with videos.
        
        Returns:
            List of words that have corresponding videos
        """
        pass
