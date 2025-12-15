# 🗺️ Module 10: Learning Roadmap

> **Module lộ trình học tập cá nhân hóa**
> 
> File: `10-MODULE-LEARNING-ROADMAP.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## Giới thiệu

Learning Roadmap cung cấp lộ trình học tập được cá nhân hóa dựa trên:
- Current level (A2/B1/B2/C1)
- Target level
- Available time
- Learning pace
- Strengths/Weaknesses

---

## Roadmap Structure

### 1. Level-based Roadmap

**A2 → B1** (3-6 months):
- Phase 1: Foundation (4 weeks)
  - Basic grammar review
  - Common vocabulary (500 words)
  - Simple reading texts
  
- Phase 2: Development (8 weeks)
  - Intermediate grammar
  - Listening practice
  - Writing paragraphs
  
- Phase 3: Practice (4 weeks)
  - Mock tests
  - Skill integration
  - Final assessment

**B1 → B2** (4-8 months):
- Similar phased approach
- More advanced content
- Higher complexity

---

### 2. Personalized Plan

**Based on Assessment**:
```typescript
interface LearningPlan {
  userId: string;
  currentLevel: 'A2' | 'B1' | 'B2' | 'C1';
  targetLevel: 'B1' | 'B2' | 'C1';
  estimatedDuration: number; // weeks
  weeklyHours: number;
  
  phases: Phase[];
  milestones: Milestone[];
  recommendations: Recommendation[];
}

interface Phase {
  number: number;
  title: string;
  duration: number; // weeks
  skills: string[];
  exercises: Exercise[];
  targetScores: Record<string, number>;
}
```

---

### 3. Progress Tracking

**Visual Roadmap**:
```tsx
<Roadmap>
  <Timeline>
    <Phase completed>
      <Title>Phase 1: Foundation</Title>
      <Progress>100%</Progress>
      <CheckIcon />
    </Phase>
    
    <Phase current>
      <Title>Phase 2: Development</Title>
      <Progress>45%</Progress>
      <Tasks>
        <Task done>✓ Grammar Module 1</Task>
        <Task done>✓ Vocabulary Set 1</Task>
        <Task current>→ Reading Practice</Task>
        <Task>Listening Practice</Task>
      </Tasks>
    </Phase>
    
    <Phase upcoming>
      <Title>Phase 3: Practice</Title>
      <Progress>0%</Progress>
      <Lock />
    </Phase>
  </Timeline>
</Roadmap>
```

---

### 4. Adaptive Learning

**System adjusts based on**:
- Test results
- Practice performance
- Time spent
- Completion rate

**Auto-adjust**:
- Speed up if exceeding targets
- Slow down if struggling
- Add extra practice for weak areas
- Skip mastered content

---

### 5. Milestones & Rewards

**Milestones**:
- Complete Phase 1
- Reach B1 level
- 100 exercises completed
- 30-day streak

**Rewards**:
- Badges unlocked
- Certificate earned
- Level advancement
- Unlock new content

---

## Database Design

### Table: learning_plans

```sql
CREATE TABLE learning_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  current_level VARCHAR(10),
  target_level VARCHAR(10),
  estimated_duration INTEGER, -- weeks
  weekly_hours INTEGER,
  
  current_phase INTEGER DEFAULT 1,
  overall_progress DECIMAL(5,2) DEFAULT 0,
  
  plan_data JSONB NOT NULL,
  -- { phases, milestones, recommendations }
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: learning_progress

```sql
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES learning_plans(id),
  user_id UUID NOT NULL REFERENCES users(id),
  
  phase_number INTEGER,
  task_id VARCHAR(100),
  status VARCHAR(20),
  -- 'not_started' | 'in_progress' | 'completed'
  
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### POST /api/roadmap/generate

Generate personalized roadmap

**Request**:
```json
{
  "currentLevel": "B1",
  "targetLevel": "B2",
  "weeklyHours": 10,
  "focusAreas": ["listening", "speaking"]
}
```

**Response**:
```json
{
  "planId": "uuid",
  "estimatedDuration": 24,
  "phases": [...],
  "milestones": [...]
}
```

### GET /api/roadmap/progress

Get current progress

### PUT /api/roadmap/complete-task

Mark task as completed

---

## Kết thúc Module Learning Roadmap

Tích hợp với Module 02 (Practice), Module 12 (Achievements), Module 19 (Statistics).
