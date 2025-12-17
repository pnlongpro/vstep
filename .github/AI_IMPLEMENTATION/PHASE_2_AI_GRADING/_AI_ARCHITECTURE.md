# AI Service Architecture

> **Python FastAPI service cho AI Grading**

---

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      NestJS Main Backend                            │
│                                                                     │
│  POST /api/ai/writing/submit   ──┐                                 │
│  POST /api/ai/speaking/submit  ──┼──► RabbitMQ ──► AI Workers      │
│  GET  /api/ai/job/:id/status   ◄─┘                                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     RabbitMQ Message Broker                         │
│                                                                     │
│  Queue: ai.writing.jobs    ──► Writing Worker Pool                 │
│  Queue: ai.speaking.jobs   ──► Speaking Worker Pool                │
│  Queue: ai.results         ◄── Result Publisher                    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Python FastAPI AI Service                        │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     Writing Grader                            │  │
│  │                                                               │  │
│  │  Text Input ──► Preprocessing ──► GPT-4 Scoring ──► Result   │  │
│  │                                                               │  │
│  │  Criteria:                                                    │  │
│  │  - Task Achievement (0-10)                                    │  │
│  │  - Coherence & Cohesion (0-10)                               │  │
│  │  - Lexical Resource (0-10)                                    │  │
│  │  - Grammatical Range & Accuracy (0-10)                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Speaking Grader                            │  │
│  │                                                               │  │
│  │  Audio ──► Whisper STT ──► Text Analysis ──► Pronunciation   │  │
│  │                                              Analysis         │  │
│  │                                                               │  │
│  │  Criteria:                                                    │  │
│  │  - Pronunciation (0-10)                                       │  │
│  │  - Fluency (0-10)                                            │  │
│  │  - Grammar (0-10)                                             │  │
│  │  - Vocabulary (0-10)                                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📂 AI Service Structure

