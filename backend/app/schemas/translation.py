"""
Translation API Schemas.
Pydantic models for request validation and response serialization.
"""

from pydantic import BaseModel, Field


class TranslationRequest(BaseModel):
    """Request body for translation endpoint."""

    text: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="Text to translate to sign language",
        examples=["Hello John, welcome to New York"],
    )


class TranslationItemSchema(BaseModel):
    """Single translated item in the response."""

    original_word: str = Field(..., description="Original word from input")
    matched_word: str | None = Field(None, description="Matched sign word (if found)")
    type: str = Field(..., description="Type: 'video', 'fingerspell', or 'skipped'")
    url: str | None = Field(None, description="Video URL if type is 'video'")
    letters: list[str] | None = Field(
        None, description="Letters if type is 'fingerspell'"
    )
    similarity: float | None = Field(None, description="Embedding similarity score")


class TranslationResponse(BaseModel):
    """Response body for translation endpoint."""

    success: bool = Field(True, description="Whether translation was successful")
    original_text: str = Field(..., description="Original input text")
    translations: list[TranslationItemSchema] = Field(
        ..., description="List of translated items"
    )
    stats: dict = Field(
        ...,
        description="Translation statistics",
        examples=[{"video_count": 3, "fingerspell_count": 2, "skipped_count": 1}],
    )


class HealthResponse(BaseModel):
    """Response body for health check endpoint."""

    status: str = Field("healthy", description="Service status")
    version: str = Field(..., description="API version")
    available_words: int = Field(..., description="Number of available sign videos")
