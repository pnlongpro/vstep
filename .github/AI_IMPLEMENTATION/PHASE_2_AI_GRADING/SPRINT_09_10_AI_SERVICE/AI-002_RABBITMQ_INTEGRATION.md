# AI-002: RabbitMQ Integration

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | AI-002 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 9-10 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 4h |
| **Dependencies** | AI-001 |

---

## 🎯 Objective

Integrate RabbitMQ message queue vào AI Service:
- Async consumer cho Writing jobs
- Async consumer cho Speaking jobs
- Result publisher để gửi kết quả về NestJS
- Connection management và retry logic

---

## 📝 Implementation

### 1. app/queue/connection.py

```python
import aio_pika
from aio_pika import Connection, Channel, ExchangeType
from typing import Optional
import structlog
import asyncio

from app.config import get_settings


logger = structlog.get_logger()
settings = get_settings()


class RabbitMQConnection:
    """Manages RabbitMQ connection and channels."""
    
    def __init__(self):
        self._connection: Optional[Connection] = None
        self._channel: Optional[Channel] = None
        self._exchange: Optional[aio_pika.Exchange] = None
        
    async def connect(self, max_retries: int = 5):
        """Establish connection to RabbitMQ."""
        for attempt in range(max_retries):
            try:
                logger.info(
                    "Connecting to RabbitMQ",
                    url=settings.rabbitmq_url,
                    attempt=attempt + 1,
                )
                
                self._connection = await aio_pika.connect_robust(
                    settings.rabbitmq_url,
                    timeout=30,
                )
                
                self._channel = await self._connection.channel()
                await self._channel.set_qos(prefetch_count=1)
                
                # Declare exchange
                self._exchange = await self._channel.declare_exchange(
                    "ai_grading",
                    ExchangeType.DIRECT,
                    durable=True,
                )
                
                logger.info("RabbitMQ connected successfully")
                return
                
            except Exception as e:
                logger.error(
                    "Failed to connect to RabbitMQ",
                    error=str(e),
                    attempt=attempt + 1,
                )
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)  # Exponential backoff
                else:
                    raise
    
    async def disconnect(self):
        """Close connection."""
        if self._connection and not self._connection.is_closed:
            await self._connection.close()
            logger.info("RabbitMQ disconnected")
    
    @property
    def channel(self) -> Channel:
        if not self._channel:
            raise RuntimeError("Not connected to RabbitMQ")
        return self._channel
    
    @property
    def exchange(self) -> aio_pika.Exchange:
        if not self._exchange:
            raise RuntimeError("Exchange not declared")
        return self._exchange
    
    async def health_check(self) -> bool:
        """Check if connection is healthy."""
        try:
            return (
                self._connection is not None 
                and not self._connection.is_closed
            )
        except Exception:
            return False


# Global connection instance
rabbitmq = RabbitMQConnection()
```

### 2. app/queue/consumer.py

