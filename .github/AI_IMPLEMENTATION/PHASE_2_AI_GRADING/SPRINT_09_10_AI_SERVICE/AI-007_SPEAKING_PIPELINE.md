# AI-007: Speaking Scorer Pipeline

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | AI-007 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 9-10 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 6h |
| **Dependencies** | AI-005, AI-006 |

---

## 🎯 Objective

Build complete Speaking scoring pipeline:
- Combine Whisper STT + Pronunciation + GPT analysis
- Score 4 criteria: Pronunciation, Fluency, Grammar, Vocabulary
- Generate feedback và suggestions

---

## 📝 Implementation

### 1. app/graders/speaking/scorer.py

```python
import time
import structlog
from typing import Optional

from app.config import get_settings
from app.models.job import (
    SpeakingJob,
    SpeakingScoreData,
    PronunciationError,
)
from app.graders.speaking.whisper_stt import whisper_stt
from app.graders.speaking.pronunciation import pronunciation_analyzer
from app.graders.speaking.fluency import fluency_analyzer
from app.graders.speaking.gpt_analyzer import gpt_speaking_analyzer


logger = structlog.get_logger()
settings = get_settings()


class SpeakingScorer:
    """Complete speaking scoring pipeline."""
    
    async def score(self, job: SpeakingJob) -> SpeakingScoreData:
        """
        Score a speaking submission through full pipeline.
        
        Pipeline:
        1. Whisper STT → Get transcript
        2. Fluency Analysis → Calculate WPM, pauses, hesitations
        3. Pronunciation Analysis → Score pronunciation
        4. GPT Analysis → Score grammar & vocabulary from transcript
        5. Combine scores → Generate feedback
        """
        start_time = time.time()
        
        logger.info(
            "Starting speaking scoring pipeline",
            job_id=job.job_id,
            part=job.part_number,
            level=job.target_level,
        )
        
        try:
            # Step 1: Speech-to-Text
            logger.info("Step 1: Transcription", job_id=job.job_id)
            stt_result = await whisper_stt.transcribe(job.audio_url)
            
            transcript = stt_result["transcript"]
            duration = stt_result["duration"]
            wpm = stt_result["words_per_minute"]
            
            # Step 2: Fluency Analysis
            logger.info("Step 2: Fluency analysis", job_id=job.job_id)
            fluency_result = await fluency_analyzer.analyze(
                audio_url=job.audio_url,
                transcript=transcript,
                duration=duration,
                target_level=job.target_level.value,
            )
            
            # Step 3: Pronunciation Analysis
            logger.info("Step 3: Pronunciation analysis", job_id=job.job_id)
            pronunciation_result = await pronunciation_analyzer.analyze(
                audio_url=job.audio_url,
                transcript=transcript,
                target_level=job.target_level.value,
            )
            
            # Step 4: GPT Grammar & Vocabulary Analysis
            logger.info("Step 4: GPT analysis", job_id=job.job_id)
            gpt_result = await gpt_speaking_analyzer.analyze(
                transcript=transcript,
                part_number=job.part_number,
                target_level=job.target_level.value,
            )
            
            # Step 5: Combine scores
            overall_score = self._calculate_overall(
                pronunciation=pronunciation_result["score"],
                fluency=fluency_result["score"],
                grammar=gpt_result["grammar_score"],
                vocabulary=gpt_result["vocabulary_score"],
            )
            
            processing_time = time.time() - start_time
            
            result = SpeakingScoreData(
                overall_score=overall_score,
                pronunciation=pronunciation_result["score"],
                fluency=fluency_result["score"],
                grammar=gpt_result["grammar_score"],
                vocabulary=gpt_result["vocabulary_score"],
                transcript=transcript,
                words_per_minute=wpm,
                feedback=self._generate_feedback(
                    pronunciation_result,
                    fluency_result,
                    gpt_result,
                    job.target_level.value,
                ),
                suggestions=gpt_result.get("suggestions", []),
                pronunciation_errors=[
                    PronunciationError(
                        word=e["word"],
                        phonetic=e["phonetic"],
                        issue=e["issue"],
                    )
                    for e in pronunciation_result.get("errors", [])
                ],
                processing_time=processing_time,
            )
            
            logger.info(
                "Speaking scoring completed",
                job_id=job.job_id,
                overall_score=overall_score,
                processing_time=processing_time,
            )
            
            return result
            
        except Exception as e:
            logger.error(
                "Speaking scoring failed",
                job_id=job.job_id,
                error=str(e),
            )
            raise
    
    def _calculate_overall(
        self,
        pronunciation: float,
        fluency: float,
        grammar: float,
        vocabulary: float,
    ) -> float:
        """
        Calculate overall score with weighted average.
        
        Weights based on VSTEP criteria:
        - Pronunciation: 30%
        - Fluency: 25%
        - Grammar: 25%
        - Vocabulary: 20%
        """
        weighted = (
            pronunciation * 0.30 +
            fluency * 0.25 +
            grammar * 0.25 +
            vocabulary * 0.20
        )
        return round(weighted, 1)
    
    def _generate_feedback(
        self,
        pronunciation_result: dict,
        fluency_result: dict,
        gpt_result: dict,
        target_level: str,
    ) -> str:
        """Generate overall feedback in Vietnamese."""
        parts = []
        
        # Pronunciation feedback
        pron_score = pronunciation_result["score"]
        if pron_score >= 8:
            parts.append("Phát âm rất tốt và rõ ràng.")
        elif pron_score >= 6:
            parts.append("Phát âm khá tốt, một số âm cần cải thiện.")
        else:
            parts.append("Cần chú ý cải thiện phát âm để người nghe dễ hiểu hơn.")
        
        # Fluency feedback
        fluency_score = fluency_result["score"]
        if fluency_score >= 8:
            parts.append("Nói trôi chảy và tự nhiên.")
        elif fluency_score >= 6:
            parts.append("Nói khá trôi chảy, đôi khi có chút ngập ngừng.")
        else:
            parts.append("Cần luyện tập để nói trôi chảy hơn, giảm ngập ngừng.")
        
        # Grammar & Vocabulary
        if gpt_result.get("feedback"):
            parts.append(gpt_result["feedback"])
        
        return " ".join(parts)


# Global instance
speaking_scorer = SpeakingScorer()
```