```
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry
│   ├── config.py                  # Configuration
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── health.py              # Health check endpoint
│   │   └── webhooks.py            # Callback endpoints
│   │
│   ├── workers/
│   │   ├── __init__.py
│   │   ├── base_worker.py         # Abstract worker
│   │   ├── writing_worker.py      # Writing grading worker
│   │   └── speaking_worker.py     # Speaking grading worker
│   │
│   ├── graders/
│   │   ├── __init__.py
│   │   ├── writing/
│   │   │   ├── __init__.py
│   │   │   ├── gpt_scorer.py      # GPT-4 integration
│   │   │   ├── grammar_checker.py # Grammar analysis
│   │   │   └── prompts.py         # Scoring prompts
│   │   │
│   │   └── speaking/
│   │       ├── __init__.py
│   │       ├── whisper_stt.py     # Speech-to-text
│   │       ├── pronunciation.py   # Pronunciation scorer
│   │       └── fluency.py         # Fluency analyzer
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── job.py                 # Job schemas
│   │   ├── writing_result.py      # Writing result schema
│   │   └── speaking_result.py     # Speaking result schema
│   │
│   ├── queue/
│   │   ├── __init__.py
│   │   ├── consumer.py            # RabbitMQ consumer
│   │   └── publisher.py           # Result publisher
│   │
│   └── utils/
│       ├── __init__.py
│       ├── audio.py               # Audio processing
│       └── text.py                # Text preprocessing
│
├── tests/
│   ├── __init__.py
│   ├── test_writing_grader.py
│   └── test_speaking_grader.py
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

---

## 🔌 API Endpoints

### NestJS → AI Service Communication

#### Submit Writing for Grading
```typescript
// NestJS sends to RabbitMQ
interface WritingJob {
  jobId: string;
  userId: number;
  attemptId: number;
  questionId: number;
  taskType: 'task1' | 'task2';
  prompt: string;
  studentAnswer: string;
  targetLevel: 'A2' | 'B1' | 'B2' | 'C1';
  callbackUrl: string;
}
```

#### Submit Speaking for Grading
```typescript
// NestJS sends to RabbitMQ
interface SpeakingJob {
  jobId: string;
  userId: number;
  attemptId: number;
  questionId: number;
  partNumber: 1 | 2 | 3;
  audioUrl: string;        // S3 presigned URL
  targetLevel: 'A2' | 'B1' | 'B2' | 'C1';
  callbackUrl: string;
}
```

### AI Service → NestJS Callback

#### Writing Result
```typescript
interface WritingResult {
  jobId: string;
  status: 'completed' | 'failed';
  result?: {
    overallScore: number;        // 0-10
    taskAchievement: number;     // 0-10
    coherenceCohesion: number;   // 0-10
    lexicalResource: number;     // 0-10
    grammaticalRange: number;    // 0-10
    feedback: string;
    suggestions: string[];
    grammarErrors: Array<{
      text: string;
      position: [number, number];
      correction: string;
      explanation: string;
    }>;
    wordCount: number;
    processingTime: number;
  };
  error?: string;
}
```

#### Speaking Result
```typescript
interface SpeakingResult {
  jobId: string;
  status: 'completed' | 'failed';
  result?: {
    overallScore: number;        // 0-10
    pronunciation: number;       // 0-10
    fluency: number;             // 0-10
    grammar: number;             // 0-10
    vocabulary: number;          // 0-10
    transcript: string;
    wordsPerMinute: number;
    feedback: string;
    suggestions: string[];
    pronunciationErrors: Array<{
      word: string;
      phonetic: string;
      issue: string;
    }>;
    processingTime: number;
  };
  error?: string;
}
```

---

## 🎯 GPT-4 Writing Scoring Prompt

```python
WRITING_SCORING_PROMPT = """
You are a VSTEP English proficiency examiner. Score the following essay based on VSTEP criteria.

## Task Information
- Task Type: {task_type}
- Target Level: {target_level}
- Prompt: {prompt}

## Student Answer
{student_answer}

## Scoring Criteria (0-10 scale each)

### 1. Task Achievement (TA)
- Does the response address all parts of the task?
- Is the position clear throughout?
- Are ideas relevant and well-extended?

### 2. Coherence & Cohesion (CC)
- Is information organized logically?
- Are paragraphs well-structured?
- Are cohesive devices used effectively?

### 3. Lexical Resource (LR)
- Is there a wide range of vocabulary?
- Are words used accurately?
- Are there spelling errors?

### 4. Grammatical Range & Accuracy (GRA)
- Is there a variety of sentence structures?
- Are structures used accurately?
- Is punctuation correct?

## Output Format (JSON)
{
  "overall_score": <float 0-10>,
  "task_achievement": <float 0-10>,
  "coherence_cohesion": <float 0-10>,
  "lexical_resource": <float 0-10>,
  "grammatical_range": <float 0-10>,
  "feedback": "<overall feedback in Vietnamese>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>", ...],
  "grammar_errors": [
    {
      "text": "<error text>",
      "position": [<start>, <end>],
      "correction": "<corrected text>",
      "explanation": "<why it's wrong>"
    }
  ]
}
"""
```

---

## 🎙️ Speaking Scoring Pipeline

```python
# Pipeline stages
class SpeakingPipeline:
    def process(self, audio_url: str, target_level: str) -> SpeakingResult:
        # Stage 1: Download audio from S3
        audio_data = self.download_audio(audio_url)
        
        # Stage 2: Speech-to-Text with Whisper
        transcript = self.whisper_stt.transcribe(audio_data)
        
        # Stage 3: Calculate fluency metrics
        fluency = self.fluency_analyzer.analyze(
            audio_data, 
            transcript
        )
        
        # Stage 4: Pronunciation analysis
        pronunciation = self.pronunciation_analyzer.analyze(
            audio_data,
            transcript
        )
        
        # Stage 5: Grammar & Vocabulary from transcript
        grammar_vocab = self.gpt_analyzer.analyze_transcript(
            transcript,
            target_level
        )
        
        # Stage 6: Combine scores
        return self.combine_scores(
            fluency, pronunciation, grammar_vocab
        )
```

---

## ⚡ Performance Requirements

| Metric | Target |
|--------|--------|
| Writing scoring time | < 5 seconds |
| Speaking scoring time | < 10 seconds |
| Queue processing | 100 jobs/minute |
| Worker instances | 3-5 per type |
| GPU memory | 8GB minimum |

---

## 🔧 Environment Variables

```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo

# Whisper
WHISPER_MODEL=large-v3
WHISPER_DEVICE=cuda

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672
WRITING_QUEUE=ai.writing.jobs
SPEAKING_QUEUE=ai.speaking.jobs
RESULT_QUEUE=ai.results

# S3 (for audio files)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=vstepro-audio

# Callback
BACKEND_URL=http://localhost:3000
CALLBACK_SECRET=callback-secret-key
```

---

## 🐳 Docker Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  ai-service:
    build: ./ai-service
    runtime: nvidia  # For GPU support
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
    depends_on:
      - rabbitmq
    volumes:
      - ./models:/app/models  # Pre-downloaded models
    deploy:
      replicas: 3

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
```

---

## 📝 Implementation Notes

1. **Async Processing**: Tất cả AI jobs đều async qua RabbitMQ
2. **Retry Logic**: 3 retries với exponential backoff
3. **Timeout**: 30 seconds per job maximum
4. **Fallback**: Return partial score nếu một component fail
5. **Logging**: Structured logging với job_id correlation
6. **Monitoring**: Prometheus metrics cho queue depth, processing time