```python
import aio_pika
from aio_pika import IncomingMessage
import json
import structlog
from typing import Callable, Awaitable
import asyncio

from app.config import get_settings
from app.queue.connection import rabbitmq
from app.models.job import WritingJob, SpeakingJob


logger = structlog.get_logger()
settings = get_settings()


class JobConsumer:
    """Consumes jobs from RabbitMQ queues."""
    
    def __init__(self):
        self._writing_queue = None
        self._speaking_queue = None
        self._running = False
        
    async def setup(self):
        """Setup queues."""
        channel = rabbitmq.channel
        
        # Declare queues
        self._writing_queue = await channel.declare_queue(
            settings.writing_queue,
            durable=True,
        )
        
        self._speaking_queue = await channel.declare_queue(
            settings.speaking_queue,
            durable=True,
        )
        
        # Bind to exchange
        await self._writing_queue.bind(
            rabbitmq.exchange,
            routing_key="writing",
        )
        
        await self._speaking_queue.bind(
            rabbitmq.exchange,
            routing_key="speaking",
        )
        
        logger.info("Job queues setup complete")
    
    async def start_consuming(
        self,
        writing_handler: Callable[[WritingJob], Awaitable[None]],
        speaking_handler: Callable[[SpeakingJob], Awaitable[None]],
    ):
        """Start consuming jobs from queues."""
        self._running = True
        
        # Create message handlers
        async def handle_writing(message: IncomingMessage):
            async with message.process():
                try:
                    job_data = json.loads(message.body.decode())
                    job = WritingJob(**job_data)
                    
                    logger.info(
                        "Received writing job",
                        job_id=job.job_id,
                    )
                    
                    await writing_handler(job)
                    
                except Exception as e:
                    logger.error(
                        "Failed to process writing job",
                        error=str(e),
                    )
                    # Message will be requeued
                    raise
        
        async def handle_speaking(message: IncomingMessage):
            async with message.process():
                try:
                    job_data = json.loads(message.body.decode())
                    job = SpeakingJob(**job_data)
                    
                    logger.info(
                        "Received speaking job",
                        job_id=job.job_id,
                    )
                    
                    await speaking_handler(job)
                    
                except Exception as e:
                    logger.error(
                        "Failed to process speaking job",
                        error=str(e),
                    )
                    raise
        
        # Start consuming
        await self._writing_queue.consume(handle_writing)
        await self._speaking_queue.consume(handle_speaking)
        
        logger.info("Started consuming jobs")
        
        # Keep running
        while self._running:
            await asyncio.sleep(1)
    
    def stop(self):
        """Stop consuming."""
        self._running = False


consumer = JobConsumer()
```

### 3. app/queue/publisher.py

```python
import aio_pika
import json
import structlog
from typing import Union

from app.config import get_settings
from app.queue.connection import rabbitmq
from app.models.job import WritingResult, SpeakingResult


logger = structlog.get_logger()
settings = get_settings()


class ResultPublisher:
    """Publishes grading results."""
    
    async def setup(self):
        """Setup result queue."""
        channel = rabbitmq.channel
        
        # Declare result queue
        self._result_queue = await channel.declare_queue(
            settings.result_queue,
            durable=True,
        )
        
        await self._result_queue.bind(
            rabbitmq.exchange,
            routing_key="result",
        )
        
        logger.info("Result queue setup complete")
    
    async def publish_result(
        self,
        result: Union[WritingResult, SpeakingResult],
    ):
        """Publish grading result."""
        try:
            message = aio_pika.Message(
                body=json.dumps(result.model_dump()).encode(),
                content_type="application/json",
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            )
            
            await rabbitmq.exchange.publish(
                message,
                routing_key="result",
            )
            
            logger.info(
                "Published result",
                job_id=result.job_id,
                status=result.status,
            )
            
        except Exception as e:
            logger.error(
                "Failed to publish result",
                job_id=result.job_id,
                error=str(e),
            )
            raise


publisher = ResultPublisher()
```

### 4. app/models/job.py

