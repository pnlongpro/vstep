# 🎯 Module 03: Exam System (Mock Exam)

> **Module thi thử mô phỏng kỳ thi VSTEP thật**
> 
> File: `03-MODULE-EXAM-SYSTEM.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## 📑 Mục lục

- [1. Giới thiệu module](#1-giới-thiệu-module)
- [2. Danh sách chức năng](#2-danh-sách-chức-năng)
- [3. Phân tích màn hình UI](#3-phân-tích-màn-hình-ui)
- [4. User Flow Diagrams](#4-user-flow-diagrams)
- [5. Sequence Diagrams](#5-sequence-diagrams)
- [6. Database Design](#6-database-design)
- [7. API Endpoints](#7-api-endpoints)
- [8. Business Rules](#8-business-rules)

---

## 1. Giới thiệu module

### 1.1. Mục đích
Module Exam System cung cấp trải nghiệm thi thử VSTEP hoàn chỉnh:
- **Thi thử Random**: Random 4 đề từ ngân hàng (mỗi kỹ năng 1 đề)
- **Full Test**: 4 kỹ năng liên tiếp (Reading → Listening → Writing → Speaking)
- **Timer chính xác**: 172 phút tổng (60+40+60+12)
- **Môi trường thi thật**: Không tạm dừng, không back, auto-submit
- **Certificate**: Chứng nhận sau khi hoàn thành

### 1.2. Điểm khác với Practice Mode

| Feature | Practice Mode | Exam Mode |
|---------|---------------|-----------|
| Kỹ năng | Từng kỹ năng riêng | 4 kỹ năng liên tiếp |
| Timer | Có thể tắt | Bắt buộc, không tắt được |
| Pause | Được phép | Không được phép |
| Back | Có thể quay lại skill | Không quay lại được |
| Submit | Tự submit từng skill | Auto submit khi hết giờ |
| Review | Xem ngay | Xem sau khi hoàn thành |
| Environment | Flexible | Strict như thi thật |

### 1.3. Cấu trúc bài thi VSTEP đầy đủ

**Total Time**: 172 minutes

1. **Reading** (60 minutes)
   - Part 1: Gap fill (10 câu)
   - Part 2: Short passages (10 câu)
   - Part 3: Long passages (20 câu)
   - Total: 40 câu

2. **Listening** (40 minutes)
   - Part 1: Short conversations (8 câu)
   - Part 2: Monologues (7 câu)
   - Part 3: Long conversations/lectures (20 câu)
   - Total: 35 câu

3. **Writing** (60 minutes)
   - Task 1: Email/Letter (120+ words, 20 min)
   - Task 2: Essay (250+ words, 40 min)

4. **Speaking** (12 minutes)
   - Part 1: Interview (3 phút)
   - Part 2: Long turn (3 phút: 1' prep + 2' speak)
   - Part 3: Discussion (4 phút)

### 1.4. Phạm vi module
- Mock Exam Home (Thi thử Random)
- Random 4 đề từ kho
- Xác nhận trước khi bắt đầu
- Exam Interface (4 kỹ năng)
- Skill Transition (chuyển skill)
- Final Results (kết quả tổng)
- Certificate Generation

---

## 2. Danh sách chức năng

### 2.1. Chức năng chính

#### A. Thi thử Random

**Mô tả**: Hệ thống random 4 đề thi (mỗi skill 1 đề) cho user

**Component**: `/components/student/MockExam.tsx`

**Flow**:
1. User clicks "Thi thử Random" từ Practice Home
2. Navigate to Mock Exam page
3. System random 4 đề:
   - Reading: 1 đề level phù hợp
   - Listening: 1 đề level phù hợp
   - Writing: 1 đề level phù hợp
   - Speaking: 1 đề level phù hợp
4. Display 4 đề được chọn
5. User xác nhận
6. Start exam

**Random Logic**:
- Dựa trên user level (nếu có)
- Nếu chưa có level → Random level B1-B2
- Đảm bảo chưa làm gần đây (last 7 days)
- Shuffle trong pool đề phù hợp

**Input**:
- User level (optional): A2/B1/B2/C1
- Exclude recent exams (optional): last N days

**Output**:
- 4 exercise IDs (1 per skill)
- Exercise details (title, level, questions count)

---

#### B. Xác nhận bắt đầu thi

**Mô tả**: Show confirmation với thông tin đề thi và quy định

**Display**:
- **Đề thi được chọn**:
  - Reading: [Title]
  - Listening: [Title]
  - Writing: [Title]
  - Speaking: [Title]

- **Thông tin**:
  - Total time: 172 phút
  - Total questions: 75 câu (R:40, L:35) + 2 Writing tasks + 3 Speaking parts
  - Level: B2 (or mixed)

- **Lưu ý quan trọng**:
  - ⚠️ Không thể tạm dừng giữa chừng
  - ⚠️ Không thể quay lại kỹ năng trước
  - ⚠️ Tự động nộp bài khi hết giờ
  - ⚠️ Đảm bảo kết nối internet ổn định
  - ⚠️ Chuẩn bị microphone cho phần Speaking

- **Checkbox**: "Tôi đã đọc và hiểu các quy định"

- **Buttons**:
  - "Hủy" → Back to Mock Exam page
  - "Bắt đầu thi" → Start exam (disabled nếu chưa check)

**Business Logic**:
1. Validate user ready (checkbox)
2. Create exam session
3. Navigate to Exam Interface
4. Start timer

---

#### C. Exam Interface - Làm bài thi

**Mô tả**: Giao diện làm 4 kỹ năng liên tiếp

**Component**: `/components/exam/ExamInterface.tsx`

**Global Elements** (hiện suốt bài thi):

**Top Bar**:
- Left: Exam title "VSTEP Mock Exam"
- Center: **Global Timer** - "2:45:30" (đếm ngược 172 phút)
  - Color code:
    - Green: > 60 phút
    - Yellow: 30-60 phút
    - Red: < 30 phút, flashing < 5 phút
- Right: Current skill indicator "Reading (1/4)"

**Progress Indicator** (sticky):
- 4 steps: Reading → Listening → Writing → Speaking
- Visual state:
  - Current: Blue, active
  - Completed: Green, checkmark
  - Upcoming: Gray
- Cannot click to jump (must do sequentially)

**Main Content Area**: (changes per skill)

**Skill 1: Reading** (60 minutes max, but can finish early):
- Use `ReadingExercise.tsx` component
- No separate timer (use global timer)
- Cannot pause
- Button: "Hoàn thành Reading" (submit + move to next)

**Skill Transition Modal** (after Reading):
- Title: "Đã hoàn thành Reading!"
- Score preview: "Bạn đã trả lời 35/40 câu"
- Message: "Bạn sẽ chuyển sang phần Listening."
- Timer info: "Còn lại: 2 giờ 05 phút"
- Countdown: "Tự động chuyển sau 5 giây..." (can skip)
- Button: "Tiếp tục ngay" (skip countdown)

**Skill 2: Listening** (40 minutes max):
- Use `ListeningExercise.tsx`
- Auto-play audio (cannot pause/replay previous parts)
- Button: "Hoàn thành Listening"

**Transition Modal** (after Listening)

**Skill 3: Writing** (60 minutes max):
- Use `WritingExercise.tsx`
- 2 tasks với timer riêng
- Button: "Hoàn thành Writing"

**Transition Modal** (after Writing)

**Skill 4: Speaking** (12 minutes):
- Use `SpeakingExercise.tsx`
- Microphone test first
- 3 parts with strict timing
- Auto-submit when time up

**Final Submit**:
- After Speaking completed
- Show final confirmation:
  - "Bạn đã hoàn thành bài thi!"
  - "Kết quả sẽ được xử lý trong vài phút."
- Upload all data
- Navigate to Results page (with loading state)

---

#### D. Pre-Exam Instructions

**Mô tả**: Hướng dẫn trước khi bắt đầu từng kỹ năng

**Component**: `/components/exam/PreExamInstructions.tsx`

**Example cho Reading**:
- Skill icon + name
- Instructions:
  - "Bạn sẽ có 60 phút để hoàn thành 40 câu hỏi"
  - "Đọc kỹ đoạn văn trước khi trả lời"
  - "Bạn có thể quay lại câu hỏi trước trong phần này"
  - "Nhấn 'Hoàn thành' khi xong để chuyển sang Listening"
- Button: "Bắt đầu Reading"

**Example cho Speaking**:
- Instructions:
  - "Kiểm tra microphone trước khi bắt đầu"
  - "Bạn chỉ được ghi âm một lần, không được ghi lại"
  - "Trả lời đầy đủ và rõ ràng"
- Microphone test section
- Button: "Bắt đầu Speaking" (enabled after mic test)

---

#### E. Exam Results

**Mô tả**: Hiển thị kết quả tổng hợp 4 kỹ năng

**Component**: Extended `ExamInterface.tsx` hoặc riêng

**Loading State** (while processing):
- Reading: ✓ Graded (instant)
- Listening: ✓ Graded (instant)
- Writing: ⏳ Đang chấm AI... (30-60s)
- Speaking: ⏳ Đang chấm AI... (1-2 phút)

**Results Display** (when ready):

**Overall Score Card**:
- **Total Band Score**: 7.5/10
  - Large, center
  - Circle progress
  
- **VSTEP Level**: "Band 7.5 - C1"

**Scores by Skill** (4 cards):

1. **Reading**:
   - Score: 8.5/10
   - Correct: 34/40 (85%)
   - Time: 45:30/60:00
   - Link: "Xem chi tiết"

2. **Listening**:
   - Score: 7.0/10
   - Correct: 28/35 (80%)
   - Time: 38:15/40:00
   - Link: "Xem chi tiết"

3. **Writing**:
   - Score: 7.5/10
   - Criteria:
     - Task Achievement: 7.5
     - Coherence: 8.0
     - Lexical Resource: 7.0
     - Grammatical: 7.5
   - Link: "Xem chi tiết"

4. **Speaking**:
   - Score: 7.0/10
   - Criteria:
     - Task Response: 7.0
     - Coherence: 7.5
     - Vocabulary: 7.0
     - Grammar: 6.5
     - Pronunciation: 7.0
   - Link: "Xem chi tiết"

**Performance Summary**:
- Chart: Radar/Spider chart với 4 skills
- Analysis:
  - Strengths: "Reading - Đọc hiểu rất tốt"
  - Weaknesses: "Speaking - Cần cải thiện phát âm"

**Actions**:
- Button: "Tải chứng nhận" (Download certificate)
- Button: "Xem chi tiết từng kỹ năng"
- Button: "Thi lại" (Redo exam với 4 đề mới)
- Button: "Về trang chủ"

---

#### F. Certificate Generation

**Mô tả**: Tạo chứng nhận hoàn thành bài thi

**Certificate Info**:
- Student name
- Date of exam
- Overall band score
- Breakdown scores
- Certificate ID (unique)
- QR code (verify authenticity)

**Format**:
- PDF file
- A4 size
- Professional design
- VSTEPRO branding

**Download**:
- Click "Tải chứng nhận"
- Generate PDF
- Auto download

**Verify**:
- QR code links to: `vstepro.com/verify/{certificateId}`
- Public verification page shows certificate details

---

### 2.2. Chức năng phụ

#### A. Auto-save during exam

**Frequency**:
- Every 10 seconds to server
- On skill transition
- On window unload (emergency save)

**Recovery**:
- If connection lost → Save to localStorage
- Restore on reconnect
- Resume exam from last saved state

---

#### B. Warning system

**Warnings**:
- 30 minutes remaining: "Còn 30 phút"
- 5 minutes remaining: "Còn 5 phút!" (red, flashing)
- 1 minute remaining: "Còn 1 phút! Chuẩn bị nộp bài"

**Triggers**:
- Show toast notification
- Update timer color
- Optional: Sound alert (if enabled)

---

#### C. Full-screen mode

**Feature**: Option to enter fullscreen

**Benefits**:
- Minimize distractions
- More focus
- Closer to real exam environment

**Toggle**:
- Button in top bar
- Shortcut: F11
- Exit: ESC or button

---

#### D. Prevent cheating

**Measures**:
- Disable copy/paste
- Disable right-click
- Disable browser back button
- Detect tab switching (warning)
- Detect window blur (warning)

**Warnings**:
- First time: Warning message
- Multiple times: Record suspicious behavior
- Report to teacher (if assigned exam)

---

### 2.3. Quyền sử dụng

| Chức năng | Student | Teacher | Admin |
|-----------|---------|---------|-------|
| **Exam** | | | |
| Take Mock Exam | ✅ | ✅ | ✅ |
| View Results | ✅ (own) | ✅ (own) | ✅ (all) |
| Download Certificate | ✅ | ✅ | ✅ |
| Redo Exam | ✅ | ✅ | ✅ |
| **Admin** | | | |
| View All Exams | ❌ | ❌ | ✅ |
| Manage Exam Pool | ❌ | ❌ | ✅ |

---

## 3. Phân tích màn hình UI

### 3.1. Mock Exam Home

**File**: `/components/student/MockExam.tsx`

#### Tên màn hình
**Mock Exam / Thi thử Random**

#### Mục đích
Trang chủ thi thử, hiển thị đề thi được random và xác nhận

#### Các thành phần UI

**Header Section**:
- Page title: "Thi thử VSTEP"
- Subtitle: "Trải nghiệm thi thử với 4 đề ngẫu nhiên"
- Icon: Shuffle (animated)

**Info Card**:
- Title: "Về bài thi VSTEP"
- Content:
  - "Bài thi gồm 4 kỹ năng: Reading, Listening, Writing, Speaking"
  - "Tổng thời gian: 172 phút (2 giờ 52 phút)"
  - "Bài thi sẽ được random từ ngân hàng đề theo level của bạn"
  - "Không thể tạm dừng giữa chừng"

**Random Button Section**:
- Button: "Random đề thi mới"
  - Icon: Shuffle + Sparkles
  - Size: Large
  - Color: Blue-600
  - Loading state: "Đang random..."

**Exam Preview** (after random):

**4 Cards** (grid 2x2):

**Card 1: Reading**:
- Header:
  - Icon: Book (blue)
  - Skill: "Reading"
  - Level badge: "B2"
  
- Content:
  - Title: "Reading Full Test - Đề số 15"
  - Details:
    - 📝 40 câu hỏi
    - ⏱️ 60 phút
    - 📊 Difficulty: Medium
  
- Footer:
  - "Part 1, 2, 3"

**Card 2: Listening**:
- Similar structure
- Icon: Headphones (purple)
- 35 câu, 40 phút

**Card 3: Writing**:
- Icon: PenTool (green)
- 2 tasks, 60 phút

**Card 4: Speaking**:
- Icon: Mic (orange)
- 3 parts, 12 phút

**Total Summary**:
- "Tổng: 172 phút | 4 kỹ năng | Level: B2"

**Start Section**:
- **Important Rules** (bordered box):
  - ⚠️ Không thể tạm dừng giữa chừng
  - ⚠️ Không thể quay lại kỹ năng đã làm
  - ⚠️ Tự động nộp bài khi hết giờ
  - ⚠️ Chuẩn bị microphone cho Speaking
  - ⚠️ Đảm bảo kết nối internet ổn định

- **Checkbox**: "Tôi đã đọc và hiểu các quy định trên"

- **Buttons**:
  - "Random lại" (secondary)
  - "Bắt đầu thi" (primary, large, disabled nếu chưa check)

**Previous Exams** (optional section):
- List of previous mock exams
- Show: Date, Score, Level
- Link: "Xem kết quả"

#### Chức năng

1. **Random Exams**:
   - Click "Random đề thi mới"
   - Call API: POST /api/mock-exam/random
   - Receive 4 exercise IDs
   - Fetch exercise details
   - Display 4 cards

2. **Re-random**:
   - Click "Random lại"
   - Confirm: "Bạn có chắc muốn random lại?"
   - Random new set

3. **Start Exam**:
   - Validate checkbox
   - Show final confirmation modal
   - Confirm → Create exam session
   - Navigate to Exam Interface

#### Luồng xử lý

```
User arrives at Mock Exam page
  ↓