### 2. app/graders/speaking/gpt_analyzer.py

```python
import openai
import json
import structlog

from app.config import get_settings


logger = structlog.get_logger()
settings = get_settings()


class GPTSpeakingAnalyzer:
    """GPT-based analysis for speaking grammar & vocabulary."""
    
    def __init__(self):
        self.client = openai.AsyncOpenAI(
            api_key=settings.openai_api_key,
        )
        self.model = settings.openai_model
    
    async def analyze(
        self,
        transcript: str,
        part_number: int,
        target_level: str,
    ) -> dict:
        """
        Analyze transcript for grammar and vocabulary.
        
        Returns:
            dict with grammar_score, vocabulary_score, feedback, suggestions
        """
        prompt = self._build_prompt(transcript, part_number, target_level)
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a VSTEP Speaking examiner. Analyze the transcript and score grammar and vocabulary. Always respond in valid JSON.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.3,
            max_tokens=1500,
            response_format={"type": "json_object"},
        )
        
        content = response.choices[0].message.content
        result = json.loads(content)
        
        logger.info(
            "GPT speaking analysis completed",
            grammar_score=result.get("grammar_score"),
            vocabulary_score=result.get("vocabulary_score"),
        )
        
        return result
    
    def _build_prompt(
        self,
        transcript: str,
        part_number: int,
        target_level: str,
    ) -> str:
        part_desc = {
            1: "Social Interaction - Hội thoại xã giao",
            2: "Solution Discussion - Thảo luận giải pháp",
            3: "Topic Development - Phát triển chủ đề",
        }
        
        return f"""
# VSTEP Speaking Analysis

## Context
- Part: {part_number} ({part_desc.get(part_number, "")})
- Target Level: {target_level}

## Transcript
{transcript}

## Scoring Instructions

Analyze the transcript and score:

1. **Grammar (0-10)**
   - Variety of structures
   - Accuracy of structures
   - Appropriate complexity for {target_level}

2. **Vocabulary (0-10)**
   - Range of vocabulary
   - Accuracy of word choice
   - Appropriate for topic and level

## Response Format (JSON)

{{
  "grammar_score": <float 0-10>,
  "vocabulary_score": <float 0-10>,
  "feedback": "<brief feedback in Vietnamese, 1-2 sentences>",
  "suggestions": [
    "<improvement suggestion 1 in Vietnamese>",
    "<improvement suggestion 2 in Vietnamese>"
  ],
  "grammar_issues": [
    "<specific grammar issue found>"
  ],
  "vocabulary_highlights": [
    "<good vocabulary used>"
  ]
}}
"""


# Global instance
gpt_speaking_analyzer = GPTSpeakingAnalyzer()
```

### 3. app/graders/speaking/fluency.py