```python
from pydantic import BaseModel
from typing import Optional, Literal, List
from enum import Enum


class TargetLevel(str, Enum):
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


# ============ Writing ============

class WritingJob(BaseModel):
    """Writing grading job from queue."""
    job_id: str
    user_id: int
    attempt_id: int
    question_id: int
    task_type: Literal["task1", "task2"]
    prompt: str
    student_answer: str
    target_level: TargetLevel
    callback_url: str


class GrammarError(BaseModel):
    """Grammar error details."""
    text: str
    position: tuple[int, int]
    correction: str
    explanation: str


class WritingScoreData(BaseModel):
    """Writing scoring result data."""
    overall_score: float
    task_achievement: float
    coherence_cohesion: float
    lexical_resource: float
    grammatical_range: float
    feedback: str
    suggestions: List[str]
    grammar_errors: List[GrammarError]
    word_count: int
    processing_time: float


class WritingResult(BaseModel):
    """Writing grading result."""
    job_id: str
    status: JobStatus
    result: Optional[WritingScoreData] = None
    error: Optional[str] = None


# ============ Speaking ============

class SpeakingJob(BaseModel):
    """Speaking grading job from queue."""
    job_id: str
    user_id: int
    attempt_id: int
    question_id: int
    part_number: Literal[1, 2, 3]
    audio_url: str
    target_level: TargetLevel
    callback_url: str


class PronunciationError(BaseModel):
    """Pronunciation error details."""
    word: str
    phonetic: str
    issue: str


class SpeakingScoreData(BaseModel):
    """Speaking scoring result data."""
    overall_score: float
    pronunciation: float
    fluency: float
    grammar: float
    vocabulary: float
    transcript: str
    words_per_minute: int
    feedback: str
    suggestions: List[str]
    pronunciation_errors: List[PronunciationError]
    processing_time: float


class SpeakingResult(BaseModel):
    """Speaking grading result."""
    job_id: str
    status: JobStatus
    result: Optional[SpeakingScoreData] = None
    error: Optional[str] = None
```

### 5. Update app/main.py - Lifespan

```python
from app.queue.connection import rabbitmq
from app.queue.consumer import consumer
from app.queue.publisher import publisher


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    setup_logging(debug=settings.debug)
    logger.info("AI Service starting up", version=settings.app_version)
    
    # Connect to RabbitMQ
    await rabbitmq.connect()
    await consumer.setup()
    await publisher.setup()
    
    # Start consuming in background
    # Note: Handlers will be added in AI-004 and AI-007
    # asyncio.create_task(consumer.start_consuming(...))
    
    yield
    
    # Shutdown
    consumer.stop()
    await rabbitmq.disconnect()
    logger.info("AI Service shutting down")
```

### 6. Update app/api/health.py

```python
from app.queue.connection import rabbitmq


@router.get("/health", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)):
    """Health check with RabbitMQ status."""
    
    rabbitmq_healthy = await rabbitmq.health_check()
    
    services = {
        "api": "healthy",
        "rabbitmq": "healthy" if rabbitmq_healthy else "unhealthy",
        "gpu": "unknown",
    }
    
    overall_status = "healthy" if rabbitmq_healthy else "degraded"
    
    return HealthResponse(
        status=overall_status,
        version=settings.app_version,
        timestamp=datetime.utcnow(),
        services=services,
    )
```

---

## ✅ Acceptance Criteria

- [ ] Connection to RabbitMQ established
- [ ] Writing queue declared and bound
- [ ] Speaking queue declared and bound
- [ ] Result queue declared and bound
- [ ] Consumer receives test messages
- [ ] Publisher sends test messages
- [ ] Retry logic works on connection failure
- [ ] Health check shows RabbitMQ status
- [ ] Graceful shutdown works

---

## 🧪 Test

```python
# tests/test_queue.py
import pytest
from unittest.mock import AsyncMock, patch
from app.queue.connection import RabbitMQConnection
from app.models.job import WritingJob, WritingResult, JobStatus


@pytest.mark.asyncio
async def test_connection():
    with patch('aio_pika.connect_robust', new_callable=AsyncMock) as mock:
        conn = RabbitMQConnection()
        await conn.connect()
        mock.assert_called_once()


@pytest.mark.asyncio
async def test_writing_job_model():
    job = WritingJob(
        job_id="test-123",
        user_id=1,
        attempt_id=1,
        question_id=1,
        task_type="task1",
        prompt="Write about...",
        student_answer="My essay...",
        target_level="B1",
        callback_url="http://localhost:3000/callback",
    )
    assert job.job_id == "test-123"
    assert job.target_level.value == "B1"
```

---

## 📚 References

- aio-pika: https://aio-pika.readthedocs.io/
- RabbitMQ tutorials: https://www.rabbitmq.com/tutorials