Show intro + "Random đề thi mới" button
  ↓
User clicks "Random đề thi mới"
  ↓
Call POST /api/mock-exam/random
  ↓
Backend:
  ├─ Get user level (or default B1-B2)
  ├─ Random 1 Reading exercise (level phù hợp)
  ├─ Random 1 Listening exercise
  ├─ Random 1 Writing exercise
  ├─ Random 1 Speaking exercise
  ├─ Exclude exercises done in last 7 days
  └─ Return 4 exercise IDs
  ↓
Frontend:
  ├─ Fetch details for 4 exercises
  └─ Display 4 cards
  ↓
User reviews exercises
  ↓
User checks "Đã đọc quy định"
  ↓
User clicks "Bắt đầu thi"
  ↓
Show confirmation modal:
  - "Bạn có chắc sẵn sàng bắt đầu?"
  - "Bài thi không thể tạm dừng"
  ↓
User confirms
  ↓
Create exam session:
  - POST /api/mock-exam/sessions
  - Body: { exerciseIds: [id1, id2, id3, id4] }
  - Return: sessionId
  ↓
Navigate to Exam Interface với sessionId
```

---

### 3.2. Exam Interface

**File**: `/components/exam/ExamInterface.tsx`

#### Tên màn hình
**Exam Interface / Giao diện thi thử**

#### Mục đích
Giao diện làm bài thi đầy đủ 4 kỹ năng

#### Các thành phần UI

**Global Top Bar** (fixed, always visible):
- Left:
  - Logo VSTEPRO (small)
  - Text: "VSTEP Mock Exam"
  
- Center:
  - **Global Timer**: "2:45:30"
    - Format: H:MM:SS
    - Color:
      - Green: > 60 min
      - Yellow: 30-60 min
      - Red: < 30 min
      - Flashing red: < 5 min
    - Icon: Clock
  
- Right:
  - Current skill: "Reading (1/4)"
  - Fullscreen toggle button

**Progress Bar** (below top bar):
- 4 segments horizontal progress
- Each segment:
  - Icon + Label (Reading/Listening/Writing/Speaking)
  - State:
    - Current: Blue, thick border
    - Completed: Green, checkmark ✓
    - Upcoming: Gray, locked 🔒
  - Cannot click (just visual)

**Main Content Area**:
- Full width, full height (below progress bar)
- Content changes per skill
- No sidebar

**Skill Component Rendering**:

```tsx
{currentSkill === 'reading' && (
  <ReadingExercise
    exerciseId={exercises.reading}
    isExamMode={true}
    onComplete={handleSkillComplete}
  />
)}

