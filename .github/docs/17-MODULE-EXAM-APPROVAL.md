# ✅ Module 17: Exam Approval Workflow

> **Module duyệt đề thi từ Uploader**
> 
> File: `17-MODULE-EXAM-APPROVAL.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## Giới thiệu

Module Exam Approval quản lý quy trình:
1. Uploader submit đề thi
2. Admin review và approve/reject
3. Approved exams được publish

---

## Workflow

### 1. Submit for Approval (Uploader)

```tsx
<ExamSubmissionForm>
  <Section>
    <Label>Skill</Label>
    <Select>
      <Option>Reading</Option>
      <Option>Listening</Option>
      <Option>Writing</Option>
      <Option>Speaking</Option>
    </Select>
  </Section>
  
  <Section>
    <Label>Level</Label>
    <Select>
      <Option>A2</Option>
      <Option>B1</Option>
      <Option>B2</Option>
      <Option>C1</Option>
    </Select>
  </Section>
  
  <Section>
    <Label>Exam Content</Label>
    <FileUpload accept=".json" />
    <Note>Upload exam in JSON format</Note>
  </Section>
  
  <Section>
    <Label>Answer Key</Label>
    <FileUpload accept=".json" />
  </Section>
  
  <Section>
    <Label>Notes for Reviewer</Label>
    <Textarea />
  </Section>
  
  <Button>Submit for Approval</Button>
</ExamSubmissionForm>
```

**Status Flow**:
```
Draft → Submitted → Under Review → Approved/Rejected → Published
```

---

### 2. Review Queue (Admin)

```tsx
<ApprovalQueue>
  <Header>
    <Title>Pending Approvals</Title>
    <Badge>{pendingCount}</Badge>
  </Header>
  
  <Filters>
    <Select>
      <Option>All Skills</Option>
      <Option>Reading</Option>
      <Option>Listening</Option>
      <Option>Writing</Option>
      <Option>Speaking</Option>
    </Select>
    
    <Select>
      <Option>All Levels</Option>
      <Option>A2</Option>
      <Option>B1</Option>
      <Option>B2</Option>
      <Option>C1</Option>
    </Select>
  </Filters>
  
  <ExamList>
    {exams.map(exam => (
      <ExamCard>
        <Header>
          <Title>{exam.title}</Title>
          <SkillBadge>{exam.skill}</SkillBadge>
          <LevelBadge>{exam.level}</LevelBadge>
        </Header>
        
        <Info>
          <Uploader>By: {exam.uploaderName}</Uploader>
          <SubmittedDate>{exam.submittedAt}</SubmittedDate>
          <QuestionsCount>{exam.questionCount} questions</QuestionsCount>
        </Info>
        
        <Actions>
          <Button primary onClick={() => review(exam.id)}>
            Review
          </Button>
        </Actions>
      </ExamCard>
    ))}
  </ExamList>
</ApprovalQueue>
```

---

### 3. Review Interface (Admin)

```tsx
<ReviewInterface>
  <ExamPreview>
    <Title>{exam.title}</Title>
    <Metadata>
      <Item>Skill: {exam.skill}</Item>
      <Item>Level: {exam.level}</Item>
      <Item>Questions: {exam.questionCount}</Item>
      <Item>Uploader: {exam.uploaderName}</Item>
    </Metadata>
    
    <ContentPreview>
      {/* Show exam content in read-only mode */}
      <Questions>
        {exam.questions.map(q => (
          <Question>
            <Text>{q.text}</Text>
            <Options>{q.options}</Options>
            <CorrectAnswer highlight>{q.correct}</CorrectAnswer>
          </Question>
        ))}
      </Questions>
    </ContentPreview>
  </ExamPreview>
  
  <ReviewPanel>
    <Section>
      <Title>Quality Check</Title>
      <Checklist>
        <Item>
          <Checkbox />
          <Label>Grammar and spelling correct</Label>
        </Item>
        <Item>
          <Checkbox />
          <Label>Questions clear and unambiguous</Label>
        </Item>
        <Item>
          <Checkbox />
          <Label>Answer key verified</Label>
        </Item>
        <Item>
          <Checkbox />
          <Label>Appropriate difficulty level</Label>
        </Item>
        <Item>
          <Checkbox />
          <Label>No copyright issues</Label>
        </Item>
      </Checklist>
    </Section>
    
    <Section>
      <Title>Reviewer Notes</Title>
      <Textarea placeholder="Add notes..." />
    </Section>
    
    <Actions>
      <Button danger onClick={reject}>
        Reject
      </Button>
      <Button success onClick={approve}>
        Approve & Publish
      </Button>
    </Actions>
  </ReviewPanel>
