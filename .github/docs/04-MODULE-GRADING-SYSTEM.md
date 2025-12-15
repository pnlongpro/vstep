# 🎓 Module 04: Grading System

> **Module chấm điểm tự động và AI cho bài tập**
> 
> File: `04-MODULE-GRADING-SYSTEM.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Giới thiệu module](#1-giới-thiệu-module)
- [2. Auto-Grading System](#2-auto-grading-system)
- [3. AI Grading System](#3-ai-grading-system)
- [4. Database Design](#4-database-design)
- [5. API Endpoints](#5-api-endpoints)
- [6. AI Integration](#6-ai-integration)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Module Grading System cung cấp:
- **Auto-grading**: Chấm tự động cho Reading và Listening
- **AI-grading**: Chấm AI cho Writing và Speaking
- **Feedback chi tiết**: Phân tích điểm mạnh/yếu
- **Tiêu chí VSTEP**: Đánh giá theo chuẩn VSTEP
- **Caching results**: Lưu kết quả để tái sử dụng

### 1.2. Loại chấm điểm

**1. Auto-grading (Reading/Listening)**:
- So sánh với đáp án đúng
- Instant scoring
- 100% accuracy
- No cost

**2. AI-grading (Writing/Speaking)**:
- OpenAI API hoặc Custom AI
- Chấm theo 4-5 criteria
- Feedback chi tiết
- Takes 30-120 seconds
- Has cost per request

### 1.3. Tiêu chí chấm VSTEP

**Writing (4 criteria)**:
1. Task Achievement (2.5 points)
2. Coherence and Cohesion (2.5 points)
3. Lexical Resource (2.5 points)
4. Grammatical Range and Accuracy (2.5 points)
- **Total**: 10 points

**Speaking (5 criteria)**:
1. Task Response (2 points)
2. Coherence and Cohesion (2 points)
3. Vocabulary (2 points)
4. Grammar (2 points)
5. Pronunciation and Fluency (2 points)
- **Total**: 10 points

---

## 2. Auto-Grading System

### 2.1. Reading/Listening Auto-Grading

**Flow**:
```
Submit answers
  ↓
Load exercise answer key
  ↓
Compare user answers with correct answers
  ↓
Calculate:
  - Correct count
  - Wrong count
  - Accuracy percentage
  - Band score (0-10)
  ↓
Generate explanations (from database)
  ↓