{currentSkill === 'listening' && (
  <ListeningExercise
    exerciseId={exercises.listening}
    isExamMode={true}
    onComplete={handleSkillComplete}
  />
)}

{currentSkill === 'writing' && (
  <WritingExercise
    exerciseId={exercises.writing}
    isExamMode={true}
    onComplete={handleSkillComplete}
  />
)}

{currentSkill === 'speaking' && (
  <SpeakingExercise
    exerciseId={exercises.speaking}
    isExamMode={true}
    onComplete={handleSkillComplete}
  />
)}
```

**Key Differences in Exam Mode**:
- No separate skill timer (use global timer)
- No pause button
- No exit button (show warning if try to leave)
- Button changed from "Nộp bài" to "Hoàn thành [Skill]"
- Auto-save more frequent (every 5 seconds)

**Skill Transition Modal**:

**Component**: `/components/exam/SkillTransitionModal.tsx`

**Example (after Reading)**:
- Overlay: Semi-transparent black
- Modal: Center, large

**Content**:
- Icon: Green checkmark (large, animated)
- Title: "Đã hoàn thành Reading!"
- Stats:
  - "Bạn đã trả lời: 35/40 câu"
  - "Thời gian: 45:30/60:00"
- Divider
- Next skill info:
  - "Phần tiếp theo: Listening"
  - Icon: Headphones
  - "35 câu hỏi • 40 phút"
- Timer info:
  - "Thời gian còn lại: 1 giờ 52 phút 30 giây"
- Countdown:
  - "Tự động chuyển sau: 5 giây"
  - Circular countdown animation
- Button: "Tiếp tục ngay" (skip countdown)

**Auto-transition**:
- After 5 seconds, auto move to next skill
- User can click "Tiếp tục ngay" to skip

---

### 3.3. Exam Results Page

**File**: Extended from ExamInterface or separate component

#### Tên màn hình
**Exam Results / Kết quả thi thử**

#### Mục đích
Hiển thị kết quả tổng hợp 4 kỹ năng

#### Các thành phần UI

**Loading State** (while AI grading):

**Progress Indicator**:
- Reading: ✅ Đã chấm (8.5/10)
- Listening: ✅ Đã chấm (7.0/10)
- Writing: ⏳ Đang chấm AI... (45%)
  - Progress bar
  - Estimated time: "~30 giây"
- Speaking: ⏳ Chưa bắt đầu
  - Gray, waiting

**Full Results** (when all ready):

**Header**:
- Title: "Kết quả thi thử VSTEP"
- Date: "15 tháng 12, 2024"
- Time: "10:30 AM"

**Overall Score Card** (hero section):
- **Circle Progress** (large, center):
  - Score: "7.5"
  - Label: "/10"
  - Color gradient (based on score)
  
- **Band Level**:
  - "VSTEP Band 7.5"
  - "Tương đương: C1"
  
- **Congratulations Message**:
  - "Chúc mừng! Bạn đã hoàn thành bài thi."
  - "Kết quả của bạn ở mức Cao (C1)"

**Skills Breakdown** (4 cards in row):

**Card 1: Reading**:
- Header:
  - Icon: Book (large, blue)
  - Skill: "Reading"
  
- Score:
  - Large: "8.5/10"
  - Progress bar (85%)
  
- Details:
  - Correct: 34/40 (85%)
  - Time: 45:30/60:00
  - Level: "Tốt"
  
- Button: "Xem chi tiết" (link to detailed review)

**Card 2: Listening**:
- Similar structure
- Score: 7.0/10
- Icon: Headphones (purple)

**Card 3: Writing**:
- Score: 7.5/10
- Sub-scores (collapse/expand):
  - Task Achievement: 7.5
  - Coherence: 8.0
  - Lexical: 7.0
  - Grammatical: 7.5
- Icon: PenTool (green)

**Card 4: Speaking**:
- Score: 7.0/10
- Sub-scores:
  - Task Response: 7.0
  - Coherence: 7.5
  - Vocabulary: 7.0
  - Grammar: 6.5
  - Pronunciation: 7.0
- Icon: Mic (orange)

**Performance Analysis**:

**Radar Chart**:
- 4 axes (Reading, Listening, Writing, Speaking)
- Plot user scores
- Show average line (for comparison)

**Strengths & Weaknesses**:

**Strengths** (green checkmarks):
- ✅ Reading - Đọc hiểu rất tốt (8.5/10)
- ✅ Writing - Coherence and Cohesion xuất sắc (8.0/10)

**Weaknesses** (yellow warnings):
- ⚠️ Listening - Cần cải thiện nghe phần hội thoại dài (Part 3: 60%)
- ⚠️ Speaking - Phát âm và ngữ điệu cần luyện tập thêm (6.5/10)

**Recommendations**:
- "Luyện thêm Listening Part 3 với các bài hội thoại học thuật"
- "Thực hành Speaking với focus vào pronunciation"
- "Tiếp tục duy trì Reading và Writing"

**Certificate Section**:
- Preview: Certificate thumbnail
- Button: "Tải chứng nhận" (Download PDF)
  - Icon: Download
  - Size: Large, primary

**Actions**:
- Button: "Xem chi tiết từng kỹ năng"
  - Opens tabs/accordion với detailed review
  
- Button: "Thi lại"
  - Random new exam set
  - Navigate to Mock Exam page
  
- Button: "Luyện tập theo khuyến nghị"
  - Navigate to Practice với filter = weaknesses
  
- Button: "Về trang chủ"

**Share Section** (optional):
- "Chia sẻ kết quả"
- Social buttons: Facebook, Twitter, LinkedIn
- Copy link button

#### Chức năng

1. **Load Results**:
   - Poll for AI grading completion
   - Update progress indicators
   - Display when all ready

2. **View Detailed Review**:
   - Click "Xem chi tiết"
   - Navigate to skill-specific result page
   - Same as Practice Result pages

3. **Download Certificate**:
   - Click "Tải chứng nhận"
   - Generate PDF (server-side)
   - Auto download

4. **Redo Exam**:
   - Click "Thi lại"
   - Random new exercises
   - Navigate to Mock Exam page

---

## 4. User Flow Diagrams

### 4.1. Complete Mock Exam Flow

```
[Start] Student wants to take mock exam
  ↓
