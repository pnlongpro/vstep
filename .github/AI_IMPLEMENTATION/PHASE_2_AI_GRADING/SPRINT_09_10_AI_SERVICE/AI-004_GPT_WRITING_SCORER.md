# AI-004: GPT-4 Writing Scorer

## 📋 Task Info

| Attribute | Value |
|-----------|-------|
| **Task ID** | AI-004 |
| **Phase** | 2 - AI Grading |
| **Sprint** | 9-10 |
| **Priority** | P0 (Critical) |
| **Estimated Hours** | 8h |
| **Dependencies** | AI-001, AI-002 |

---

## 🎯 Objective

Implement GPT-4 based Writing Scorer:
- 4 tiêu chí VSTEP (Task Achievement, Coherence, Lexical, Grammar)
- Phát hiện lỗi grammar với vị trí
- Feedback và suggestions bằng tiếng Việt
- Word count và processing time

---

## 📝 Implementation

### 1. app/graders/writing/scorer.py

```python
import openai
import json
import time
import structlog
from typing import Optional

from app.config import get_settings
from app.models.job import (
    WritingJob, 
    WritingScoreData, 
    GrammarError,
    TargetLevel,
)
from app.graders.writing.prompts import (
    get_scoring_prompt,
    get_grammar_check_prompt,
)


logger = structlog.get_logger()
settings = get_settings()


class WritingScorer:
    """GPT-4 based writing scorer."""
    
    def __init__(self):
        self.client = openai.AsyncOpenAI(
            api_key=settings.openai_api_key,
        )
        self.model = settings.openai_model
    
    async def score(self, job: WritingJob) -> WritingScoreData:
        """
        Score a writing submission.
        
        Args:
            job: Writing job containing prompt and answer
            
        Returns:
            WritingScoreData with scores and feedback
        """
        start_time = time.time()
        
        logger.info(
            "Starting writing scoring",
            job_id=job.job_id,
            task_type=job.task_type,
            target_level=job.target_level,
        )
        
        try:
            # Step 1: Get main scores and feedback
            scores = await self._get_scores(job)
            
            # Step 2: Get detailed grammar errors
            grammar_errors = await self._get_grammar_errors(
                job.student_answer,
                job.target_level,
            )
            
            # Step 3: Calculate word count
            word_count = len(job.student_answer.split())
            
            processing_time = time.time() - start_time
            
            result = WritingScoreData(
                overall_score=scores["overall_score"],
                task_achievement=scores["task_achievement"],
                coherence_cohesion=scores["coherence_cohesion"],
                lexical_resource=scores["lexical_resource"],
                grammatical_range=scores["grammatical_range"],
                feedback=scores["feedback"],
                suggestions=scores["suggestions"],
                grammar_errors=grammar_errors,
                word_count=word_count,
                processing_time=processing_time,
            )
            
            logger.info(
                "Writing scoring completed",
                job_id=job.job_id,
                overall_score=result.overall_score,
                processing_time=processing_time,
            )
            
            return result
            
        except Exception as e:
            logger.error(
                "Writing scoring failed",
                job_id=job.job_id,
                error=str(e),
            )
            raise
    
    async def _get_scores(self, job: WritingJob) -> dict:
        """Get main scores from GPT-4."""
        prompt = get_scoring_prompt(
            task_type=job.task_type,
            target_level=job.target_level.value,
            prompt_text=job.prompt,
            student_answer=job.student_answer,
        )
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a VSTEP English proficiency examiner. Always respond in valid JSON format.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.3,
            max_tokens=2000,
            response_format={"type": "json_object"},
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
    
    async def _get_grammar_errors(
        self, 
        text: str,
        target_level: TargetLevel,
    ) -> list[GrammarError]:
        """Get detailed grammar errors."""
        prompt = get_grammar_check_prompt(text, target_level.value)
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an English grammar expert. Always respond in valid JSON format.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
            max_tokens=2000,
            response_format={"type": "json_object"},
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        return [
            GrammarError(
                text=err["text"],
                position=(err["start"], err["end"]),
                correction=err["correction"],
                explanation=err["explanation"],
            )
            for err in data.get("errors", [])
        ]


# Global instance
writing_scorer = WritingScorer()
```

