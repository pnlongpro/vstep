# AI-001: FastAPI Project Setup

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | AI-001 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 9-10 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | None |

---

## 🎯 Objective

Setup Python FastAPI project cho AI Grading Service:
- Project structure theo best practices
- Docker containerization
- Health check endpoints
- Logging và error handling
- Environment configuration

---

## 📂 Project Structure

```
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry
│   ├── config.py                  # Pydantic settings
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py              # API router
│   │   └── health.py              # Health endpoints
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── logging.py             # Structured logging
│   │   └── exceptions.py          # Custom exceptions
│   │
│   └── models/
│       ├── __init__.py
│       └── base.py                # Pydantic base models
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_health.py
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── pyproject.toml
├── .env.example
└── README.md
```

---

## 📝 Implementation

### 1. requirements.txt

```txt
# Core
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.6.0
pydantic-settings==2.1.0

# Async
aiohttp==3.9.3
httpx==0.26.0

# Queue
pika==1.3.2
aio-pika==9.3.1

# AI/ML
openai==1.12.0
# whisper sẽ add ở AI-005

# Utilities
python-multipart==0.0.6
python-dotenv==1.0.1
structlog==24.1.0

# Testing
pytest==8.0.0
pytest-asyncio==0.23.4
pytest-cov==4.1.0
```

### 2. app/config.py

```python
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App
    app_name: str = "VSTEPRO AI Service"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4-turbo"
    
    # RabbitMQ
    rabbitmq_url: str = "amqp://localhost:5672"
    writing_queue: str = "ai.writing.jobs"
    speaking_queue: str = "ai.speaking.jobs"
    result_queue: str = "ai.results"
    
    # S3/MinIO
    s3_endpoint: str = "http://localhost:9000"
    s3_access_key: str
    s3_secret_key: str
    s3_bucket: str = "vstepro-audio"
    
    # Backend callback
    backend_url: str = "http://localhost:3000"
    callback_secret: str
    
    # Whisper (cho Speaking)
    whisper_model: str = "large-v3"
    whisper_device: str = "cuda"  # hoặc "cpu"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
```

### 3. app/main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

from app.config import get_settings
from app.api.router import api_router
from app.core.logging import setup_logging


settings = get_settings()
logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    setup_logging(debug=settings.debug)
    logger.info("AI Service starting up", version=settings.app_version)
    
    # TODO: Initialize RabbitMQ connection (AI-002)
    # TODO: Load Whisper model (AI-005)
    
    yield
    
    # Shutdown
    logger.info("AI Service shutting down")
    # TODO: Close connections


def create_app() -> FastAPI:
    """Create FastAPI application."""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="AI Grading Service for VSTEPRO",
        lifespan=lifespan,
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
    )
    
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Routes
    app.include_router(api_router, prefix="/api")
    
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
```

### 4. app/api/health.py

```python
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import datetime
import structlog

from app.config import get_settings, Settings


router = APIRouter(tags=["Health"])
logger = structlog.get_logger()


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
    services: dict


@router.get("/health", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)):
    """
    Health check endpoint.
    Returns service status and dependency health.
    """
    # TODO: Check RabbitMQ connection
    # TODO: Check GPU availability
    
    services = {
        "api": "healthy",
        "rabbitmq": "unknown",  # Will be implemented in AI-002
        "gpu": "unknown",       # Will be implemented in AI-005
    }
    
    return HealthResponse(
        status="healthy",
        version=settings.app_version,
        timestamp=datetime.utcnow(),
        services=services,
    )


@router.get("/ready")
async def readiness_check():
    """Kubernetes readiness probe."""
    # TODO: Check if all models are loaded
    return {"ready": True}


@router.get("/live")
async def liveness_check():
    """Kubernetes liveness probe."""
    return {"alive": True}
```

### 5. app/api/router.py

```python
from fastapi import APIRouter

from app.api.health import router as health_router


api_router = APIRouter()

# Include sub-routers
api_router.include_router(health_router)

# TODO: Add webhook router for callbacks (AI-004, AI-007)
```

### 6. app/core/logging.py

```python
import structlog
import logging
import sys


def setup_logging(debug: bool = False):
    """Configure structured logging."""
    
    # Set log level
    log_level = logging.DEBUG if debug else logging.INFO
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.dev.ConsoleRenderer() if debug 
            else structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(log_level),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )
    
    # Configure standard library logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=log_level,
    )
```

### 7. app/core/exceptions.py

```python
from fastapi import HTTPException
from typing import Any, Optional


class AIServiceException(Exception):
    """Base exception for AI Service."""
    
    def __init__(self, message: str, details: Optional[Any] = None):
        self.message = message
        self.details = details
        super().__init__(message)


class GradingException(AIServiceException):
    """Exception during grading process."""
    pass


class QueueException(AIServiceException):
    """Exception with message queue."""
    pass


class ModelException(AIServiceException):
    """Exception with AI model."""
    pass


def handle_exception(exc: AIServiceException) -> HTTPException:
    """Convert AIServiceException to HTTPException."""
    return HTTPException(
        status_code=500,
        detail={
            "error": exc.__class__.__name__,
            "message": exc.message,
            "details": exc.details,
        }
    )
```

### 8. Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app/ ./app/

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Environment
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 9. docker-compose.yml

```yaml
version: '3.8'

services:
  ai-service:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - S3_ENDPOINT=http://minio:9000
      - S3_ACCESS_KEY=minioadmin
      - S3_SECRET_KEY=minioadmin
      - BACKEND_URL=http://backend:3000
      - CALLBACK_SECRET=${CALLBACK_SECRET}
      - DEBUG=true
    depends_on:
      - rabbitmq
      - minio
    volumes:
      - ./app:/app/app  # Dev hot reload

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    healthcheck:
      test: rabbitmq-diagnostics check_running
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio-data:/data

volumes:
  minio-data:
```

### 10. .env.example

```env
# App
DEBUG=true
APP_VERSION=1.0.0

# OpenAI
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
WRITING_QUEUE=ai.writing.jobs
SPEAKING_QUEUE=ai.speaking.jobs
RESULT_QUEUE=ai.results

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=vstepro-audio

# Backend
BACKEND_URL=http://localhost:3000
CALLBACK_SECRET=your-secret-here

# Whisper
WHISPER_MODEL=large-v3
WHISPER_DEVICE=cuda
```

---

## ✅ Acceptance Criteria

- [ ] FastAPI app runs successfully
- [ ] Health check returns 200
- [ ] Docker build succeeds
- [ ] docker-compose up starts all services
- [ ] Structured logging works
- [ ] Environment variables load correctly
- [ ] Tests pass

---

## 🧪 Test

```python
# tests/test_health.py
import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data


@pytest.mark.asyncio
async def test_liveness():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/live")
        assert response.status_code == 200
        assert response.json()["alive"] is True
```

---

## 📚 References

- FastAPI docs: https://fastapi.tiangolo.com/
- Pydantic Settings: https://docs.pydantic.dev/latest/concepts/pydantic_settings/
- Structlog: https://www.structlog.org/