Navigate to Practice Home
  ↓
Click "Thi thử Random" card
  ↓
Navigate to Mock Exam page
  ↓
Show intro + instructions
  ↓
User clicks "Random đề thi mới"
  ↓
System randoms 4 exercises:
  ├─ Reading (level B2)
  ├─ Listening (level B2)
  ├─ Writing (level B2)
  └─ Speaking (level B2)
  ↓
Display 4 exercise cards
  ↓
User reviews exercises
  ↓
User can:
  ├─ "Random lại" → Random new set
  └─ "Bắt đầu thi" → Continue
  ↓
User checks "Đã đọc quy định"
  ↓
User clicks "Bắt đầu thi"
  ↓
Show final confirmation modal
  ↓
User confirms
  ↓
POST /api/mock-exam/sessions
  ↓
Create exam session:
  ├─ Save 4 exercise IDs
  ├─ Set status: in_progress
  ├─ Set start_time
  └─ Return session_id
  ↓
Navigate to Exam Interface
  ↓
Start global timer (172 minutes)
  ↓
════════════════════════
SKILL 1: READING (60 min)
════════════════════════
  ↓
Show Pre-Exam Instructions
  ↓
User clicks "Bắt đầu Reading"
  ↓
Load Reading exercise
  ↓
User reads passages + answers questions
  ↓