</ReviewInterface>
```

---

### 4. Rejection Flow

```tsx
<RejectModal>
  <Title>Reject Exam</Title>
  
  <Section>
    <Label>Reason for Rejection *</Label>
    <Select>
      <Option>Quality issues</Option>
      <Option>Incorrect answers</Option>
      <Option>Inappropriate content</Option>
      <Option>Copyright violation</Option>
      <Option>Other</Option>
    </Select>
  </Section>
  
  <Section>
    <Label>Detailed Feedback</Label>
    <Textarea placeholder="Explain what needs to be fixed..." />
  </Section>
  
  <Actions>
    <Button secondary>Cancel</Button>
    <Button danger>Confirm Rejection</Button>
  </Actions>
</RejectModal>
```

**After Rejection**:
- Uploader receives notification
- Can view rejection reason
- Can revise and resubmit
- Original submission archived

---

### 5. Approval & Publishing

**On Approve**:
1. Change status to 'approved'
2. Set approved_by and approved_at
3. Auto-publish to exercise bank
4. Make available for practice
5. Send notification to uploader
6. Award contribution points/badges

---

## Database Design

### Table: exam_submissions

```sql
CREATE TABLE exam_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploader_id UUID NOT NULL REFERENCES users(id),
  
  skill VARCHAR(20) NOT NULL,
  level VARCHAR(10) NOT NULL,
  title VARCHAR(255),
  
  content_file_url VARCHAR(500),
  answer_key_file_url VARCHAR(500),
  uploader_notes TEXT,
  
  status VARCHAR(20) DEFAULT 'draft',
  -- 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'published'
  
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  reviewer_notes TEXT,
  rejection_reason VARCHAR(100),
  
  exercise_id UUID REFERENCES exercises(id),
  -- Created after approval
  
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  published_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exam_submissions_status ON exam_submissions(status);
CREATE INDEX idx_exam_submissions_uploader ON exam_submissions(uploader_id);
CREATE INDEX idx_exam_submissions_reviewer ON exam_submissions(reviewed_by);
```

---

## API Endpoints

### POST /api/exam-submissions

Submit exam for approval

**Request**:
```json
{
  "skill": "reading",
  "level": "B2",
  "title": "Reading Full Test - Advanced",
  "contentFile": "uploaded-file-url",
  "answerKeyFile": "uploaded-file-url",
  "notes": "This exam focuses on academic texts..."
}
```

### GET /api/exam-submissions/pending

Get pending approvals (Admin only)

### PUT /api/exam-submissions/:id/approve

Approve submission

### PUT /api/exam-submissions/:id/reject

Reject submission

**Request**:
```json
{
  "reason": "Quality issues",
  "feedback": "Several questions have unclear wording..."
}
```

---

## Notification Templates

### Submission Received

```
Subject: Exam Submission Received

Dear {uploaderName},

Your exam submission "{examTitle}" has been received and is pending review.

We'll review it within 3-5 business days.

Thanks for your contribution!
```

### Approved

```
Subject: Exam Approved! 🎉

Dear {uploaderName},

Great news! Your exam "{examTitle}" has been approved and published.

You've earned +50 contribution points!

View your published exam: {link}
```

### Rejected

```
Subject: Exam Revision Needed

Dear {uploaderName},

Your exam "{examTitle}" requires some revisions before it can be approved.

Rejection Reason: {reason}

Reviewer Feedback:
{feedback}

Please revise and resubmit. Thank you!
```

---

## Kết thúc Module Exam Approval

Tích hợp với Module 02 (exercises), Module 05 (user management - Uploader role), Module 20 (notifications).