### 2. app/graders/writing/prompts.py

```python
def get_scoring_prompt(
    task_type: str,
    target_level: str,
    prompt_text: str,
    student_answer: str,
) -> str:
    """Generate scoring prompt for GPT-4."""
    
    return f"""
# VSTEP Writing Scoring Task

## Task Information
- Task Type: {task_type.upper()} ({"Email/Letter" if task_type == "task1" else "Essay"})
- Target Level: {target_level}
- Word Limit: {"120-150 words" if task_type == "task1" else "250-300 words"}

## Writing Prompt
{prompt_text}

## Student's Answer
{student_answer}

## Scoring Instructions

Score the writing based on VSTEP {target_level} level criteria. Use a 0-10 scale for each criterion.

### Scoring Criteria

1. **Task Achievement (TA)** - 0 to 10
   - Does the response fully address all parts of the task?
   - Is the position clear and consistent throughout?
   - Are ideas fully extended and well-supported?
   - For {target_level}: {"Basic task completion expected" if target_level == "A2" else "Good task completion with some development" if target_level == "B1" else "Clear, well-developed response" if target_level == "B2" else "Sophisticated, nuanced response"}

2. **Coherence & Cohesion (CC)** - 0 to 10
   - Is information organized logically with clear progression?
   - Is there effective use of paragraphing?
   - Are cohesive devices used effectively?
   - For {target_level}: {"Simple linking words" if target_level == "A2" else "Basic cohesive devices" if target_level == "B1" else "Varied cohesive devices" if target_level == "B2" else "Sophisticated cohesion"}

3. **Lexical Resource (LR)** - 0 to 10
   - Is there a sufficient range of vocabulary?
   - Is vocabulary used accurately and appropriately?
   - Are there spelling errors?
   - For {target_level}: {"Basic vocabulary" if target_level == "A2" else "Adequate vocabulary" if target_level == "B1" else "Wide vocabulary range" if target_level == "B2" else "Sophisticated vocabulary"}

4. **Grammatical Range & Accuracy (GRA)** - 0 to 10
   - Is there a variety of sentence structures?
   - Are structures used accurately?
   - Is punctuation correct?
   - For {target_level}: {"Simple structures" if target_level == "A2" else "Mix of simple and complex" if target_level == "B1" else "Variety of complex structures" if target_level == "B2" else "Wide range of structures"}

## Response Format (JSON)

Respond with ONLY valid JSON in this exact format:

{{
  "overall_score": <float 0-10, average of 4 criteria>,
  "task_achievement": <float 0-10>,
  "coherence_cohesion": <float 0-10>,
  "lexical_resource": <float 0-10>,
  "grammatical_range": <float 0-10>,
  "feedback": "<tổng quan feedback bằng tiếng Việt, 2-3 câu>",
  "suggestions": [
    "<gợi ý cải thiện 1 bằng tiếng Việt>",
    "<gợi ý cải thiện 2 bằng tiếng Việt>",
    "<gợi ý cải thiện 3 bằng tiếng Việt>"
  ]
}}
"""


def get_grammar_check_prompt(text: str, target_level: str) -> str:
    """Generate grammar checking prompt."""
    
    return f"""
# Grammar Error Detection

## Student's Text
{text}

## Instructions
Identify grammar, spelling, and punctuation errors in the text above.
Focus on errors that are significant for {target_level} level learners.

## Response Format (JSON)

Respond with ONLY valid JSON:

{{
  "errors": [
    {{
      "text": "<the erroneous text as it appears>",
      "start": <character position start>,
      "end": <character position end>,
      "correction": "<the corrected text>",
      "explanation": "<brief explanation in Vietnamese>"
    }}
  ]
}}

If there are no errors, return: {{"errors": []}}

Limit to maximum 10 most important errors.
"""
```

### 3. app/workers/writing_worker.py