Auto-save every 5 seconds
  ↓
User clicks "Hoàn thành Reading"
  ↓
Validate: Check all answered (optional warning)
  ↓
Save Reading answers
  ↓
Auto-grade Reading (instant)
  ↓
Show Skill Transition Modal:
  ├─ "Đã hoàn thành Reading! (34/40)"
  ├─ "Tiếp theo: Listening"
  └─ Countdown: 5 seconds
  ↓
Auto-transition or click "Tiếp tục ngay"
  ↓
════════════════════════
SKILL 2: LISTENING (40 min)
════════════════════════
  ↓
Show Pre-Exam Instructions
  ↓
User clicks "Bắt đầu Listening"
  ↓
Load Listening exercise
  ↓
Auto-play audio (Part 1 → Part 2 → Part 3)
  ↓
User answers while listening
  ↓
Auto-save every 5 seconds
  ↓
User clicks "Hoàn thành Listening"
  ↓
Save Listening answers
  ↓
Auto-grade Listening (instant)
  ↓
Skill Transition Modal
  ↓
════════════════════════
SKILL 3: WRITING (60 min)
════════════════════════
  ↓
Show Pre-Exam Instructions
  ↓
User clicks "Bắt đầu Writing"
  ↓
Load Writing exercise (Task 1 + Task 2)
  ↓
User writes Task 1 (20 min)
  ↓
User writes Task 2 (40 min)
  ↓
Auto-save every 5 seconds
  ↓
User clicks "Hoàn thành Writing"
  ↓
Validate word counts
  ↓
Save Writing submission
  ↓
Queue for AI grading
  ↓
Skill Transition Modal
  ↓
════════════════════════
SKILL 4: SPEAKING (12 min)
════════════════════════
  ↓
Show Pre-Exam Instructions + Mic Test
  ↓
User tests microphone
  ↓
User clicks "Bắt đầu Speaking"
  ↓
Part 1: Interview (3 min)
  ├─ Display questions
  ├─ User records answers
  └─ Save recordings
  ↓
Part 2: Long turn (3 min)
  ├─ Prep time: 1 min
  ├─ Speaking time: 2 min (auto-record)
  └─ Save recording
  ↓
Part 3: Discussion (4 min)
  ├─ Display questions
  ├─ User records answers
  └─ Save recordings
  ↓
Speaking completed
  ↓
Upload all recordings
  ↓
Queue for AI grading
  ↓
════════════════════════
EXAM COMPLETED
════════════════════════
  ↓
Update session status: completed
  ↓
Stop global timer
  ↓
Navigate to Results Page
  ↓
Show loading state:
  ├─ Reading: ✅ Graded (8.5)
  ├─ Listening: ✅ Graded (7.0)
  ├─ Writing: ⏳ Grading... (30s)
  └─ Speaking: ⏳ Grading... (90s)
  ↓
Poll API every 5 seconds
  ↓