```python
import structlog
from typing import Optional

from app.config import get_settings


logger = structlog.get_logger()
settings = get_settings()


class FluencyAnalyzer:
    """Analyze speaking fluency based on WPM and patterns."""
    
    async def analyze(
        self,
        audio_url: str,
        transcript: str,
        duration: float,
        target_level: str,
    ) -> dict:
        """
        Analyze fluency metrics.
        
        Criteria:
        - Words per minute (ideal: 120-150 for B2)
        - Pause patterns (TODO: audio analysis)
        - Filler words count
        """
        word_count = len(transcript.split())
        wpm = int(word_count / (duration / 60)) if duration > 0 else 0
        
        # Count filler words
        filler_words = ["um", "uh", "er", "ah", "like", "you know", "so"]
        filler_count = sum(
            transcript.lower().count(filler) 
            for filler in filler_words
        )
        
        # Calculate score based on WPM and fillers
        score = self._calculate_score(wpm, filler_count, word_count, target_level)
        
        return {
            "score": score,
            "wpm": wpm,
            "filler_count": filler_count,
            "filler_ratio": filler_count / max(word_count, 1),
        }
    
    def _calculate_score(
        self,
        wpm: int,
        filler_count: int,
        word_count: int,
        target_level: str,
    ) -> float:
        """Calculate fluency score (0-10)."""
        
        # WPM targets by level
        wpm_targets = {
            "A2": (80, 100),
            "B1": (100, 130),
            "B2": (120, 150),
            "C1": (140, 170),
        }
        
        min_wpm, ideal_wpm = wpm_targets.get(target_level, (100, 130))
        
        # WPM score (0-6 points)
        if wpm >= ideal_wpm:
            wpm_score = 6
        elif wpm >= min_wpm:
            wpm_score = 4 + 2 * (wpm - min_wpm) / (ideal_wpm - min_wpm)
        elif wpm >= min_wpm * 0.7:
            wpm_score = 2 + 2 * (wpm - min_wpm * 0.7) / (min_wpm * 0.3)
        else:
            wpm_score = max(0, 2 * wpm / (min_wpm * 0.7))
        
        # Filler penalty (0-4 points)
        filler_ratio = filler_count / max(word_count, 1)
        if filler_ratio < 0.02:
            filler_score = 4
        elif filler_ratio < 0.05:
            filler_score = 3
        elif filler_ratio < 0.1:
            filler_score = 2
        else:
            filler_score = max(0, 1 - (filler_ratio - 0.1) * 10)
        
        total = wpm_score + filler_score
        return round(min(10, total), 1)


# Global instance
fluency_analyzer = FluencyAnalyzer()
```

### 4. app/workers/speaking_worker.py

```python
import structlog
import httpx

from app.config import get_settings
from app.models.job import SpeakingJob, SpeakingResult, JobStatus
from app.graders.speaking.scorer import speaking_scorer
from app.queue.publisher import publisher


logger = structlog.get_logger()
settings = get_settings()


async def process_speaking_job(job: SpeakingJob):
    """
    Process a speaking grading job.
    
    1. Score with full pipeline
    2. Publish result to queue
    3. Callback to NestJS backend
    """
    try:
        logger.info(
            "Processing speaking job",
            job_id=job.job_id,
            user_id=job.user_id,
            part=job.part_number,
        )
        
        # Score the speaking
        score_data = await speaking_scorer.score(job)
        
        # Create result
        result = SpeakingResult(
            job_id=job.job_id,
            status=JobStatus.COMPLETED,
            result=score_data,
        )
        
        # Publish to result queue
        await publisher.publish_result(result)
        
        # Callback to NestJS
        await send_callback(job.callback_url, result)
        
        logger.info(
            "Speaking job completed",
            job_id=job.job_id,
            overall_score=score_data.overall_score,
        )
        
    except Exception as e:
        logger.error(
            "Speaking job failed",
            job_id=job.job_id,
            error=str(e),
        )
        
        # Publish failure result
        result = SpeakingResult(
            job_id=job.job_id,
            status=JobStatus.FAILED,
            error=str(e),
        )
        
        await publisher.publish_result(result)
        await send_callback(job.callback_url, result)


async def send_callback(url: str, result: SpeakingResult):
    """Send result callback to NestJS."""
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                url,
                json=result.model_dump(),
                headers={
                    "X-Callback-Secret": settings.callback_secret,
                    "Content-Type": "application/json",
                },
                timeout=10.0,
            )
    except Exception as e:
        logger.error("Callback error", url=url, error=str(e))
```

### 5. Update main.py - Complete Consumer

```python
from app.workers.writing_worker import process_writing_job
from app.workers.speaking_worker import process_speaking_job


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging(debug=settings.debug)
    logger.info("AI Service starting up", version=settings.app_version)
    
    await rabbitmq.connect()
    await consumer.setup()
    await publisher.setup()
    
    # Start consuming both queues
    asyncio.create_task(
        consumer.start_consuming(
            writing_handler=process_writing_job,
            speaking_handler=process_speaking_job,
        )
    )
    
    yield
    
    consumer.stop()
    await rabbitmq.disconnect()
    logger.info("AI Service shutting down")
```

---

## ✅ Acceptance Criteria

- [ ] Full pipeline executes successfully
- [ ] Whisper transcription accurate
- [ ] Fluency score calculated from WPM + fillers
- [ ] Pronunciation score from analyzer
- [ ] GPT returns grammar + vocabulary scores
- [ ] Overall score weighted correctly
- [ ] Feedback in Vietnamese
- [ ] Pronunciation errors listed
- [ ] Processing time < 10 seconds
- [ ] Results published to queue

---

## 🧪 Test

```python
@pytest.mark.asyncio
async def test_speaking_pipeline():
    from app.graders.speaking.scorer import SpeakingScorer
    from app.models.job import SpeakingJob
    
    scorer = SpeakingScorer()
    
    job = SpeakingJob(
        job_id="test-123",
        user_id=1,
        attempt_id=1,
        question_id=1,
        part_number=2,
        audio_url="https://test-bucket.s3.amazonaws.com/test.wav",
        target_level="B1",
        callback_url="http://localhost:3000/callback",
    )
    
    result = await scorer.score(job)
    
    assert result.overall_score >= 0
    assert result.overall_score <= 10
    assert result.transcript
    assert result.words_per_minute > 0
```