Return results
```

**Algorithm**:
```typescript
function autoGrade(
  userAnswers: Record<string, string>,
  answerKey: Record<string, string>
): AutoGradeResult {
  let correctCount = 0;
  let totalQuestions = Object.keys(answerKey).length;
  
  const results = {};
  
  for (const [questionId, correctAnswer] of Object.entries(answerKey)) {
    const userAnswer = userAnswers[questionId];
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) correctCount++;
    
    results[questionId] = {
      userAnswer,
      correctAnswer,
      isCorrect,
      explanation: getExplanation(questionId)
    };
  }
  
  const percentage = (correctCount / totalQuestions) * 100;
  const bandScore = calculateBandScore(percentage);
  
  return {
    correctCount,
    totalQuestions,
    percentage,
    bandScore,
    results
  };
}
```

**Band Score Calculation**:
```typescript
function calculateBandScore(percentage: number): number {
  // VSTEP band score mapping
  if (percentage >= 90) return 9.0 + (percentage - 90) / 10;
  if (percentage >= 80) return 8.0 + (percentage - 80) / 10;
  if (percentage >= 70) return 7.0 + (percentage - 70) / 10;
  if (percentage >= 60) return 6.0 + (percentage - 60) / 10;
  if (percentage >= 50) return 5.0 + (percentage - 50) / 10;
  if (percentage >= 40) return 4.0 + (percentage - 40) / 10;
  return percentage / 10;
}
```

### 2.2. Explanation System

**Database Structure**:
```sql
CREATE TABLE question_explanations (
  id UUID PRIMARY KEY,
  question_id UUID NOT NULL,
  correct_answer VARCHAR(10) NOT NULL,
  explanation TEXT NOT NULL,
  reference TEXT,
  tips TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Example Explanation**:
```json
{
  "questionId": "q1",
  "correctAnswer": "B",
  "explanation": "Đáp án đúng là B vì trong đoạn văn có câu: 'The main reason for this problem is...' chỉ rõ nguyên nhân chính.",
  "reference": "Paragraph 2, line 3-5",
  "tips": [
    "Chú ý từ khóa 'main reason'",
    "Loại trừ các đáp án không được nhắc đến",
    "Đọc kỹ context xung quanh"
  ]
}
```

---

## 3. AI Grading System

### 3.1. Writing AI Grading

**Flow**:
```
Submit writing
  ↓
Queue for AI grading
  ↓
Call OpenAI API
  ↓
Parse AI response
  ↓
Validate scores
  ↓
Generate detailed feedback
  ↓
Save to database
  ↓
Notify student
```

**OpenAI Prompt Template**:
```typescript
const writingGradingPrompt = `
You are a VSTEP Writing examiner. Grade this essay according to VSTEP criteria.

TASK:
${task.prompt}

STUDENT'S ESSAY:
${studentEssay}

Grade on these 4 criteria (each 0-2.5 points):
1. Task Achievement: Does it fully address the task?
2. Coherence and Cohesion: Is it well-organized with clear progression?
3. Lexical Resource: Range and accuracy of vocabulary?
4. Grammatical Range and Accuracy: Variety and accuracy of grammar?

Return JSON format:
{
  "scores": {
    "taskAchievement": 2.0,
    "coherenceCohesion": 2.5,
    "lexicalResource": 1.5,
    "grammaticalAccuracy": 2.0
  },
  "overallScore": 8.0,
  "feedback": {
    "strengths": ["strength 1", "strength 2", ...],
    "weaknesses": ["weakness 1", "weakness 2", ...],
    "suggestions": ["suggestion 1", "suggestion 2", ...]
  },
  "detailedFeedback": {
    "taskAchievement": "...",
    "coherenceCohesion": "...",
    "lexicalResource": "...",
    "grammaticalAccuracy": "..."
  },
  "grammarErrors": [
    {
      "error": "very good",
      "correction": "excellent",
      "explanation": "Use stronger adjectives"
    }
  ]
}
`;
```

**API Call**:
```typescript
async function gradeWriting(
  task: WritingTask,
  studentEssay: string
): Promise<WritingGradeResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a VSTEP Writing examiner..."
      },
      {
        role: "user",
        content: writingGradingPrompt
      }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });
  
  const result = JSON.parse(response.choices[0].message.content);
  
  // Validate scores
  validateScores(result.scores);
  
  return result;
}
```

**Validation**:
```typescript
function validateScores(scores: any) {
  const criteriaNames = [
    'taskAchievement',
    'coherenceCohesion',
    'lexicalResource',
    'grammaticalAccuracy'
  ];
  
  for (const criterion of criteriaNames) {
    const score = scores[criterion];
    
    if (typeof score !== 'number') {
      throw new Error(`${criterion} must be a number`);
    }
    
    if (score < 0 || score > 2.5) {
      throw new Error(`${criterion} must be between 0 and 2.5`);
    }
  }
  
  // Check overall score
  const calculatedOverall = Object.values(scores).reduce((a: any, b: any) => a + b, 0);
  const providedOverall = scores.overall || calculatedOverall;
  
  if (Math.abs(calculatedOverall - providedOverall) > 0.1) {
    throw new Error('Overall score mismatch');
  }
}
```

### 3.2. Speaking AI Grading

**Flow**:
```
Upload audio recording
  ↓
Transcribe audio (Whisper API)
  ↓
Analyze:
  - Content (from transcript)
  - Pronunciation (from audio)
  - Fluency (from audio)
  ↓
Call OpenAI API for scoring
  ↓
Generate feedback
  ↓
Save results
```

**Speech-to-Text**:
```typescript
async function transcribeAudio(
  audioFile: File
): Promise<string> {
  const response = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    language: "en"
  });
  
  return response.text;
}
```

**Pronunciation Analysis**:
```typescript
async function analyzePronunciation(
  audioFile: File,
  transcript: string
): Promise<PronunciationAnalysis> {
  // Use Azure Speech Service or custom model
  const analysis = await azureSpeech.analyzePronunciation({
    audio: audioFile,
    referenceText: transcript
  });
  
  return {
    accuracyScore: analysis.accuracyScore,
    pronunciationScore: analysis.pronunciationScore,
    fluencyScore: analysis.fluencyScore,
    problemSounds: analysis.errors.map(e => ({
      word: e.word,
      expectedSound: e.expected,
      actualSound: e.actual
    })),
    speakingRate: analysis.speakingRate,
    pauseFrequency: analysis.pauseFrequency
  };
}
```

**Speaking Grading Prompt**:
```typescript
const speakingGradingPrompt = `
You are a VSTEP Speaking examiner.

QUESTION:
${question.prompt}

STUDENT'S TRANSCRIPT:
${transcript}

PRONUNCIATION ANALYSIS:
${JSON.stringify(pronunciationAnalysis)}

Grade on these 5 criteria (each 0-2 points):
1. Task Response (0-2): Did they answer the question?
2. Coherence (0-2): Is the answer well-organized?
3. Vocabulary (0-2): Range and accuracy?
4. Grammar (0-2): Variety and accuracy?
5. Pronunciation (0-2): Clarity and accuracy?

Return JSON format:
{
  "scores": {
    "taskResponse": 1.5,
    "coherence": 2.0,
    "vocabulary": 1.5,
    "grammar": 1.5,
    "pronunciation": 1.0
  },
  "overallScore": 7.5,
  "feedback": {
    "strengths": [...],
    "weaknesses": [...],
    "suggestions": [...]
  },
  "pronunciationFeedback": {
    "problemSounds": ["th", "r"],
    "intonationIssues": ["falling intonation on questions"],
    "fluencyIssues": ["too many pauses", "slow speaking rate"]
  }
}
`;
```

### 3.3. AI Grading Queue System

**Queue Implementation**:
```typescript
// Using Bull Queue (Redis-based)
import Queue from 'bull';

const aiGradingQueue = new Queue('ai-grading', {
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379
  }
});

// Add job to queue
async function queueAIGrading(
  submissionId: string,
  type: 'writing' | 'speaking',
  data: any
) {
  await aiGradingQueue.add(
    {
      submissionId,
      type,
      data
    },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    }
  );
}

// Process queue
aiGradingQueue.process(async (job) => {
  const { submissionId, type, data } = job.data;
  
  try {
    let result;
    
    if (type === 'writing') {
      result = await gradeWriting(data.task, data.essay);
    } else if (type === 'speaking') {
      result = await gradeSpeaking(data.audio, data.question);
    }
    
    // Save result
    await saveGradingResult(submissionId, result);
    
    // Notify student
    await notifyStudent(submissionId, result);
    
    return result;
  } catch (error) {
    console.error('AI Grading error:', error);
    throw error;
  }
});
```

**Retry Logic**:
```typescript
aiGradingQueue.on('failed', async (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
  
  if (job.attemptsMade >= 3) {
    // Mark as failed in database
    await markGradingAsFailed(job.data.submissionId, err.message);
    
    // Notify admin
    await notifyAdmin({
      type: 'AI_GRADING_FAILED',
      submissionId: job.data.submissionId,
      error: err.message
    });
  }
});
```

### 3.4. Cost Management

**Token Estimation**:
```typescript
function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: string
): number {
  const pricing = {
    'gpt-4': {
      input: 0.03 / 1000,  // $0.03 per 1K tokens
      output: 0.06 / 1000
    },
    'gpt-3.5-turbo': {
      input: 0.0015 / 1000,
      output: 0.002 / 1000
    }
  };
  
  const price = pricing[model];
  return (inputTokens * price.input) + (outputTokens * price.output);
}
```

**Usage Tracking**:
```sql
CREATE TABLE ai_grading_usage (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL,
  model VARCHAR(50) NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  estimated_cost DECIMAL(10, 6),
  actual_cost DECIMAL(10, 6),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Cost Control**:
```typescript
async function checkCostLimit(userId: string): Promise<boolean> {
  const monthlyUsage = await getMonthlyAIUsage(userId);
  const userLimit = await getUserAILimit(userId);
  
  return monthlyUsage < userLimit;
}

async function gradeWithCostCheck(
  userId: string,
  submissionId: string,
  data: any
): Promise<GradeResult> {
  // Check cost limit
  if (!await checkCostLimit(userId)) {
    throw new Error('AI grading limit reached for this month');
  }
  
  // Proceed with grading
  const result = await gradeWriting(data.task, data.essay);
  
  // Track usage
  await trackAIUsage({
    submissionId,
    model: 'gpt-4',
    inputTokens: result.usage.input,
    outputTokens: result.usage.output,
    cost: estimateCost(result.usage.input, result.usage.output, 'gpt-4')
  });
  
  return result;
}
```

---

## 4. Database Design

### 4.1. Table: grading_results

```sql
CREATE TABLE grading_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES exercise_submissions(id),
  
  -- Grading info
  grading_type VARCHAR(20) NOT NULL,
    -- 'auto' | 'ai' | 'manual'
  graded_by VARCHAR(50),
    -- 'system' | 'openai-gpt4' | user_id (if manual)
  
  -- Scores
  overall_score DECIMAL(5,2) NOT NULL,
  criteria_scores JSONB,
    -- For Writing/Speaking: detailed criteria
  
  -- Feedback
  feedback JSONB,
    -- { strengths, weaknesses, suggestions }
  detailed_feedback JSONB,
    -- Per criterion feedback
  
  -- AI-specific
  ai_model VARCHAR(50),
  ai_tokens_used INTEGER,
  ai_cost DECIMAL(10, 6),
  
  -- Timing
  graded_at TIMESTAMP DEFAULT NOW(),
  grading_duration INTEGER,
    -- Seconds
  
  -- Status
  status VARCHAR(20) DEFAULT 'completed',
    -- 'pending' | 'processing' | 'completed' | 'failed'
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_grading_results_submission ON grading_results(submission_id);
CREATE INDEX idx_grading_results_status ON grading_results(status);
CREATE INDEX idx_grading_results_graded_at ON grading_results(graded_at DESC);
```

### 4.2. Table: ai_grading_cache

```sql
CREATE TABLE ai_grading_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content hash (to detect duplicates)
  content_hash VARCHAR(64) NOT NULL UNIQUE,
    -- SHA-256 hash of normalized content
  
  skill VARCHAR(20) NOT NULL,
  task_id UUID NOT NULL,
  
  -- Cached result
  grading_result JSONB NOT NULL,
  
  -- Usage stats
  cache_hits INTEGER DEFAULT 0,
  last_used_at TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_ai_cache_hash ON ai_grading_cache(content_hash);
CREATE INDEX idx_ai_cache_expires ON ai_grading_cache(expires_at);
```

**Cache Logic**:
```typescript
function normalizeContent(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function hashContent(text: string): string {
  const normalized = normalizeContent(text);
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

async function getCachedGrading(
  taskId: string,
  content: string
): Promise<GradingResult | null> {
  const hash = hashContent(content);
  
  const cached = await db.query(`
    SELECT grading_result, cache_hits
    FROM ai_grading_cache
    WHERE content_hash = $1
      AND task_id = $2
      AND (expires_at IS NULL OR expires_at > NOW())
  `, [hash, taskId]);
  
  if (cached.rows.length > 0) {
    // Increment cache hits
    await db.query(`
      UPDATE ai_grading_cache
      SET cache_hits = cache_hits + 1,
          last_used_at = NOW()
      WHERE content_hash = $1
    `, [hash]);
    
    return cached.rows[0].grading_result;
  }
  
  return null;
}

async function cacheGrading(
  taskId: string,
  content: string,
  result: GradingResult
): Promise<void> {
  const hash = hashContent(content);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  await db.query(`
    INSERT INTO ai_grading_cache (
      content_hash,
      task_id,
      skill,
      grading_result,
      expires_at
    ) VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (content_hash) DO UPDATE
    SET grading_result = $4,
        expires_at = $5,
        last_used_at = NOW()
  `, [hash, taskId, result.skill, JSON.stringify(result), expiresAt]);
}
```

---

## 5. API Endpoints

### 5.1. POST /api/grading/auto-grade

**Mô tả**: Chấm tự động Reading/Listening

**Request**:
```typescript
POST /api/grading/auto-grade
Authorization: Bearer {token}
Content-Type: application/json

{
  "submissionId": "uuid",
  "exerciseId": "uuid",
  "answers": {
    "1": "B",
    "2": "A",
    "3": "C",
    // ... all answers
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "gradingResultId": "uuid",
    "overallScore": 8.5,
    "correctCount": 34,
    "totalQuestions": 40,
    "percentage": 85.0,
    "results": {
      "1": {
        "userAnswer": "B",
        "correctAnswer": "B",
        "isCorrect": true,
        "explanation": "..."
      },
      "2": {
        "userAnswer": "A",
        "correctAnswer": "C",
        "isCorrect": false,
        "explanation": "..."
      }
      // ... all questions
    },
    "breakdown": {
      "part1": { "correct": 9, "total": 10 },
      "part2": { "correct": 8, "total": 10 },
      "part3": { "correct": 17, "total": 20 }
    }
  }
}
```

**Business Logic**:
```typescript
async function autoGrade(req, res) {
  const { submissionId, exerciseId, answers } = req.body;
  
  // 1. Load answer key
  const exercise = await Exercise.findById(exerciseId);
  const answerKey = exercise.answer_key;
  
  // 2. Compare answers
  const results = {};
  let correctCount = 0;
  
  for (const [qId, correctAnswer] of Object.entries(answerKey)) {
    const userAnswer = answers[qId];
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) correctCount++;
    
    results[qId] = {
      userAnswer,
      correctAnswer,
      isCorrect,
      explanation: await getExplanation(qId)
    };
  }
  
  // 3. Calculate scores
  const totalQuestions = Object.keys(answerKey).length;
  const percentage = (correctCount / totalQuestions) * 100;
  const bandScore = calculateBandScore(percentage);
  
  // 4. Save grading result
  const gradingResult = await GradingResult.create({
    submission_id: submissionId,
    grading_type: 'auto',
    graded_by: 'system',
    overall_score: bandScore,
    graded_at: new Date()
  });
  
  // 5. Update submission
  await Submission.update(submissionId, {
    status: 'graded',
    score: bandScore
  });
  
  return res.json({
    success: true,
    data: {
      gradingResultId: gradingResult.id,
      overallScore: bandScore,
      correctCount,
      totalQuestions,
      percentage,
      results
    }
  });
}
```

---

### 5.2. POST /api/grading/ai-grade

**Mô tả**: Queue AI grading cho Writing/Speaking

**Request**:
```typescript
POST /api/grading/ai-grade
Authorization: Bearer {token}
Content-Type: application/json

{
  "submissionId": "uuid",
  "skill": "writing",
  "content": {
    "task1": "Dear John, ...",
    "task2": "Education is ..."
  }
}
```

**Response** (202 Accepted):
```json
{
  "success": true,
  "message": "AI grading queued",
  "data": {
    "submissionId": "uuid",
    "status": "pending",
    "estimatedTime": "30-60 seconds"
  }
}
```

**Business Logic**:
```typescript
async function queueAIGrading(req, res) {
  const { submissionId, skill, content } = req.body;
  
  // 1. Check if already graded
  const existing = await GradingResult.findBySubmission(submissionId);
  if (existing && existing.status === 'completed') {
    return res.json({
      success: true,
      data: existing
    });
  }
  
  // 2. Check cache
  const cached = await getCachedGrading(taskId, content);
  if (cached) {
    // Use cached result
    await saveGradingResult(submissionId, cached);
    return res.json({
      success: true,
      data: cached
    });
  }
  
  // 3. Check cost limit
  if (!await checkCostLimit(req.user.id)) {
    return res.status(429).json({
      success: false,
      error: 'AI grading limit reached'
    });
  }
  
  // 4. Queue for AI grading
  await aiGradingQueue.add({
    submissionId,
    skill,
    content,
    userId: req.user.id
  });
  
  // 5. Update status
  await GradingResult.create({
    submission_id: submissionId,
    grading_type: 'ai',
    status: 'pending'
  });
  
  return res.status(202).json({
    success: true,
    message: 'AI grading queued',
    data: {
      submissionId,
      status: 'pending',
      estimatedTime: '30-60 seconds'
    }
  });
}
```

---

### 5.3. GET /api/grading/result/:submissionId

**Mô tả**: Lấy kết quả chấm điểm

**Request**:
```typescript
GET /api/grading/result/uuid-submission
Authorization: Bearer {token}
```

**Response** (200 - Completed):
```json
{
  "success": true,
  "data": {
    "gradingResultId": "uuid",
    "status": "completed",
    "gradingType": "ai",
    "overallScore": 7.5,
    "criteriaScores": {
      "taskAchievement": 2.0,
      "coherenceCohesion": 2.5,
      "lexicalResource": 1.5,
      "grammaticalAccuracy": 1.5
    },
    "feedback": {
      "overall": "Good essay with clear structure...",
      "strengths": [
        "Well-organized paragraphs",
        "Good range of vocabulary"
      ],
      "weaknesses": [
        "Some grammatical errors",
        "Limited use of complex sentences"
      ],
      "suggestions": [
        "Practice using more subordinate clauses",
        "Review article usage"
      ]
    },
    "detailedFeedback": {
      "taskAchievement": "You addressed all parts of the task...",
      "coherenceCohesion": "Your essay has clear progression...",
      "lexicalResource": "You used a good range of vocabulary...",
      "grammaticalAccuracy": "Grammar is mostly accurate..."
    },
    "grammarErrors": [
      {
        "error": "very good",
        "correction": "excellent",
        "explanation": "Use stronger adjectives"
      }
    ],
    "gradedAt": "2024-12-15T10:35:00Z"
  }
}
```

**Response** (202 - Pending):
```json
{
  "success": true,
  "data": {
    "status": "processing",
    "message": "AI grading in progress...",
    "estimatedTimeRemaining": "20 seconds"
  }
}
```

---

## 6. AI Integration

### 6.1. OpenAI Configuration

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});

const AI_CONFIG = {
  writingModel: 'gpt-4',
  speakingModel: 'gpt-4',
  transcriptionModel: 'whisper-1',
  temperature: 0.3,
  maxTokens: 2000,
  timeout: 60000 // 60 seconds
};
```

### 6.2. Error Handling

```typescript
async function gradeWithRetry(
  gradeFn: () => Promise<any>,
  maxRetries: number = 3
): Promise<any> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await gradeFn();
    } catch (error) {
      lastError = error;
      
      if (error.status === 429) {
        // Rate limit - wait and retry
        await sleep(5000 * (i + 1));
      } else if (error.status >= 500) {
        // Server error - retry
        await sleep(2000 * (i + 1));
      } else {
        // Client error - don't retry
        throw error;
      }
    }
  }
  
  throw lastError;
}
```

### 6.3. Quality Assurance

```typescript
function validateAIResponse(response: any): boolean {
  // Check required fields
  if (!response.scores || !response.feedback) {
    return false;
  }
  
  // Check score ranges
  for (const score of Object.values(response.scores)) {
    if (typeof score !== 'number' || score < 0 || score > 2.5) {
      return false;
    }
  }
  
  // Check feedback quality
  if (!response.feedback.strengths?.length ||
      !response.feedback.weaknesses?.length ||
      !response.feedback.suggestions?.length) {
    return false;
  }
  
  return true;
}
```

---

## Kết thúc Module Grading System

Module này là trung tâm cho việc đánh giá năng lực học viên, tích hợp với:
- Module 02: Practice & Learning (chấm bài practice)
- Module 03: Exam System (chấm bài thi)
- Module 07: Assignment Management (chấm bài tập)
- Module 19: Statistics (dữ liệu điểm số)