When all graded:
  ├─ Calculate overall score
  ├─ Generate analysis
  ├─ Generate certificate
  └─ Display full results
  ↓
[End] User views results + downloads certificate
```

---

## 5. Sequence Diagrams

### 5.1. Random Exam Sequence

```
Student    Frontend    API Server    Database    AI Service
  |            |            |             |            |
  |--Click---->|            |             |            |
  | "Random"   |            |             |            |
  |            |            |             |            |
  |            |--POST /random           |            |
  |            |            |             |            |
  |            |            |--Get user level------->|
  |            |            |             |            |
  |            |            |<--Level: B2--            |
  |            |            |             |            |
  |            |            |--Query exercises------->|
  |            |            | WHERE:      |            |
  |            |            | - skill=each|            |
  |            |            | - level=B2  |            |
  |            |            | - active=true            |
  |            |            | - NOT in recent          |
  |            |            |             |            |
  |            |            |<--Exercise pools         |
  |            |            |             |            |
  |            |            |--Random 1 each--------->|
  |            |            | (Reading, Listening,     |
  |            |            |  Writing, Speaking)      |
  |            |            |             |            |
  |            |            |<--4 exercise IDs         |
  |            |            |             |            |
  |            |<--200 OK---|             |            |
  |            | exerciseIds|             |            |
  |            |            |             |            |
  |<--Display--|            |             |            |
  |  4 cards   |            |             |            |
  |            |            |             |            |
```

### 5.2. Start Exam Sequence

```
Student    Frontend    API Server    Database    Timer
  |            |            |             |          |
  |--Check---->|            |             |          |
  | "Đã đọc    |            |             |          |
  |  quy định" |            |             |          |
  |            |            |             |          |
  |--Click---->|            |             |          |
  | "Bắt đầu   |            |             |          |
  |  thi"      |            |             |          |
  |            |            |             |          |
  |            |--Confirm-->|             |          |
  |            | modal      |             |          |
  |            |            |             |          |
  |<--Confirm--|            |             |          |
  |            |            |             |          |
  |            |--POST /sessions         |          |
  |            | exerciseIds             |          |
  |            |            |             |          |
  |            |            |--CREATE session------->|
  |            |            | - 4 exercise_ids       |
  |            |            | - status: in_progress  |
  |            |            | - start_time: NOW      |
  |            |            | - time_limit: 172*60   |
  |            |            |             |          |
  |            |            |<--Session created      |
  |            |            | + session_id           |
  |            |            |             |          |
  |            |<--201------|             |          |
  |            | sessionId  |             |          |
  |            |            |             |          |
  |<--Navigate-|            |             |          |
  | to Exam    |            |             |          |
  | Interface  |            |             |          |
  |            |            |             |          |
  |            |--Start-----|-------------|--------->|
  |            | timer      |             |          |
  |            | (172 min)  |             |          |
  |            |            |             |          |
  |<--Display--|            |             |          |
  | Reading    |            |             |          |
  | exercise   |            |             |          |
  |            |            |             |          |
```

### 5.3. Skill Transition Sequence

```
Student    Frontend    API Server    Database
  |            |            |             |
  |--Complete->|            |             |
  | Reading    |            |             |
  |            |            |             |
  |            |--Submit--->|             |
  |            | answers    |             |
  |            |            |             |
  |            |            |--Save answers--------->|
  |            |            |             |
  |            |            |--Auto-grade----------->|
  |            |            | (compare with key)     |
  |            |            |             |
  |            |            |<--Score calculated     |
  |            |            |             |
  |            |            |--Update session------->|
  |            |            | reading_score          |
  |            |            | reading_status: done   |
  |            |            |             |
  |            |<--200 OK---|             |
  |            | + score    |             |
  |            |            |             |
  |<--Show-----|            |             |
  | Transition |            |             |
  | Modal      |            |             |
  | "Reading   |            |             |
  | complete!" |            |             |
  |            |            |             |
  |--Wait 5s-->|            |             |
  | or click   |            |             |
  | "Tiếp tục" |            |             |
  |            |            |             |
  |<--Load-----|            |             |
  | Listening  |            |             |
  | exercise   |            |             |
  |            |            |             |
```

---

## 6. Database Design

### 6.1. Table: mock_exam_sessions

**Mô tả**: Lưu phiên thi thử

```sql
CREATE TABLE mock_exam_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Exercises (4 exercises, 1 per skill)
  reading_exercise_id UUID NOT NULL REFERENCES exercises(id),
  listening_exercise_id UUID NOT NULL REFERENCES exercises(id),
  writing_exercise_id UUID NOT NULL REFERENCES exercises(id),
  speaking_exercise_id UUID NOT NULL REFERENCES exercises(id),
  
  -- Session info
  status VARCHAR(20) DEFAULT 'in_progress',
    -- 'in_progress' | 'completed' | 'abandoned'
  current_skill VARCHAR(20) DEFAULT 'reading',
    -- 'reading' | 'listening' | 'writing' | 'speaking'
  
  -- Timing
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  total_time_limit INTEGER DEFAULT 10320,
    -- 172 minutes in seconds
  time_remaining INTEGER,
  
  -- Skill submission IDs
  reading_submission_id UUID REFERENCES exercise_submissions(id),
  listening_submission_id UUID REFERENCES exercise_submissions(id),
  writing_submission_id UUID REFERENCES exercise_submissions(id),
  speaking_submission_id UUID REFERENCES exercise_submissions(id),
  
  -- Scores (cached)
  reading_score DECIMAL(5,2),
  listening_score DECIMAL(5,2),
  writing_score DECIMAL(5,2),
  speaking_score DECIMAL(5,2),
  overall_score DECIMAL(5,2),
  
  -- Certificate
  certificate_id UUID,
  certificate_generated_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mock_sessions_user_id ON mock_exam_sessions(user_id);
