# AI-005: Whisper STT Integration

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | AI-005 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 9-10 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | AI-001, AI-002 |

---

## 🎯 Objective

Integrate OpenAI Whisper cho Speech-to-Text:
- Load Whisper large-v3 model
- Process audio files từ S3
- Return transcript với timing
- GPU acceleration

---

## 📝 Implementation

### 1. Update requirements.txt

```txt
# Add to existing requirements.txt
openai-whisper==20231117
torch>=2.0.0
torchaudio>=2.0.0
boto3==1.34.0
soundfile==0.12.1
librosa==0.10.1
```

### 2. app/graders/speaking/whisper_stt.py

```python
import whisper
import torch
import tempfile
import structlog
from pathlib import Path
from typing import Optional
import soundfile as sf
import librosa

from app.config import get_settings
from app.utils.s3 import download_audio


logger = structlog.get_logger()
settings = get_settings()


class WhisperSTT:
    """Whisper-based Speech-to-Text."""
    
    _instance: Optional['WhisperSTT'] = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._model is None:
            self._load_model()
    
    def _load_model(self):
        """Load Whisper model."""
        logger.info(
            "Loading Whisper model",
            model=settings.whisper_model,
            device=settings.whisper_device,
        )
        
        device = settings.whisper_device
        if device == "cuda" and not torch.cuda.is_available():
            logger.warning("CUDA not available, falling back to CPU")
            device = "cpu"
        
        self._model = whisper.load_model(
            settings.whisper_model,
            device=device,
        )
        
        logger.info(
            "Whisper model loaded",
            device=device,
            fp16=device == "cuda",
        )
    
    async def transcribe(
        self,
        audio_url: str,
        language: str = "en",
    ) -> dict:
        """
        Transcribe audio to text.
        
        Args:
            audio_url: S3 presigned URL to audio file
            language: Language code (default: English)
            
        Returns:
            dict with transcript, segments, and duration
        """
        logger.info("Starting transcription", audio_url=audio_url[:50])
        
        # Download audio from S3
        audio_data = await download_audio(audio_url)
        
        # Save to temp file (Whisper needs file path)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            temp_path = f.name
            
            # Convert to WAV if needed
            audio_array, sample_rate = self._load_audio(audio_data)
            sf.write(temp_path, audio_array, sample_rate)
        
        try:
            # Transcribe
            result = self._model.transcribe(
                temp_path,
                language=language,
                fp16=settings.whisper_device == "cuda",
                word_timestamps=True,
            )
            
            # Calculate metrics
            duration = librosa.get_duration(y=audio_array, sr=sample_rate)
            word_count = len(result["text"].split())
            wpm = int(word_count / (duration / 60)) if duration > 0 else 0
            
            logger.info(
                "Transcription completed",
                duration=duration,
                word_count=word_count,
                wpm=wpm,
            )
            
            return {
                "transcript": result["text"].strip(),
                "segments": result["segments"],
                "duration": duration,
                "word_count": word_count,
                "words_per_minute": wpm,
                "language": result.get("language", language),
            }
            
        finally:
            # Cleanup temp file
            Path(temp_path).unlink(missing_ok=True)
    
    def _load_audio(self, audio_data: bytes) -> tuple:
        """Load audio data to numpy array."""
        with tempfile.NamedTemporaryFile(suffix=".tmp", delete=False) as f:
            f.write(audio_data)
            temp_path = f.name
        
        try:
            # Load with librosa (handles most formats)
            audio_array, sample_rate = librosa.load(
                temp_path,
                sr=16000,  # Whisper expects 16kHz
                mono=True,
            )
            return audio_array, sample_rate
        finally:
            Path(temp_path).unlink(missing_ok=True)
    
    def is_ready(self) -> bool:
        """Check if model is loaded."""
        return self._model is not None


# Singleton instance
whisper_stt = WhisperSTT()
```

### 3. app/utils/s3.py

```python
import boto3
import httpx
from io import BytesIO
import structlog

from app.config import get_settings


logger = structlog.get_logger()
settings = get_settings()


def get_s3_client():
    """Get S3/MinIO client."""
    return boto3.client(
        's3',
        endpoint_url=settings.s3_endpoint,
        aws_access_key_id=settings.s3_access_key,
        aws_secret_access_key=settings.s3_secret_key,
    )


async def download_audio(url: str) -> bytes:
    """
    Download audio from S3 presigned URL.
    
    Args:
        url: Presigned S3 URL
        
    Returns:
        Audio file bytes
    """
    logger.info("Downloading audio", url=url[:50])
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=60.0)
        response.raise_for_status()
        
        logger.info(
            "Audio downloaded",
            size=len(response.content),
            content_type=response.headers.get("content-type"),
        )
        
        return response.content


def generate_presigned_url(key: str, expires_in: int = 3600) -> str:
    """Generate presigned URL for S3 object."""
    client = get_s3_client()
    
    url = client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': settings.s3_bucket,
            'Key': key,
        },
        ExpiresIn=expires_in,
    )
    
    return url
```

### 4. Update app/api/health.py

```python
from app.graders.speaking.whisper_stt import whisper_stt
import torch


@router.get("/health", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)):
    """Health check with GPU and Whisper status."""
    
    rabbitmq_healthy = await rabbitmq.health_check()
    whisper_ready = whisper_stt.is_ready()
    gpu_available = torch.cuda.is_available()
    
    services = {
        "api": "healthy",
        "rabbitmq": "healthy" if rabbitmq_healthy else "unhealthy",
        "whisper": "ready" if whisper_ready else "not_loaded",
        "gpu": "available" if gpu_available else "not_available",
    }
    
    if gpu_available:
        services["gpu_name"] = torch.cuda.get_device_name(0)
        services["gpu_memory"] = f"{torch.cuda.get_device_properties(0).total_memory / 1e9:.1f}GB"
    
    overall_status = "healthy" if all([
        rabbitmq_healthy,
        whisper_ready,
    ]) else "degraded"
    
    return HealthResponse(
        status=overall_status,
        version=settings.app_version,
        timestamp=datetime.utcnow(),
        services=services,
    )
```

---

## ✅ Acceptance Criteria

- [ ] Whisper model loads successfully
- [ ] GPU acceleration works (if available)
- [ ] Audio download from S3 works
- [ ] Transcription returns accurate text
- [ ] Word timing available
- [ ] WPM calculated correctly
- [ ] Health check shows Whisper status
- [ ] Memory usage acceptable

---

## 🧪 Test

```python
# tests/test_whisper.py
import pytest
from app.graders.speaking.whisper_stt import WhisperSTT


@pytest.fixture
def whisper():
    return WhisperSTT()


def test_whisper_loads():
    stt = WhisperSTT()
    assert stt.is_ready()


@pytest.mark.asyncio
async def test_transcription(whisper, sample_audio_url):
    result = await whisper.transcribe(sample_audio_url)
    
    assert "transcript" in result
    assert "duration" in result
    assert "words_per_minute" in result
    assert result["words_per_minute"] > 0
```

---

## 📚 References

- Whisper GitHub: https://github.com/openai/whisper
- PyTorch CUDA: https://pytorch.org/get-started/locally/