```python
import structlog
import httpx

from app.config import get_settings
from app.models.job import WritingJob, WritingResult, JobStatus
from app.graders.writing.scorer import writing_scorer
from app.queue.publisher import publisher


logger = structlog.get_logger()
settings = get_settings()


async def process_writing_job(job: WritingJob):
    """
    Process a writing grading job.
    
    1. Score the writing with GPT-4
    2. Publish result to queue
    3. Callback to NestJS backend
    """
    try:
        logger.info(
            "Processing writing job",
            job_id=job.job_id,
            user_id=job.user_id,
        )
        
        # Score the writing
        score_data = await writing_scorer.score(job)
        
        # Create result
        result = WritingResult(
            job_id=job.job_id,
            status=JobStatus.COMPLETED,
            result=score_data,
        )
        
        # Publish to result queue
        await publisher.publish_result(result)
        
        # Callback to NestJS
        await send_callback(job.callback_url, result)
        
        logger.info(
            "Writing job completed",
            job_id=job.job_id,
            overall_score=score_data.overall_score,
        )
        
    except Exception as e:
        logger.error(
            "Writing job failed",
            job_id=job.job_id,
            error=str(e),
        )
        
        # Publish failure result
        result = WritingResult(
            job_id=job.job_id,
            status=JobStatus.FAILED,
            error=str(e),
        )
        
        await publisher.publish_result(result)
        await send_callback(job.callback_url, result)


async def send_callback(url: str, result: WritingResult):
    """Send result callback to NestJS."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json=result.model_dump(),
                headers={
                    "X-Callback-Secret": settings.callback_secret,
                    "Content-Type": "application/json",
                },
                timeout=10.0,
            )
            
            if response.status_code != 200:
                logger.warning(
                    "Callback failed",
                    url=url,
                    status_code=response.status_code,
                )
                
    except Exception as e:
        logger.error(
            "Callback error",
            url=url,
            error=str(e),
        )
```

### 4. Update app/main.py - Start Consumer

```python
import asyncio
from app.workers.writing_worker import process_writing_job


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    setup_logging(debug=settings.debug)
    logger.info("AI Service starting up", version=settings.app_version)
    
    # Connect to RabbitMQ
    await rabbitmq.connect()
    await consumer.setup()
    await publisher.setup()
    
    # Start consuming in background
    async def speaking_placeholder(job):
        # Will be implemented in AI-007
        logger.warning("Speaking handler not implemented yet")
    
    asyncio.create_task(
        consumer.start_consuming(
            writing_handler=process_writing_job,
            speaking_handler=speaking_placeholder,
        )
    )
    
    yield
    
    consumer.stop()
    await rabbitmq.disconnect()
    logger.info("AI Service shutting down")
```

---

## ✅ Acceptance Criteria

- [ ] GPT-4 integration works
- [ ] 4 scoring criteria returned (0-10 each)
- [ ] Overall score is average of 4 criteria
- [ ] Feedback in Vietnamese
- [ ] Grammar errors with positions
- [ ] Word count calculated
- [ ] Processing time tracked
- [ ] Callback sent to NestJS
- [ ] Error handling works

---

## 🧪 Test

```python
# tests/test_writing_scorer.py
import pytest
from unittest.mock import AsyncMock, patch
from app.graders.writing.scorer import WritingScorer
from app.models.job import WritingJob


@pytest.fixture
def sample_job():
    return WritingJob(
        job_id="test-123",
        user_id=1,
        attempt_id=1,
        question_id=1,
        task_type="task2",
        prompt="Write an essay about the importance of education.",
        student_answer="Education is very important for everyone. It helps people get better jobs and have better lives. Without education, people cannot develop their skills...",
        target_level="B1",
        callback_url="http://localhost:3000/callback",
    )


@pytest.mark.asyncio
async def test_scoring_prompt_generation():
    from app.graders.writing.prompts import get_scoring_prompt
    
    prompt = get_scoring_prompt(
        task_type="task2",
        target_level="B1",
        prompt_text="Write about education",
        student_answer="Education is important...",
    )
    
    assert "VSTEP Writing Scoring Task" in prompt
    assert "Task Achievement" in prompt
    assert "B1" in prompt


@pytest.mark.asyncio
async def test_word_count():
    text = "This is a test sentence with ten words in it."
    word_count = len(text.split())
    assert word_count == 10
```

---

## 📚 References

- OpenAI API: https://platform.openai.com/docs/api-reference
- VSTEP Writing rubrics: Internal documentation