CREATE INDEX idx_mock_sessions_status ON mock_exam_sessions(status);
CREATE INDEX idx_mock_sessions_created_at ON mock_exam_sessions(created_at DESC);
```

**Quan hệ**:
- N sessions → 1 user (n-1)
- N sessions → 4 exercises (n-1 each)
- 1 session → 4 submissions (1-1 each)

---

### 6.2. Table: certificates

**Mô tả**: Lưu chứng nhận thi thử

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES mock_exam_sessions(id) ON DELETE CASCADE,
  
  -- Certificate data
  certificate_number VARCHAR(50) UNIQUE NOT NULL,
    -- Format: VSTEP-YYYY-MM-XXXXXX
  full_name VARCHAR(255) NOT NULL,
  
  -- Scores
  reading_score DECIMAL(5,2),
  listening_score DECIMAL(5,2),
  writing_score DECIMAL(5,2),
  speaking_score DECIMAL(5,2),
  overall_score DECIMAL(5,2),
  band_level VARCHAR(10),
    -- 'A2' | 'B1' | 'B2' | 'C1'
  
  -- File
  pdf_url VARCHAR(500),
  qr_code_url VARCHAR(500),
  
  -- Verification
  verification_code VARCHAR(50) UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  exam_date DATE NOT NULL,
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
    -- Optional: Certificate expiry (e.g., 2 years)
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_session_id ON certificates(session_id);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);
```

---

## 7. API Endpoints

### 7.1. POST /api/mock-exam/random

**Mô tả**: Random 4 đề thi

**Request**:
```typescript
POST /api/mock-exam/random
Authorization: Bearer {token}
Content-Type: application/json

{
  "level": "B2",  // Optional, auto-detect from user
  "excludeRecent": 7  // Optional, exclude exams done in last N days
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "exercises": {
      "reading": {
        "id": "uuid-r",
        "title": "Reading Full Test - Đề số 15",
        "level": "B2",
        "totalQuestions": 40,
        "timeLimit": 60
      },
      "listening": {
        "id": "uuid-l",
        "title": "Listening Full Test - Đề số 8",
        "level": "B2",
        "totalQuestions": 35,
        "timeLimit": 40
      },
      "writing": {
        "id": "uuid-w",
        "title": "Writing Full Test - Đề số 12",
        "level": "B2",
        "totalTasks": 2,
        "timeLimit": 60
      },
      "speaking": {
        "id": "uuid-s",
        "title": "Speaking Full Test - Đề số 5",
        "level": "B2",
        "totalParts": 3,
        "timeLimit": 12
      }
    },
    "totalTime": 172,
    "totalQuestions": 75
  }
}
```

**Business Logic**:
1. Get user level (from profile or parameter)
2. Query exercises:
   - skill = each of 4 skills
   - type = 'fulltest'
   - level = user level (or B1-B2 if not set)
   - is_active = true
   - NOT in user's recent exams (last N days)
3. Random 1 exercise per skill
4. Return 4 exercise IDs + details

---

### 7.2. POST /api/mock-exam/sessions

**Mô tả**: Tạo phiên thi thử mới

**Request**:
```typescript
POST /api/mock-exam/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "exerciseIds": {
    "reading": "uuid-r",
    "listening": "uuid-l",
    "writing": "uuid-w",
    "speaking": "uuid-s"
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid-session",
    "status": "in_progress",
    "currentSkill": "reading",
    "startTime": "2024-12-15T10:00:00Z",
    "totalTimeLimit": 10320,
    "timeRemaining": 10320
  }
}
```

**Business Logic**:
1. Validate all 4 exercise IDs exist
2. Create mock_exam_session record
3. Set status = 'in_progress'
4. Set current_skill = 'reading'
5. Set start_time = NOW()
6. Set time_limit = 172 * 60 = 10320 seconds
7. Return session_id

---

### 7.3. GET /api/mock-exam/sessions/:id

**Mô tả**: Lấy thông tin phiên thi

**Request**:
```typescript
GET /api/mock-exam/sessions/uuid-session-id
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "uuid-session",
      "status": "in_progress",
      "currentSkill": "writing",
      "startTime": "2024-12-15T10:00:00Z",
      "timeRemaining": 4500,
      "exercises": {
        "reading": { /* exercise details */ },
        "listening": { /* ... */ },
        "writing": { /* ... */ },
        "speaking": { /* ... */ }
      },
      "submissions": {
        "reading": {
          "id": "uuid-sub-r",
          "status": "graded",
          "score": 8.5
        },
        "listening": {
          "id": "uuid-sub-l",
          "status": "graded",
          "score": 7.0
        },
        "writing": {
          "id": "uuid-sub-w",
          "status": "submitted",
          "aiGradingStatus": "pending"
        },
        "speaking": null
      }
    }
  }
}
```

---

### 7.4. PUT /api/mock-exam/sessions/:id/skill-complete

**Mô tả**: Đánh dấu hoàn thành 1 skill và chuyển sang skill tiếp theo

**Request**:
```typescript
PUT /api/mock-exam/sessions/uuid-session-id/skill-complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "skill": "reading",
  "submissionId": "uuid-submission"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "completedSkill": "reading",
    "nextSkill": "listening",
    "score": 8.5,
    "timeRemaining": 6720
  }
}
```

**Business Logic**:
1. Validate session belongs to user
2. Validate skill is current_skill
3. Update session:
   - Set [skill]_submission_id = submissionId
   - Set [skill]_score = score (from submission)
   - Set current_skill = next skill
   - Update time_remaining
4. If all 4 skills complete:
   - Set status = 'completed'
   - Calculate overall_score
   - Generate certificate
5. Return next skill info

---

### 7.5. GET /api/mock-exam/sessions/:id/results

**Mô tả**: Lấy kết quả tổng hợp

