"""
FastAPI Application Entry Point.
Assembles all components and configures the application.
"""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import health, translation
from app.config import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Downloads NLTK data if not present.
    """
    # Startup
    import nltk
    try:
        nltk.data.find("tokenizers/punkt")
    except LookupError:
        nltk.download("punkt", quiet=True)
    
    yield
    
    # Shutdown (cleanup if needed)


def create_app() -> FastAPI:
    """
    Application factory.
    Creates and configures the FastAPI application.
    
    Factory pattern allows:
    - Different configurations for testing
    - Clean separation of concerns
    """
    settings = get_settings()
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="API for translating text to sign language animations",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Register API routes
    app.include_router(health.router, prefix="/api/v1")
    app.include_router(translation.router, prefix="/api/v1")
    
    # Mount static files for sign videos
    videos_dir = settings.videos_directory
    if videos_dir.exists():
        app.mount(
            "/signs",
            StaticFiles(directory=str(videos_dir)),
            name="signs",
        )
    
    @app.get("/", tags=["Root"])
    async def root():
        """Root endpoint - API information."""
        return {
            "name": settings.app_name,
            "version": settings.app_version,
            "docs": "/docs",
            "health": "/api/v1/health",
        }
    
    return app


# Create the app instance
app = create_app()
