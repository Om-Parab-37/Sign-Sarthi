"""
File System Video Repository.
Concrete implementation of IVideoRepository for local file system.
Follows Open/Closed Principle - can be extended without modification.
"""

from functools import lru_cache
from pathlib import Path

from app.core.interfaces.video_repository import IVideoRepository, VideoLookupResult


class FileSystemVideoRepository(IVideoRepository):
    """
    Repository for accessing video files from local file system.
    
    Implements caching for available words to improve performance.
    """

    def __init__(self, videos_directory: Path, base_url: str = "/signs"):
        """
        Initialize the repository.
        
        Args:
            videos_directory: Path to directory containing video files
            base_url: Base URL path for serving videos
        """
        self._videos_dir = videos_directory
        self._base_url = base_url
        self._video_extension = ".mp4"
        
        # Cache available words on initialization
        self._available_words_cache: set[str] | None = None

    @property
    def videos_directory(self) -> Path:
        """Get the videos directory path."""
        return self._videos_dir

    def _get_video_path(self, word: str) -> Path:
        """Construct the full path to a video file."""
        return self._videos_dir / f"{word}{self._video_extension}"

    def _get_video_url(self, word: str) -> str:
        """Construct the URL for a video file."""
        return f"{self._base_url}/{word}{self._video_extension}"

    def video_exists(self, word: str) -> bool:
        """Check if a video exists for the given word."""
        video_path = self._get_video_path(word)
        return video_path.exists() and video_path.is_file()

    def find_video(self, word: str) -> VideoLookupResult:
        """
        Find a video file for the given word.
        
        Returns result with found=True and URL if video exists,
        otherwise found=False.
        """
        video_path = self._get_video_path(word)
        
        if video_path.exists() and video_path.is_file():
            return VideoLookupResult(
                word=word,
                found=True,
                video_path=video_path,
                url=self._get_video_url(word),
            )
        
        return VideoLookupResult(word=word, found=False)

    def get_available_words(self) -> list[str]:
        """
        Get list of all available words with videos.
        Uses caching for performance.
        """
        if self._available_words_cache is None:
            self._refresh_cache()
        
        return list(self._available_words_cache or [])

    def _refresh_cache(self) -> None:
        """Refresh the cache of available words."""
        if not self._videos_dir.exists():
            self._available_words_cache = set()
            return
        
        self._available_words_cache = {
            path.stem.lower()
            for path in self._videos_dir.glob(f"*{self._video_extension}")
            if path.is_file()
        }

    def get_word_count(self) -> int:
        """Get the total number of available video words."""
        return len(self.get_available_words())