**Request**:
```typescript
GET /api/mock-exam/sessions/uuid-session-id/results
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "uuid-session",
      "status": "completed",
      "examDate": "2024-12-15",
      "totalTime": 9845
    },
    "scores": {
      "overall": 7.5,
      "reading": 8.5,
      "listening": 7.0,
      "writing": 7.5,
      "speaking": 7.0
    },
    "bandLevel": "C1",
    "breakdown": {
      "reading": {
        "score": 8.5,
        "correctCount": 34,
        "totalQuestions": 40,
        "percentage": 85.0,
        "timeTaken": 2730
      },
      "listening": {
        "score": 7.0,
        "correctCount": 28,
        "totalQuestions": 35,
        "percentage": 80.0,
        "timeTaken": 2295
      },
      "writing": {
        "score": 7.5,
        "aiScores": {
          "taskAchievement": 7.5,
          "coherenceCohesion": 8.0,
          "lexicalResource": 7.0,
          "grammaticalAccuracy": 7.5
        },
        "timeTaken": 3540
      },
      "speaking": {
        "score": 7.0,
        "aiScores": {
          "taskResponse": 7.0,
          "coherenceCohesion": 7.5,
          "vocabulary": 7.0,
          "grammar": 6.5,
          "pronunciation": 7.0
        },
        "timeTaken": 720
      }
    },
    "analysis": {
      "strengths": [
        "Reading - Đọc hiểu xuất sắc (8.5/10)",
        "Writing - Coherence and Cohesion tốt (8.0/10)"
      ],
      "weaknesses": [
        "Listening - Part 3 cần cải thiện (60%)",
        "Speaking - Grammar và Pronunciation (6.5/10)"
      ],
      "recommendations": [
        "Luyện thêm Listening Part 3 với bài học thuật",
        "Thực hành Speaking focus vào phát âm",
        "Tiếp tục duy trì Reading và Writing"
      ]
    },
    "certificate": {
      "id": "uuid-cert",
      "certificateNumber": "VSTEP-2024-12-001234",
      "pdfUrl": "https://cdn.../certificate.pdf",
      "verificationCode": "ABC123XYZ"
    }
  }
}
```

**Notes**:
- Reading/Listening results available immediately
- Writing/Speaking may have status "pending" if AI grading not complete
- Poll this endpoint until all graded

---

### 7.6. POST /api/certificates/generate

**Mô tả**: Tạo chứng nhận (called by backend after exam complete)

**Request** (Internal):
```typescript
POST /api/certificates/generate
Content-Type: application/json

{
  "sessionId": "uuid-session",
  "userId": "uuid-user"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "certificateId": "uuid-cert",
    "certificateNumber": "VSTEP-2024-12-001234",
    "pdfUrl": "https://cdn.../certificate.pdf",
    "qrCodeUrl": "https://cdn.../qrcode.png",
    "verificationCode": "ABC123XYZ"
  }
}
```

**Business Logic**:
1. Get session + user data
2. Generate unique certificate number
3. Create PDF using template:
   - User name
   - Exam date
   - Scores (all 4 + overall)
   - Band level
   - Certificate number
   - QR code (verification link)
4. Upload PDF to storage
5. Generate QR code
6. Save certificate record
7. Return certificate info

---

### 7.7. GET /api/certificates/verify/:code

**Mô tả**: Verify certificate (public endpoint)

**Request**:
```typescript
GET /api/certificates/verify/ABC123XYZ
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "certificate": {
      "certificateNumber": "VSTEP-2024-12-001234",
      "fullName": "Nguyễn Văn A",
      "examDate": "2024-12-15",
      "overallScore": 7.5,
      "bandLevel": "C1",
      "issuedAt": "2024-12-15T12:00:00Z"
    }
  }
}
```

**Response** (404):
```json
{
  "success": false,
  "error": {
    "code": "CERTIFICATE_NOT_FOUND",
    "message": "Chứng nhận không tồn tại hoặc không hợp lệ"
  }
}
```

---

## 8. Business Rules

### 8.1. Exam Session Rules

**One Active Session**:
- User can only have 1 active mock exam session
- Must complete or abandon before starting new

**Abandon Session**:
- If user leaves mid-exam:
  - Save progress
  - Mark status = 'abandoned'
  - Can resume within 24 hours
  - After 24h: Cannot resume, must start new

**Time Management**:
- Global timer: 172 minutes total
- No pause allowed
- If time runs out:
  - Auto-submit current skill
  - Move to next skill immediately
  - If on Speaking: Auto-stop recording

---

### 8.2. Skill Completion Rules

**Sequential Order**:
- Must complete in order: Reading → Listening → Writing → Speaking
- Cannot skip skills
- Cannot go back to previous skill

**Completion Criteria**:
- Reading: Click "Hoàn thành Reading"
- Listening: Click "Hoàn thành Listening"
- Writing: Click "Hoàn thành Writing"
- Speaking: Auto-complete when time up or manual complete

**Transition Time**:
- 5 seconds auto-transition
- User can skip countdown
- Use transition time to rest

---

### 8.3. Scoring Rules

**Overall Score**:
- Calculate: Average of 4 skill scores
- Round to 1 decimal place

**Band Level Mapping**:
- 0-3.9: A1-A2
- 4.0-5.4: A2
- 5.5-6.4: B1
- 6.5-7.4: B2
- 7.5-8.4: C1
- 8.5-10: C2

---

### 8.4. Certificate Rules

**Generation**:
- Auto-generate after all 4 skills graded
- Unique certificate number
- Valid indefinitely (no expiry)

**Verification**:
- QR code scans to verification page
- Public verification (no login required)
- Shows: Name, Date, Scores, Band

**Download**:
- PDF format, A4 size
- Can download multiple times
- Stored permanently

---

## Kết thúc Module Exam System

Module này tích hợp với:
- Module 02: Practice & Learning (sử dụng exercise data)
- Module 04: Grading System (auto-grading + AI grading)
- Module 12: Achievements (unlock badges)
- Module 19: Statistics (update exam history)
- Module 20: Notification (thông báo kết quả)
