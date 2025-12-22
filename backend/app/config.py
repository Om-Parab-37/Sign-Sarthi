"""
Application configuration using Pydantic Settings.
Follows the Single Responsibility Principle - only handles configuration.
"""

from functools import lru_cache
from pathlib import Path
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses pydantic-settings for validation and type safety.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    app_name: str = "Sign Language Translation API"
    app_version: str = "1.0.0"
    debug: bool = False

    # Server
    host: str = "0.0.0.0"
    port: int = 7860

    # CORS
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
    ]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [origin.strip() for origin in v.split(",")]
        elif isinstance(v, str):
            import json
            return json.loads(v)
        return v

    # Paths - defaults to SSbackend's SignAnimations folder
    videos_directory: Path = Path(__file__).parent / "data" / "sign_animations"

    # Semantic Matching
    embedding_model: str = "all-MiniLM-L6-v2"
    similarity_threshold: float = 0.7

    # NER
    spacy_model: str = "en_core_web_sm"


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings instance - prevents re-reading env vars on every request.
    This is a simple Factory pattern for configuration.
    changed similaritys
    """
    return Settings()
