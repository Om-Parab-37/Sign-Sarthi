# Multi-stage build for smaller final image
FROM python:3.12-slim as builder

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-dev

# Download NLTK data
RUN uv run python -c "import nltk; nltk.download('punkt', download_dir='/usr/local/share/nltk_data')"

# Download SpaCy model
RUN uv run python -m spacy download en_core_web_sm


# Production stage
FROM python:3.12-slim

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /usr/local/share/nltk_data /usr/local/share/nltk_data

# Set environment variables
ENV PATH="/app/.venv/bin:$PATH"
ENV NLTK_DATA="/usr/local/share/nltk_data"
ENV PYTHONUNBUFFERED=1

# Copy application code
COPY app ./app

# Copy sign animation videos (optional - can be mounted as volume)
# COPY SignAnimations ./SignAnimations

# Expose port (Hugging Face Spaces defaults to 7860)
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; import os; port = os.environ.get('PORT', '7860'); urllib.request.urlopen(f'http://localhost:{port}/api/v1/health')" || exit 1

# Create a non-root user for security (Recommended for HF Spaces)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Run the application
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}
