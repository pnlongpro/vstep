# 📚 Module 02: Practice & Learning

> **Module luyện tập 4 kỹ năng VSTEP**
> 
> File: `02-MODULE-PRACTICE-LEARNING.md`  
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
Module Practice & Learning là module cốt lõi của VSTEPRO, cung cấp:
- **Luyện tập 4 kỹ năng**: Reading, Listening, Writing, Speaking
- **2 chế độ**: Part Practice (luyện theo phần) và Full Test (bài thi đầy đủ)
- **Chấm điểm tự động**: Reading và Listening
- **Chấm AI**: Writing và Speaking với feedback chi tiết
- **Auto-save**: Lưu tiến trình mỗi 10 giây
- **Lịch sử**: Lưu tất cả bài đã làm

### 1.2. Vai trò sử dụng

**Student (Học viên)**:
- Chọn kỹ năng luyện tập
- Chọn chế độ (Part/Full Test)
- Browse danh sách bài tập
- Làm bài tập
- Xem kết quả và giải thích
- Review bài đã làm
- Bookmark câu hỏi

**Teacher (Giáo viên)**:
- Preview bài tập
- Sử dụng để chuẩn bị giảng dạy
- Tất cả quyền của Student

**Admin**:
- Tất cả quyền của Teacher
- Quản lý nội dung bài tập

### 1.3. Cấu trúc 4 kỹ năng theo VSTEP

#### **Reading (Đọc hiểu)**
- **Part 1**: Điền từ vào chỗ trống (10 câu)
- **Part 2**: Đọc đoạn văn ngắn và trả lời câu hỏi (10 câu)
- **Part 3**: Đọc đoạn văn dài và trả lời câu hỏi (20 câu)
- **Tổng**: 40 câu, 60 phút

#### **Listening (Nghe hiểu)**
- **Part 1**: Nghe và chọn đáp án đúng - Hội thoại ngắn (8 câu)
- **Part 2**: Nghe và chọn đáp án đúng - Monologue (7 câu)
- **Part 3**: Nghe và chọn đáp án đúng - Hội thoại dài hoặc lecture (20 câu)
- **Tổng**: 35 câu, ~40 phút

#### **Writing (Viết)**
- **Task 1**: Viết email/thư (ít nhất 120 từ, 20 phút)
- **Task 2**: Viết essay (ít nhất 250 từ, 40 phút)
- **Tổng**: 2 tasks, 60 phút

#### **Speaking (Nói)**
- **Part 1**: Interview - Giới thiệu bản thân (3 phút)
- **Part 2**: Long turn - Nói về chủ đề (1 phút chuẩn bị, 2 phút nói)
- **Part 3**: Discussion - Thảo luận (4 phút)
- **Tổng**: 3 parts, ~12 phút

### 1.4. Phạm vi module
- Practice Home (chọn kỹ năng)
- Mode Selection (Part/Full Test)
- Practice List (danh sách bài tập)
- Exercise Interface (làm bài)
- Result Page (xem kết quả)
- History (lịch sử làm bài)

---

## 2. Danh sách chức năng

### 2.1. Chức năng chính

#### A. Chọn kỹ năng luyện tập

**Mô tả**: Học viên chọn 1 trong 4 kỹ năng để luyện tập

**Component**: `PracticeHome.tsx`

**Options**:
1. **Reading Practice** (Luyện đọc)
   - Icon: Book
   - Color: Blue
   - Navigate to: Reading Practice

2. **Listening Practice** (Luyện nghe)
   - Icon: Headphones
   - Color: Purple
   - Navigate to: Listening Practice

3. **Writing Practice** (Luyện viết)
   - Icon: PenTool
   - Color: Green
   - Navigate to: Writing Practice

4. **Speaking Practice** (Luyện nói)
   - Icon: Mic
   - Color: Orange
   - Navigate to: Speaking Practice

**Business Logic**:
1. Display 4 skill cards
2. Show quick stats for each skill (số bài đã làm, avg score)
3. Click card → Navigate to Mode Selection

---

#### B. Chọn chế độ luyện tập

**Mô tả**: Chọn giữa Part Practice và Full Test

**Component**: `ModeSelectionModal.tsx`

**Modes**:

**1. Part Practice (Làm theo phần)**:
- Luyện từng phần riêng biệt
- Thời gian linh hoạt hoặc theo chuẩn
- Phù hợp: Luyện tập kỹ năng cụ thể
- Example (Reading):
  - Part 1 only (10 câu)
  - Part 2 only (10 câu)
  - Part 3 only (20 câu)

**2. Full Test (Làm bộ đề đầy đủ)**:
- Làm tất cả các phần liên tiếp
- Timer theo chuẩn VSTEP
- Phù hợp: Thi thử, đánh giá năng lực
- Example (Reading):
  - Part 1 + Part 2 + Part 3 (40 câu, 60 phút)

**Business Logic**:
1. Show modal with 2 options
2. Click "Part Practice" → Show Part Selection Modal
3. Click "Full Test" → Navigate to Practice List (full test mode)

---

#### C. Chọn phần luyện tập (Part Practice)

**Mô tả**: Chọn phần cụ thể để luyện (khi chọn Part Practice)

**Component**: `PartSelectionModal.tsx`

**Example cho Reading**:
- [ ] Part 1: Điền từ vào chỗ trống (10 câu)
- [ ] Part 2: Đọc đoạn văn ngắn (10 câu)
- [ ] Part 3: Đọc đoạn văn dài (20 câu)

**Features**:
- Multiple selection (có thể chọn nhiều part)
- Show estimated time
- Show number of questions
- Button: "Tiếp tục"

**Business Logic**:
1. User selects part(s)
2. Calculate total questions and time
3. Click "Tiếp tục" → Navigate to Practice List with selected parts

---

#### D. Browse danh sách bài tập

**Mô tả**: Xem danh sách bài tập có sẵn

**Component**: `PracticeList.tsx`

**Display**:
- Grid/List of exercises
- Each exercise card shows:
  - Title (e.g., "Reading Full Test - Đề số 1")
  - Level (A2/B1/B2/C1)
  - Type (Part 1/Part 2/Full Test)
  - Number of questions
  - Estimated time
  - Difficulty (Easy/Medium/Hard)
  - Status:
    - Not started (chưa làm)
    - In progress (đang làm)
    - Completed (đã làm) + score
  - Button: "Bắt đầu" / "Tiếp tục" / "Làm lại"

**Features**:
- **Filter**:
  - By level (A2/B1/B2/C1)
  - By type (Part 1/2/3, Full Test)
  - By status (All/Not started/In progress/Completed)
  
- **Sort**:
  - Newest first
  - Oldest first
  - Difficulty: Easy → Hard
  - Difficulty: Hard → Easy

- **Search**:
  - Search by title
  - Real-time filter

**Business Logic**:
1. Fetch exercises based on:
   - Skill (reading/listening/writing/speaking)
   - Mode (part/fulltest)
   - Selected parts (if part mode)
2. Filter and sort
3. Show status based on user history
4. Click exercise → Navigate to Exercise Interface

---

#### E. Làm bài tập (Exercise Interface)

**Mô tả**: Giao diện làm bài tập cho từng kỹ năng

**Components**:
- `ReadingPractice.tsx` → `ReadingExercise.tsx`
- `ListeningPractice.tsx` → `ListeningExercise.tsx`
- `WritingPractice.tsx` → `WritingExercise.tsx`
- `SpeakingPractice.tsx` → `SpeakingExercise.tsx`

**Common Features**:

**1. Timer**:
- Countdown timer
- Warning khi còn 5 phút
- Auto-submit khi hết giờ
- Có thể tắt timer (practice mode)

**2. Progress Tracker**:
- Question navigator (câu hỏi navigation)
- Hiển thị câu đã làm / chưa làm
- Bookmarked questions (đánh dấu)
- Jump to question

**3. Auto-save**:
- Save every 10 seconds
- Save to localStorage first
- Sync to server when online
- Restore on reload

**4. Submit**:
- Button "Nộp bài" (always visible)
- Confirmation modal trước khi nộp
- Disable back button sau khi nộp

**Skill-specific Features**:

**Reading Exercise**:
- **Layout**: 2 columns (passage | questions)
- **Passage**:
  - Scrollable text
  - Highlight text tool
  - Zoom in/out
- **Questions**:
  - Multiple choice (A/B/C/D)
  - Radio buttons
  - Clear answer button
- **Navigation**:
  - Previous/Next buttons
  - Question number navigator

**Listening Exercise**:
- **Audio Player**:
  - Play/Pause
  - Volume control
  - Playback speed (0.75x, 1x, 1.25x)
  - Replay limit (1-2 times per audio)
- **Questions**:
  - Multiple choice
  - Can answer while listening
- **Parts**:
  - Part 1-3 play sequentially
  - Cannot replay previous part

**Writing Exercise**:
- **Task 1**:
  - Text editor (rich text)
  - Word counter
  - Time: 20 minutes
  - Min words: 120
  
- **Task 2**:
  - Text editor
  - Word counter  
  - Time: 40 minutes
  - Min words: 250

- **Tools**:
  - Spell check
  - Grammar suggestions (optional)
  - Save draft
  - Templates (optional)

**Speaking Exercise**:
- **Part 1 (Interview)**:
  - Display questions one by one
  - Record answer for each
  - Time per question: 1 minute

- **Part 2 (Long turn)**:
  - Preparation: 1 minute (show topic)
  - Recording: 2 minutes
  - Cannot re-record

- **Part 3 (Discussion)**:
  - Questions about Part 2 topic
  - Record answers
  - Time: 4 minutes total

- **Recording**:
  - Audio level meter
  - Test microphone
  - Record/Stop/Replay
  - Upload to server

**Business Logic**:
1. Load exercise data
2. Check if has saved progress → Restore or start fresh
3. Start timer (if enabled)
4. User answers questions
5. Auto-save every 10 seconds
6. Submit:
   - Validate all answers (warning if unanswered)
   - Stop timer
   - Save final answers
   - Call grading API
   - Navigate to Result Page

---

#### F. Xem kết quả (Result Page)

**Mô tả**: Hiển thị điểm số và review bài làm

**Components**:
- `ReadingResult.tsx`
- `ListeningResult.tsx`
- `WritingResult.tsx`
- `SpeakingResult.tsx`

**Common Sections**:

**1. Score Summary**:
- Total score (band score 0-10)
- Percentage correct
- Time taken
- Visual: Circle progress bar

**2. Performance Breakdown**:
- Score by part
- Chart visualization
- Strengths/Weaknesses

**3. Answer Review** (Reading/Listening):
- Question-by-question review
- Show:
  - Question text
  - Your answer (highlight red if wrong, green if correct)
  - Correct answer
  - Explanation
- Filter:
  - All questions
  - Correct only
  - Incorrect only

**4. AI Feedback** (Writing/Speaking):
- Overall band score (0-10)
- Criteria scores:
  - Task Achievement/Response
  - Coherence and Cohesion
  - Lexical Resource
  - Grammatical Range and Accuracy
  - (Speaking): Pronunciation and Fluency
- Detailed feedback:
  - Strengths (what you did well)
  - Weaknesses (areas to improve)
  - Specific suggestions
  - Sample improvements

**5. Actions**:
- Save result
- Share result
- Redo exercise
- Practice similar level
- Back to Practice List

**Skill-specific Features**:

**Reading/Listening Result**:
- Instant scoring (automatic)
- Show correct/incorrect immediately
- Explanation for each answer
- Statistics:
  - Accuracy by part
  - Common mistake types

**Writing Result**:
- AI grading (takes ~30 seconds)
- Show writing with highlights:
  - Grammar errors (red underline)
  - Vocabulary suggestions (blue)
  - Structure issues (yellow)
- Band scores for each criterion
- Detailed feedback per task
- Sample essays (same score range)

**Speaking Result**:
- AI grading (takes ~1-2 minutes)
- Audio playback of your recording
- Transcript (if available)
- Pronunciation analysis:
  - Problem sounds
  - Intonation issues
- Fluency analysis:
  - Speaking rate
  - Pause frequency
  - Hesitations
- Suggestions for improvement

**Business Logic**:
1. Receive exercise_id + submission_id from submit
2. For Reading/Listening:
   - Calculate score immediately
   - Show results
3. For Writing/Speaking:
   - Show loading state "Đang chấm bài..."
   - Poll API every 5 seconds
   - When ready, display AI feedback
4. Save result to history
5. Unlock badges if achieved
6. Update statistics

---

#### G. Xem lịch sử làm bài

**Mô tả**: Xem tất cả bài đã làm

**Component**: `History.tsx`

**Display**:
- Table/List of submissions
- Columns:
  - Date
  - Skill (icon)
  - Exercise name
  - Type (Part/Full Test)
  - Score
  - Time taken
  - Status (Completed/In progress)
  - Actions (View result, Redo)

**Features**:
- **Filter**:
  - By skill (Reading/Listening/Writing/Speaking)
  - By type (Part/Full Test)
  - By date range
  - By score range

- **Sort**:
  - Recent first (default)
  - Oldest first
  - Highest score
  - Lowest score

- **Search**:
  - Search by exercise name

- **Pagination**:
  - 20 items per page
  - Load more / Page numbers

**Actions**:
- **View Result**: Open Result Page
- **Redo**: Start exercise again
- **Delete**: Remove from history (confirm)

**Business Logic**:
1. Fetch user's exercise history
2. Filter and sort
3. Display paginated list
4. Click "View Result" → Navigate to Result Page with submission_id
5. Click "Redo" → Navigate to Exercise Interface with fresh state

---

### 2.2. Chức năng phụ

#### A. Bookmark câu hỏi

**Feature**: Đánh dấu câu khó để review sau

**Usage**:
- Click bookmark icon on question
- Saved to user profile
- Access from "My Bookmarks" page

**Display**:
- List of bookmarked questions
- Group by skill
- Show question + answer + explanation

---

#### B. Note-taking

**Feature**: Ghi chú cá nhân cho câu hỏi

**Usage**:
- Add note to specific question
- Private notes (chỉ user nhìn thấy)
- Sync across devices

---

#### C. Timer modes

**Modes**:
1. **Standard Timer**: Đếm ngược theo chuẩn VSTEP
2. **Untimed**: Không giới hạn thời gian
3. **Custom Timer**: Tự set thời gian

---

#### D. Keyboard shortcuts

**Shortcuts**:
- `1-4`: Chọn đáp án A-D
- `→`: Next question
- `←`: Previous question
- `Ctrl+S`: Save progress
- `Ctrl+Enter`: Submit

---

#### E. Accessibility features

**Features**:
- Text-to-speech for questions
- Adjustable font size
- High contrast mode
- Keyboard navigation

---

### 2.3. Quyền sử dụng

| Chức năng | Student | Teacher | Admin |
|-----------|---------|---------|-------|
| **Practice** | | | |
| Choose Skill | ✅ | ✅ | ✅ |
| Choose Mode | ✅ | ✅ | ✅ |
| Browse Exercises | ✅ | ✅ | ✅ |
| Do Exercise | ✅ | ✅ | ✅ |
| View Results | ✅ | ✅ | ✅ |
| View History | ✅ | ✅ | ✅ |
| Bookmark Questions | ✅ | ✅ | ✅ |
| Add Notes | ✅ | ✅ | ✅ |
| **Admin** | | | |
| Manage Exercises | ❌ | ❌ | ✅ |
| View All Histories | ❌ | ❌ | ✅ |

---

## 3. Phân tích màn hình UI

### 3.1. Practice Home

**File**: `/components/PracticeHome.tsx`

#### Tên màn hình
**Practice Home / Trang luyện tập**

#### Mục đích
Điểm bắt đầu cho việc luyện tập, chọn kỹ năng

#### Các thành phần UI

**Header**:
- Page title: "Luyện tập"
- Subtitle: "Chọn kỹ năng bạn muốn luyện"

**Skills Grid** (2x2 trên desktop):

**1. Reading Card**:
- Icon: Book (large, blue)
- Title: "Reading"
- Subtitle: "Luyện đọc hiểu"
- Stats:
  - "X bài đã làm"
  - "Điểm TB: Y"
- Hover: Shadow lift
- Click: Navigate to Reading Practice

**2. Listening Card**:
- Icon: Headphones (large, purple)
- Title: "Listening"
- Subtitle: "Luyện nghe hiểu"
- Stats: Same as Reading

**3. Writing Card**:
- Icon: PenTool (large, green)
- Title: "Writing"
- Subtitle: "Luyện viết"
- Stats: Same as Reading

**4. Speaking Card**:
- Icon: Mic (large, orange)
- Title: "Speaking"
- Subtitle: "Luyện nói"
- Stats: Same as Reading

**Special Section**:
- Card: "Thi thử Random" (Module 03)
  - Icon: Shuffle
  - Description: "Thi thử với 4 đề ngẫu nhiên"
  - Button: "Bắt đầu thi thử"

**Quick Stats** (optional):
- Total exercises completed
- Total practice time
- Current streak

#### Chức năng

1. Display 4 skill cards with stats
2. Fetch user's practice stats
3. Click skill card → Navigate to skill practice
4. Click "Thi thử Random" → Navigate to Mock Exam

#### Luồng xử lý

```
User arrives at Practice Home
  ↓
Fetch user's practice stats
  ↓
Display 4 skill cards + stats
  ↓
User clicks a skill card (e.g., Reading)
  ↓
Navigate to Reading Practice page
  ↓
Show Mode Selection Modal
```

---

### 3.2. Mode Selection Modal

**File**: `/components/ModeSelectionModal.tsx`

#### Tên màn hình
**Mode Selection Modal**

#### Mục đích
Chọn chế độ luyện tập: Part hoặc Full Test

#### Các thành phần UI

**Modal Header**:
- Icon: Skill icon (Reading/Listening/Writing/Speaking)
- Title: "Chọn chế độ luyện tập"
- Close button (X)

**Mode Options** (2 cards):

**Card 1: Part Practice**:
- Icon: PuzzlePiece
- Title: "Làm theo phần"
- Description: "Luyện từng phần riêng biệt để tập trung kỹ năng cụ thể"
- Features:
  - ✓ Linh hoạt thời gian
  - ✓ Tập trung kỹ năng
  - ✓ Phù hợp ôn tập
- Button: "Chọn"

**Card 2: Full Test**:
- Icon: FileText
- Title: "Làm bộ đề đầy đủ"
- Description: "Làm tất cả các phần liên tiếp như thi thật"
- Features:
  - ✓ Timer theo chuẩn
  - ✓ Đánh giá tổng thể
  - ✓ Phù hợp thi thử
- Button: "Chọn"

**Footer**:
- Link: "Hướng dẫn cách làm bài" (open help modal)

#### Chức năng

1. Show modal when user enters skill practice
2. Click "Part Practice" → Show Part Selection Modal
3. Click "Full Test" → Navigate to Practice List (fulltest mode)

---

### 3.3. Part Selection Modal

**File**: `/components/PartSelectionModal.tsx`

#### Tên màn hình
**Part Selection Modal**

#### Mục đích
Chọn phần cụ thể để luyện (khi chọn Part Practice)

#### Các thành phần UI

**Modal Header**:
- Back button (← to Mode Selection)
- Title: "Chọn phần luyện tập"
- Subtitle: "Reading Practice"

**Part Checkboxes** (example cho Reading):

**Part 1 Checkbox**:
- [ ] Part 1: Điền từ vào chỗ trống
- Details: "10 câu • ~15 phút • Cơ bản"
- Icon: Check when selected

**Part 2 Checkbox**:
- [ ] Part 2: Đọc đoạn văn ngắn
- Details: "10 câu • ~20 phút • Trung bình"

**Part 3 Checkbox**:
- [ ] Part 3: Đọc đoạn văn dài
- Details: "20 câu • ~25 phút • Nâng cao"

**Summary**:
- Display when parts selected:
  - "Đã chọn: X phần"
  - "Tổng câu hỏi: Y"
  - "Thời gian ước tính: Z phút"

**Footer**:
- Button: "Hủy" (secondary)
- Button: "Tiếp tục" (primary, disabled khi chưa chọn part)

#### Chức năng

1. Display part options with checkboxes
2. Multiple selection allowed
3. Update summary real-time
4. Click "Tiếp tục" → Navigate to Practice List with selected parts

---

### 3.4. Practice List

**File**: `/components/PracticeList.tsx`

#### Tên màn hình
**Practice List / Danh sách bài tập**

#### Mục đích
Hiển thị danh sách bài tập có sẵn để chọn

#### Các thành phần UI

**Header**:
- Breadcrumb: "Luyện tập > Reading > Full Test"
- Title: "Chọn bài tập"
- Subtitle: "Reading Full Test"

**Filters Bar**:
- **Level Filter**: Dropdown
  - All levels
  - A2
  - B1
  - B2
  - C1

- **Status Filter**: Dropdown
  - All
  - Not started
  - In progress
  - Completed

- **Sort**: Dropdown
  - Newest first
  - Oldest first
  - Easy to Hard
  - Hard to Easy

- **Search**: Input box
  - Icon: Search
  - Placeholder: "Tìm bài tập..."

**Exercise Cards Grid** (2 columns):

Each card:
- **Header**:
  - Title: "Reading Full Test - Đề số 1"
  - Level badge: "B2" (colored)
  - Difficulty badge: "Medium" (yellow)

- **Content**:
  - Description (if any)
  - Stats:
    - 📝 40 questions
    - ⏱️ 60 minutes
    - 📊 Average score: 7.5/10

- **Status Indicator**:
  - Not started: Gray
  - In progress: Blue + "Đang làm dở"
  - Completed: Green + "Điểm: X/10"

- **Footer**:
  - Button:
    - Not started: "Bắt đầu" (primary)
    - In progress: "Tiếp tục" (blue)
    - Completed: "Làm lại" (secondary) + "Xem kết quả" (link)

**Empty State**:
- Icon: FileX
- Title: "Không tìm thấy bài tập"
- Message: "Thử thay đổi bộ lọc hoặc tìm kiếm"

**Pagination**:
- Show: "Showing 1-20 of 50"
- Buttons: Previous | 1 2 3 ... 5 | Next

#### Chức năng

1. **Load Exercises**:
   - Fetch based on skill + mode + parts
   - Apply filters and sort
   - Paginate results

2. **Filter & Sort**:
   - Real-time update on change
   - No page reload

3. **Search**:
   - Debounced search (500ms)
   - Search in title and description

4. **Status Tracking**:
   - Check if user has started/completed
   - Show appropriate button and status

5. **Start Exercise**:
   - Click "Bắt đầu" → Navigate to Exercise Interface
   - Click "Tiếp tục" → Restore saved progress
   - Click "Làm lại" → Confirm → Start fresh

#### Luồng xử lý

```
User arrives at Practice List
  ↓
Load exercises based on:
  - Skill: reading
  - Mode: fulltest
  - Parts: all (if fulltest) or selected parts
  ↓
Display exercises as cards
  ↓
User filters/sorts/searches
  ↓
Update display (client-side or API call)
  ↓
User clicks "Bắt đầu" on an exercise
  ↓
Navigate to Exercise Interface với exercise_id
```

---

### 3.5. Reading Exercise Interface

**File**: `/components/reading/ReadingExercise.tsx`

#### Tên màn hình
**Reading Exercise Interface**

#### Mục đích
Giao diện làm bài đọc hiểu

#### Các thành phần UI

**Top Bar**:
- Left:
  - Back button (← Exit - with confirm)
  - Exercise title: "Reading Full Test - Đề số 1"
  
- Center:
  - Timer: "45:30" (countdown)
  - Warning icon khi < 5 phút (red)
  
- Right:
  - Auto-save indicator: "Đã lưu lúc 10:30"
  - Submit button: "Nộp bài" (always visible)

**Main Content** (2-column layout):

**Left Column: Passage** (40% width):
- Header:
  - Part indicator: "Part 1 of 3"
  - Passage title (if any)
  
- Content:
  - Scrollable text
  - Line numbers (optional)
  - Highlight tool (select text → highlight)
  
- Zoom controls:
  - A- | A | A+ (font size)

**Right Column: Questions** (60% width):
- Question Card:
  - Question number: "Question 1 of 40"
  - Question text
  - Options (A/B/C/D):
    - Radio buttons
    - Large click area
    - Keyboard support (1-4)
  - Bookmark icon (star)
  - Note icon (add note)
  
- Navigation:
  - Previous button
  - Next button
  - Question number navigator (bottom)

**Question Navigator** (sticky bottom):
- Grid of question numbers (1-40)
- Visual states:
  - Not answered: White
  - Answered: Blue
  - Current: Blue border
  - Bookmarked: Yellow star
- Click number → Jump to question

**Submit Confirmation Modal**:
- Title: "Nộp bài?"
- Message: "Bạn đã trả lời X/40 câu. Bạn có chắc muốn nộp bài?"
- Warning: "Y câu chưa trả lời"
- Buttons:
  - "Quay lại" (secondary)
  - "Nộp bài" (primary, red)

#### Chức năng

1. **Load Exercise**:
   - Fetch exercise data (passages, questions, answers)
   - Check if has saved progress
   - Restore or start fresh

2. **Timer**:
   - Start countdown from time limit
   - Update every second
   - Warning at 5 minutes
   - Auto-submit at 0:00

3. **Answer Question**:
   - Click option → Select
   - Update local state
   - Visual feedback (blue highlight)
   - Update question navigator

4. **Navigate Questions**:
   - Click Previous/Next
   - Click question number in navigator
   - Keyboard arrows (← →)

5. **Auto-save**:
   - Save to localStorage every 10 seconds
   - Save to server every 30 seconds (if online)
   - Show save indicator

6. **Bookmark**:
   - Click star icon
   - Mark question in navigator (yellow)
   - Save to user profile

7. **Submit**:
   - Click "Nộp bài"
   - Validate: Confirm if unanswered questions
   - Stop timer
   - Save final answers
   - Call grading API
   - Navigate to Result Page

#### Luồng xử lý

```
User starts Reading exercise
  ↓
Load exercise data from API
  ↓
Check if has saved progress:
  ├─ Yes → Restore answers + timer position
  └─ No → Start fresh with full time
  ↓
Display passage + first question
  ↓
Start timer (if enabled)
  ↓
[User reads passage]
  ↓
[User answers questions]
  ├─ Click option → Select
  ├─ Click Next → Move to next question
  ├─ Auto-save every 10s
  └─ Bookmark difficult questions
  ↓
[User clicks "Nộp bài"]
  ↓
Check answered questions:
  ├─ All answered → Direct submit
  └─ Some unanswered → Show confirmation modal
      ├─ "Quay lại" → Stay in exercise
      └─ "Nộp bài" → Continue
  ↓
Stop timer
  ↓
POST /api/exercises/{id}/submit
  ↓
Backend:
  ├─ Save submission
  ├─ Calculate score (auto-grading)
  └─ Return result_id
  ↓
Navigate to Result Page với result_id
```

---

### 3.6. Writing Exercise Interface

**File**: `/components/writing/WritingExercise.tsx`

#### Tên màn hình
**Writing Exercise Interface**

#### Mục đích
Giao diện làm bài viết

#### Các thành phần UI

**Top Bar**: (Same as Reading)

**Main Content**:

**Task Tabs**:
- Tab 1: "Task 1" (active by default)
- Tab 2: "Task 2"

**Task 1 View**:

**Left Panel: Task Instructions** (30%):
- Task type: "Email/Letter Writing"
- Time limit: "20 minutes"
- Word count requirement: "At least 120 words"
- Task prompt (scrollable):
  ```
  You received an email from your English friend...
  Write a reply to your friend. In your email:
  - Answer their questions
  - Ask for more information
  - Suggest meeting time
  ```

**Right Panel: Editor** (70%):
- Rich text editor:
  - Bold, Italic, Underline
  - Lists (bullet, numbered)
  - Undo/Redo
  - Spell check (optional)
  
- Word counter (live):
  - "Current: 45 words"
  - Color: Red if < 120, Green if ≥ 120
  
- Save draft button

**Task 2 View**: (Same structure)
- Task type: "Essay Writing"
- Time limit: "40 minutes"
- Word count: "At least 250 words"
- Task prompt:
  ```
  Some people think that...
  Discuss both views and give your opinion.
  ```

**Progress Indicator** (sticky):
- Task 1: 20 min | 120+ words | Status: Complete ✓
- Task 2: 40 min | 250+ words | Status: In progress
- Total time: 60 minutes

**Submit Requirements Check**:
- Before submit, validate:
  - Task 1: ≥ 120 words ✓
  - Task 2: ≥ 250 words ✗ (150 words)
  - Warning: "Task 2 chưa đủ số từ tối thiểu"

#### Chức năng

1. **Timer per Task**:
   - Task 1: 20 minutes
   - Task 2: 40 minutes
   - Can switch between tasks freely
   - Total timer: 60 minutes

2. **Word Counter**:
   - Live count as user types
   - Highlight min requirement
   - Warning if under

3. **Auto-save**:
   - Save to localStorage every 10s
   - Save to server every 30s
   - Draft recovery on reload

4. **Switch Tasks**:
   - Click tab to switch
   - Progress saved for both tasks
   - Can work on either task in any order

5. **Submit**:
   - Validate word counts
   - Warn if under minimum
   - Can submit anyway (with penalty)
   - Upload to server
   - Send to AI grading
   - Navigate to Result Page (with loading state)

---

### 3.7. Speaking Exercise Interface

**File**: `/components/speaking/SpeakingExercise.tsx`

#### Tên màn hình
**Speaking Exercise Interface**

#### Mục đích
Giao diện làm bài nói

#### Các thành phần UI

**Pre-start: Microphone Test**:
- Title: "Kiểm tra microphone"
- Audio level meter (visual bars)
- Button: "Test recording"
- Playback test
- Button: "Bắt đầu bài thi" (when ready)

**Part 1: Interview** (3 minutes):

**Question Display**:
- Part indicator: "Part 1: Interview (Question 1 of 3)"
- Question text (large font):
  ```
  Tell me about yourself.
  Where are you from?
  What do you do?
  ```
- Timer: "2:45" remaining

**Recording Controls**:
- Audio level meter (real-time)
- Button: "Bắt đầu trả lời" (Start recording)
- Button: "Dừng lại" (Stop recording)
- Status: "Đang ghi âm..." (red dot)

**After Recording**:
- "Recording saved ✓"
- Playback button: "Nghe lại"
- Button: "Next question"

**Part 2: Long Turn** (3 minutes total):

**Preparation Phase** (1 minute):
- Title: "Preparation Time: 1:00"
- Topic card:
  ```
  Describe a place you like to visit.
  You should say:
  - Where it is
  - When you go there
  - What you do there
  - Why you like it
  ```
- Note-taking area (optional)
- Countdown: "0:45" remaining

**Recording Phase** (2 minutes):
- Title: "Speaking Time: 2:00"
- Topic card (still visible)
- Recording controls (auto-start)
- Cannot pause/stop (must record full 2 min)

**Part 3: Discussion** (4 minutes):
- Follow-up questions about Part 2 topic
- Multiple questions
- Record answer for each
- Can move between questions

**Submit**:
- Upload all recordings
- Processing: "Đang tải lên... X/Y files"
- Send to AI grading
- Navigate to Result Page

#### Chức năng

1. **Microphone Test**:
   - Request mic permission
   - Test audio input
   - Show audio level
   - Test playback

2. **Recording**:
   - High quality audio (WAV/MP3)
   - Real-time level meter
   - Auto-save recordings
   - Upload to server

3. **Timer Control**:
   - Part 1: 3 min total (flexible per question)
   - Part 2: 1 min prep + 2 min speak (strict)
   - Part 3: 4 min total (flexible)

4. **Prevent Cheating**:
   - Cannot replay previous parts
   - Cannot re-record Part 2
   - Timer strictly enforced

5. **Upload**:
   - Compress audio files
   - Upload to file storage (S3)
   - Save file URLs to database
   - Send to AI grading queue

---

### 3.8. Result Page (Reading/Listening)

**File**: `/components/reading/ReadingResult.tsx`

#### Tên màn hình
**Reading Result Page**

#### Mục đích
Hiển thị kết quả và review bài làm

#### Các thành phần UI

**Score Summary Card**:
- **Circle Progress** (center):
  - Score: "8.0/10"
  - Percentage: "85%"
  - Color: Green (good), Yellow (medium), Red (poor)
  
- **Stats**:
  - Correct: 34/40
  - Time taken: 45:30 / 60:00
  - Completion: 100%

- **Band Score Equivalent**:
  - "Tương đương VSTEP Band: 8.0"

**Performance Breakdown**:
- Chart: Bar chart by part
  - Part 1: 9/10 (90%)
  - Part 2: 8/10 (80%)
  - Part 3: 17/20 (85%)

- Analysis:
  - Strengths: "Part 1 - Điền từ vào chỗ trống"
  - Weaknesses: "Part 2 - Đọc đoạn văn ngắn"

**Answer Review**:

**Filter Tabs**:
- All questions (40)
- Correct (34) ✓
- Incorrect (6) ✗

**Question Cards** (list):

Each card:
- Question number + status icon (✓ or ✗)
- Question text
- Passage excerpt (if relevant)
- Options (A/B/C/D):
  - Your answer: Highlighted (green if correct, red if wrong)
  - Correct answer: Highlighted green (if wrong)
- Explanation:
  - "Đáp án đúng là C vì..."
  - Detailed explanation
  - Reference to passage

**Actions Footer**:
- Button: "Lưu kết quả" (Save to history)
- Button: "Làm lại" (Redo exercise)
- Button: "Luyện tương tự" (Practice similar level)
- Button: "Về danh sách" (Back to Practice List)

#### Chức năng

1. **Display Score**:
   - Calculate from submission
   - Show percentage and band score
   - Visual progress circle

2. **Breakdown Analysis**:
   - Score by part
   - Identify strengths/weaknesses
   - Chart visualization

3. **Answer Review**:
   - Show all questions with answers
   - Filter correct/incorrect
   - Detailed explanations
   - Highlight correct/wrong answers

4. **Actions**:
   - Save result to history
   - Redo exercise (confirm)
   - Find similar exercises
   - Navigate back

---

### 3.9. Result Page (Writing/Speaking with AI)

**File**: `/components/writing/WritingResult.tsx`

#### Tên màn hình
**Writing Result Page (AI Grading)**

#### Mục đích
Hiển thị kết quả chấm AI cho Writing/Speaking

#### Các thành phần UI

**Loading State** (while AI grading):
- Animation: Spinner or progress bar
- Text: "Đang chấm bài bằng AI..."
- Sub-text: "Quá trình này có thể mất 30-60 giây"
- Progress: "Đang phân tích Task 1... (50%)"

**Score Summary Card** (after grading):
- **Overall Band Score**: "7.5/10"
- **Circle Progress**: Visual score

**Criteria Scores** (4 criteria for Writing):

1. **Task Achievement** (Task Response):
   - Score: 7.5/10
   - Progress bar (75%)
   - Short description: "Good task response"

2. **Coherence and Cohesion**:
   - Score: 8.0/10
   - Progress bar (80%)

3. **Lexical Resource**:
   - Score: 7.0/10
   - Progress bar (70%)

4. **Grammatical Range and Accuracy**:
   - Score: 7.5/10
   - Progress bar (75%)

**AI Feedback Sections**:

**Overall Feedback**:
- Summary paragraph
- General comments
- Overall impression

**Strengths** (✓ green):
- "Good use of paragraphing and structure"
- "Wide range of vocabulary related to the topic"
- "Clear arguments with supporting examples"

**Weaknesses** (✗ red):
- "Some grammatical errors with complex sentences"
- "Limited use of cohesive devices"
- "Conclusion could be stronger"

**Detailed Feedback by Task**:

**Task 1**:
- Your writing (with highlights):
  - Grammar errors: Red underline
  - Vocabulary suggestions: Blue underline
  - Structure issues: Yellow highlight
  
- Specific feedback:
  - "Opening paragraph is clear and well-structured"
  - "Body paragraphs need better linking"
  - "Consider using more formal language"

- Suggestions:
  - Instead of "very good" → "excellent" or "outstanding"
  - Instead of "I think" → "In my opinion" or "It seems that"

**Sample Essay** (same score range):
- Title: "Sample Essay - Band 7.5"
- Full essay text
- Annotations highlighting good practices

**Actions**:
- Download result (PDF)
- Save to history
- Redo exercise
- Practice similar

#### Chức năng

1. **AI Grading**:
   - Submit to AI API (OpenAI/Custom)
   - Poll for results every 5 seconds
   - Show loading state
   - Display results when ready

2. **Highlight Errors**:
   - Parse AI response
   - Highlight text with issues
   - Show tooltips on hover

3. **Show Feedback**:
   - Overall score
   - Criteria breakdown
   - Strengths/Weaknesses
   - Specific suggestions

4. **Sample Essays**:
   - Fetch samples in same score range
   - Display for comparison
   - Highlight good practices

---

## 4. User Flow Diagrams

### 4.1. Complete Practice Flow (Reading Example)

```
[Start] Student wants to practice Reading
  ↓
Navigate to Practice Home
  ↓
Click "Reading" card
  ↓
Navigate to Reading Practice page
  ↓
Show Mode Selection Modal
  ↓
Student chooses mode:
  │
  ├─ Part Practice:
  │   ├─ Show Part Selection Modal
  │   ├─ Student selects parts (e.g., Part 1 + Part 2)
  │   ├─ Click "Tiếp tục"
  │   └─ Navigate to Practice List với parts=[1,2]
  │
  └─ Full Test:
      └─ Navigate to Practice List với mode=fulltest
  ↓
Practice List Page
  ↓
Display exercises based on selection
  ↓
Student filters/sorts/searches
  ↓
Student clicks "Bắt đầu" on an exercise
  ↓
Navigate to Reading Exercise Interface
  ↓
Load exercise data
  ↓
Check saved progress:
  ├─ Has progress → Restore answers + timer
  └─ No progress → Start fresh
  ↓
Display passage + questions
  ↓
Start timer (if enabled)
  ↓
[Student reads and answers questions]
  ├─ Read passage
  ├─ Answer questions (click options)
  ├─ Navigate between questions
  ├─ Bookmark difficult questions
  └─ Auto-save every 10 seconds
  ↓
[Student clicks "Nộp bài"]
  ↓
Show confirmation modal
  ↓
Student confirms
  ↓
Submit answers to API
  ↓
Backend:
  ├─ Save submission
  ├─ Auto-grade (compare with correct answers)
  ├─ Calculate score
  └─ Return result_id
  ↓
Navigate to Result Page
  ↓
Display score + review
  ↓
[Student reviews answers]
  ├─ View score summary
  ├─ Check performance breakdown
  ├─ Review each question
  └─ Read explanations
  ↓
[Student chooses next action]
  ├─ "Làm lại" → Redo exercise
  ├─ "Luyện tương tự" → Find similar
  └─ "Về danh sách" → Back to list
  ↓
[End] Practice session complete
```

### 4.2. Writing Practice with AI Grading Flow

```
[Start] Student practices Writing
  ↓
... (same as Reading until Exercise Interface)
  ↓
Writing Exercise Interface
  ↓
Display Task 1 + Task 2 tabs
  ↓
Start timer (60 minutes total)
  ↓
[Student works on Task 1]
  ├─ Read task prompt
  ├─ Write in text editor
  ├─ Word counter updates live
  ├─ Auto-save every 10s
  └─ Switch to Task 2 when ready
  ↓
[Student works on Task 2]
  ├─ Same process as Task 1
  └─ Can switch back to Task 1 anytime
  ↓
[Student clicks "Nộp bài"]
  ↓
Validate word counts:
  ├─ Task 1: ≥ 120 words? → Yes ✓
  └─ Task 2: ≥ 250 words? → No (200 words)
      └─ Show warning: "Task 2 chưa đủ 250 từ"
  ↓
Student confirms submit anyway
  ↓
Submit to API
  ↓
Backend:
  ├─ Save submission
  ├─ Queue for AI grading
  └─ Return submission_id
  ↓
Navigate to Result Page
  ↓
Show loading state: "Đang chấm bài bằng AI..."
  ↓
Poll API every 5 seconds
  ↓
[AI Grading Process]
  ├─ Send to OpenAI API
  ├─ Analyze Task 1
  ├─ Analyze Task 2
  ├─ Calculate scores for 4 criteria
  ├─ Generate feedback
  └─ Mark as ready
  ↓
Frontend detects ready
  ↓
Fetch AI result
  ↓
Display:
  ├─ Overall band score
  ├─ Criteria scores (4 bars)
  ├─ Strengths/Weaknesses
  ├─ Detailed feedback per task
  ├─ Highlighted errors in text
  └─ Sample essays
  ↓
[Student reviews feedback]
  ├─ Read overall feedback
  ├─ Check criteria scores
  ├─ Review highlighted errors
  └─ Compare with sample essays
  ↓
[Student chooses action]
  ├─ Save result
  ├─ Download PDF
  └─ Practice again
  ↓
[End] Writing practice complete with AI feedback
```

---

## 5. Sequence Diagrams

### 5.1. Submit Exercise Sequence (Reading/Listening)

```
Student      Frontend      API Server     Database      Grading Engine
  |              |              |              |                |
  |--Fill answers>              |              |                |
  |              |              |              |                |
  |--Click Submit>              |              |                |
  |              |              |              |                |
  |              |--Confirm---->|              |                |
  |              |  modal       |              |                |
  |              |              |              |                |
  |<--Confirm----|              |              |                |
  |              |              |              |                |
  |              |--POST /submit>             |                |
  |              |              |              |                |
  |              |              |--Save submission------------->|
  |              |              |              |                |
  |              |              |<--Submission saved            |
  |              |              |              |                |
  |              |              |--Grade------>|                |
  |              |              |(compare answers)              |
  |              |              |              |                |
  |              |              |<--Scores-----|                |
  |              |              |              |                |
  |              |              |--Update submission---------->|
  |              |              |(save scores) |                |
  |              |              |              |                |
  |              |              |--Update user stats---------->|
  |              |              |              |                |
  |              |              |--Check badges--------------->|
  |              |              |(unlock if achieved)          |
  |              |              |              |                |
  |              |<--200 OK-----|              |                |
  |              | + result_id  |              |                |
  |              |              |              |                |
  |<--Navigate---|              |              |                |
  |   to Result  |              |              |                |
  |              |              |              |                |
  |              |--GET /result/{id}---------->|                |
  |              |              |              |                |
  |              |              |<--Result data-                |
  |              |              |              |                |
  |              |<--200 OK-----|              |                |
  |              | + full result|              |                |
  |              |              |              |                |
  |<--Display----|              |              |                |
  |   result     |              |              |                |
  |              |              |              |                |
```

### 5.2. AI Grading Sequence (Writing/Speaking)

```
Student    Frontend    API Server    Database    AI Service    Queue
  |           |            |             |             |           |
  |--Submit-->|            |             |             |           |
  |  writing  |            |             |             |           |
  |           |            |             |             |           |
  |           |--POST /submit            |             |           |
  |           |            |             |             |           |
  |           |            |--Save submission-------->  |           |
  |           |            |             |             |           |
  |           |            |<--Submission saved        |           |
  |           |            |             |             |           |
  |           |            |--Queue for AI grading---->|---------->|
  |           |            |             |             |           |
  |           |            |             |             |           | Add to queue
  |           |            |             |             |           |
  |           |<--202 Accepted           |             |           |
  |           | submission_id            |             |           |
  |           | status: pending          |             |           |
  |           |            |             |             |           |
  |<--Navigate|            |             |             |           |
  |  to Result|            |             |             |           |
  |           |            |             |             |           |
  |<--Show----|            |             |             |           |
  |  loading  |            |             |             |           |
  |           |            |             |             |           |
  |           |            |             |             |<----------|
  |           |            |             |             | Process job
  |           |            |             |             |           |
  |           |            |             |             |--Call OpenAI API
  |           |            |             |             |           |
  |           |            |             |             |<--AI Response
  |           |            |             |             |(scores + feedback)
  |           |            |             |             |           |
  |           |            |             |<------------|           |
  |           |            |             | Save AI result          |
  |           |            |             |             |           |
  |           |            |             |------------>|           |
  |           |            |             | Update submission       |
  |           |            |             | status: graded          |
  |           |            |             |             |           |
  |           |--Poll: GET /result/{id}->|             |           |
  |           | (every 5s) |             |             |           |
  |           |            |             |             |           |
  |           |            |<--Status: pending         |           |
  |           |            |             |             |           |
  |           |<--Pending--|             |             |           |
  |           |            |             |             |           |
  |           |--Poll again|             |             |           |
  |           |            |             |             |           |
  |           |            |<--Status: graded          |           |
  |           |            | + AI feedback|             |           |
  |           |            |             |             |           |
  |           |<--200 OK---|             |             |           |
  |           | + full result            |             |           |
  |           |            |             |             |           |
  |<--Display-|            |             |             |           |
  |  AI result|            |             |             |           |
  |           |            |             |             |           |
```

---

## 6. Database Design

### 6.1. Table: exercises

**Mô tả**: Lưu thông tin bài tập

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  skill VARCHAR(20) NOT NULL,
    -- 'reading' | 'listening' | 'writing' | 'speaking'
  type VARCHAR(20) NOT NULL,
    -- 'part' | 'fulltest'
  level VARCHAR(10) NOT NULL,
    -- 'A2' | 'B1' | 'B2' | 'C1'
  difficulty VARCHAR(20),
    -- 'easy' | 'medium' | 'hard'
  
  -- Structure
  parts INTEGER[],
    -- [1, 2, 3] - which parts included
  total_questions INTEGER NOT NULL,
  time_limit INTEGER,
    -- Minutes
  
  -- Content (JSONB for flexibility)
  content JSONB NOT NULL,
    -- Reading: passages + questions
    -- Listening: audio_urls + questions
    -- Writing: tasks
    -- Speaking: prompts
  
  -- Answers (for auto-grading)
  answer_key JSONB,
    -- Reading/Listening: correct answers
    -- Writing/Speaking: rubric
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  
  -- Stats
  total_attempts INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_exercises_skill ON exercises(skill);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercises_level ON exercises(level);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_is_active ON exercises(is_active);
CREATE INDEX idx_exercises_created_at ON exercises(created_at DESC);
```

**Example content JSONB**:

**Reading**:
```json
{
  "parts": [
    {
      "partNumber": 1,
      "type": "gap-fill",
      "passage": "Text with [1], [2], [3] gaps...",
      "questions": [
        {
          "questionNumber": 1,
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "B"
        }
      ]
    }
  ]
}
```

**Listening**:
```json
{
  "parts": [
    {
      "partNumber": 1,
      "audioUrl": "https://cdn.../audio1.mp3",
      "transcript": "Full transcript...",
      "questions": [
        {
          "questionNumber": 1,
          "questionText": "What is the man's problem?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "C"
        }
      ]
    }
  ]
}
```

**Writing**:
```json
{
  "tasks": [
    {
      "taskNumber": 1,
      "type": "email",
      "prompt": "Write an email to...",
      "minWords": 120,
      "timeLimit": 20
    },
    {
      "taskNumber": 2,
      "type": "essay",
      "prompt": "Some people think...",
      "minWords": 250,
      "timeLimit": 40
    }
  ]
}
```

**Speaking**:
```json
{
  "parts": [
    {
      "partNumber": 1,
      "type": "interview",
      "questions": [
        "Tell me about yourself.",
        "What do you do?"
      ],
      "timeLimit": 3
    },
    {
      "partNumber": 2,
      "type": "long-turn",
      "topic": "Describe a place...",
      "points": ["Where", "When", "What", "Why"],
      "prepTime": 1,
      "speakTime": 2
    }
  ]
}
```

---

### 6.2. Table: exercise_submissions

**Mô tả**: Lưu bài làm của học viên

```sql
CREATE TABLE exercise_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Submission data
  answers JSONB NOT NULL,
    -- User's answers
  status VARCHAR(20) DEFAULT 'in_progress',
    -- 'in_progress' | 'submitted' | 'graded'
  
  -- Timing
  started_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  time_taken INTEGER,
    -- Seconds
  
  -- Scoring (for Reading/Listening)
  score DECIMAL(5,2),
    -- 0-10 scale
  percentage DECIMAL(5,2),
    -- 0-100
  correct_count INTEGER,
  total_questions INTEGER,
  
  -- AI Grading (for Writing/Speaking)
  ai_grading_status VARCHAR(20),
    -- 'pending' | 'processing' | 'completed' | 'failed'
  ai_scores JSONB,
    -- Criteria scores
  ai_feedback JSONB,
    -- Detailed feedback
  ai_graded_at TIMESTAMP,
  
  -- Review data
  bookmarked_questions INTEGER[],
  notes JSONB,
    -- { questionId: "note text" }
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_submissions_exercise_id ON exercise_submissions(exercise_id);
CREATE INDEX idx_submissions_user_id ON exercise_submissions(user_id);
CREATE INDEX idx_submissions_status ON exercise_submissions(status);
CREATE INDEX idx_submissions_submitted_at ON exercise_submissions(submitted_at DESC);
CREATE INDEX idx_submissions_ai_status ON exercise_submissions(ai_grading_status);
```

**Example answers JSONB**:

**Reading/Listening**:
```json
{
  "1": "B",
  "2": "A",
  "3": "C",
  ...
  "40": "D"
}
```

**Writing**:
```json
{
  "task1": "Dear John,\nThank you for your email...",
  "task2": "Education is one of the most important..."
}
```

**Speaking**:
```json
{
  "part1": {
    "question1": {
      "audioUrl": "https://cdn.../recording1.mp3",
      "duration": 45
    }
  },
  "part2": {
    "audioUrl": "https://cdn.../recording2.mp3",
    "duration": 120
  }
}
```

**Example ai_scores JSONB (Writing)**:
```json
{
  "overall": 7.5,
  "taskAchievement": 7.5,
  "coherenceCohesion": 8.0,
  "lexicalResource": 7.0,
  "grammaticalAccuracy": 7.5
}
```

**Example ai_feedback JSONB**:
```json
{
  "overall": "Good essay with clear arguments...",
  "strengths": [
    "Good use of paragraphing",
    "Wide range of vocabulary"
  ],
  "weaknesses": [
    "Some grammatical errors",
    "Limited cohesive devices"
  ],
  "task1Feedback": "...",
  "task2Feedback": "...",
  "suggestions": [
    {
      "type": "grammar",
      "position": 123,
      "original": "very good",
      "suggestion": "excellent"
    }
  ]
}
```

---

### 6.3. Table: user_practice_stats

**Mô tả**: Lưu thống kê luyện tập của user

```sql
CREATE TABLE user_practice_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill VARCHAR(20) NOT NULL,
    -- 'reading' | 'listening' | 'writing' | 'speaking'
  
  -- Counts
  total_exercises INTEGER DEFAULT 0,
  completed_exercises INTEGER DEFAULT 0,
  in_progress_exercises INTEGER DEFAULT 0,
  
  -- Scores
  average_score DECIMAL(5,2),
  highest_score DECIMAL(5,2),
  lowest_score DECIMAL(5,2),
  
  -- Time
  total_practice_time INTEGER DEFAULT 0,
    -- Seconds
  
  -- Level progression
  current_level VARCHAR(10),
    -- Estimated level based on performance
  
  -- Last activity
  last_practiced_at TIMESTAMP,
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, skill)
);

-- Indexes
CREATE INDEX idx_practice_stats_user_id ON user_practice_stats(user_id);
CREATE INDEX idx_practice_stats_skill ON user_practice_stats(skill);
```

---

### 6.4. Table: question_bookmarks

**Mô tả**: Lưu câu hỏi được bookmark

```sql
CREATE TABLE question_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  skill VARCHAR(20) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, exercise_id, question_number)
);

-- Indexes
CREATE INDEX idx_bookmarks_user_id ON question_bookmarks(user_id);
CREATE INDEX idx_bookmarks_skill ON question_bookmarks(skill);
```

---

## 7. API Endpoints

### 7.1. GET /api/exercises

**Mô tả**: Lấy danh sách bài tập

**Request**:
```typescript
GET /api/exercises?skill=reading&type=fulltest&level=B2&page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters**:
- `skill`: Required ('reading'|'listening'|'writing'|'speaking')
- `type`: Optional ('part'|'fulltest')
- `parts`: Optional (comma-separated, e.g., "1,2")
- `level`: Optional ('A2'|'B1'|'B2'|'C1')
- `difficulty`: Optional ('easy'|'medium'|'hard')
- `status`: Optional ('not_started'|'in_progress'|'completed')
- `sort`: Optional ('newest'|'oldest'|'easy_hard'|'hard_easy')
- `search`: Optional (search in title)
- `page`: Optional (default: 1)
- `limit`: Optional (default: 20, max: 100)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "exercises": [
      {
        "id": "uuid",
        "title": "Reading Full Test - Đề số 1",
        "description": "Bài thi thử Reading đầy đủ theo chuẩn VSTEP",
        "skill": "reading",
        "type": "fulltest",
        "level": "B2",
        "difficulty": "medium",
        "parts": [1, 2, 3],
        "totalQuestions": 40,
        "timeLimit": 60,
        "userStatus": {
          "status": "completed",
          "lastAttempt": {
            "submissionId": "uuid",
            "score": 8.5,
            "submittedAt": "2024-12-14T10:30:00Z"
          }
        },
        "stats": {
          "totalAttempts": 1234,
          "averageScore": 7.2
        }
      }
      // ... more exercises
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

---

### 7.2. GET /api/exercises/:id

**Mô tả**: Lấy chi tiết bài tập

**Request**:
```typescript
GET /api/exercises/uuid-exercise-id
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "exercise": {
      "id": "uuid",
      "title": "Reading Full Test - Đề số 1",
      "skill": "reading",
      "type": "fulltest",
      "level": "B2",
      "parts": [1, 2, 3],
      "totalQuestions": 40,
      "timeLimit": 60,
      "content": {
        "parts": [
          {
            "partNumber": 1,
            "type": "gap-fill",
            "passage": "Full passage text...",
            "questions": [
              {
                "questionNumber": 1,
                "questionText": "Question 1?",
                "options": ["A", "B", "C", "D"]
              }
              // ... more questions
            ]
          }
          // ... more parts
        ]
      },
      "userProgress": {
        "hasProgress": true,
        "submissionId": "uuid",
        "status": "in_progress",
        "answers": {"1": "B", "2": "A"},
        "timeRemaining": 3245,
        "startedAt": "2024-12-15T09:00:00Z"
      }
    }
  }
}
```

**Notes**:
- `content` includes full exercise data
- `answer_key` is NOT returned (only after submission)
- `userProgress` shows if user has in-progress submission

---

### 7.3. POST /api/exercises/:id/start

**Mô tả**: Bắt đầu làm bài tập (tạo submission)

**Request**:
```typescript
POST /api/exercises/uuid-exercise-id/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "timerEnabled": true
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "submissionId": "uuid",
    "exerciseId": "uuid",
    "status": "in_progress",
    "startedAt": "2024-12-15T10:00:00Z",
    "timeRemaining": 3600
  }
}
```

**Business Logic**:
1. Check if user already has in-progress submission
   - Yes: Return existing submission
   - No: Create new submission
2. Set status = 'in_progress'
3. Set started_at = NOW()
4. Return submission_id

---

### 7.4. PUT /api/submissions/:id/save

**Mô tả**: Lưu tiến trình (auto-save)

**Request**:
```typescript
PUT /api/submissions/uuid-submission-id/save
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": {
    "1": "B",
    "2": "A",
    "3": "C"
  },
  "bookmarkedQuestions": [5, 12, 18],
  "notes": {
    "5": "Difficult question about main idea"
  },
  "timeRemaining": 3245
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Progress saved",
  "savedAt": "2024-12-15T10:05:30Z"
}
```

**Business Logic**:
1. Validate submission belongs to user
2. Update answers (merge with existing)
3. Update bookmarks and notes
4. Update time_remaining
5. Set updated_at = NOW()
6. Return success

---

### 7.5. POST /api/submissions/:id/submit

**Mô tả**: Nộp bài (final submit)

**Request**:
```typescript
POST /api/submissions/uuid-submission-id/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": {
    "1": "B",
    "2": "A",
    ...
    "40": "D"
  },
  "timeTaken": 3245
}
```

**Response** (200 - for Reading/Listening):
```json
{
  "success": true,
  "message": "Bài tập đã được nộp thành công",
  "data": {
    "submissionId": "uuid",
    "status": "graded",
    "score": 8.5,
    "percentage": 85.0,
    "correctCount": 34,
    "totalQuestions": 40,
    "timeTaken": 3245,
    "submittedAt": "2024-12-15T10:54:05Z"
  }
}
```

**Response** (202 - for Writing/Speaking):
```json
{
  "success": true,
  "message": "Bài tập đã được nộp. Đang chờ chấm AI.",
  "data": {
    "submissionId": "uuid",
    "status": "submitted",
    "aiGradingStatus": "pending",
    "submittedAt": "2024-12-15T10:54:05Z",
    "estimatedGradingTime": "30-60 seconds"
  }
}
```

**Business Logic**:
1. Validate submission belongs to user
2. Check status is 'in_progress'
3. Update answers (final)
4. Set status = 'submitted'
5. Set submitted_at = NOW()
6. Calculate time_taken
7. **For Reading/Listening**:
   - Auto-grade immediately
   - Compare answers with answer_key
   - Calculate score
   - Set status = 'graded'
   - Return scores
8. **For Writing/Speaking**:
   - Queue for AI grading
   - Set ai_grading_status = 'pending'
   - Return 202 Accepted
   - Process AI grading async
9. Update user_practice_stats
10. Check and unlock badges

---

### 7.6. GET /api/submissions/:id/result

**Mô tả**: Lấy kết quả bài làm

**Request**:
```typescript
GET /api/submissions/uuid-submission-id/result
Authorization: Bearer {token}
```

**Response** (200 - Reading/Listening):
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "exerciseId": "uuid",
      "exerciseTitle": "Reading Full Test - Đề số 1",
      "skill": "reading",
      "status": "graded",
      "score": 8.5,
      "percentage": 85.0,
      "correctCount": 34,
      "totalQuestions": 40,
      "timeTaken": 3245,
      "submittedAt": "2024-12-15T10:54:05Z"
    },
    "breakdown": {
      "byPart": [
        {
          "partNumber": 1,
          "score": 9.0,
          "correctCount": 9,
          "totalQuestions": 10
        },
        {
          "partNumber": 2,
          "score": 8.0,
          "correctCount": 8,
          "totalQuestions": 10
        },
        {
          "partNumber": 3,
          "score": 8.5,
          "correctCount": 17,
          "totalQuestions": 20
        }
      ]
    },
    "questions": [
      {
        "questionNumber": 1,
        "questionText": "Question 1 text",
        "userAnswer": "B",
        "correctAnswer": "B",
        "isCorrect": true,
        "explanation": "Đáp án đúng là B vì..."
      },
      {
        "questionNumber": 2,
        "questionText": "Question 2 text",
        "userAnswer": "A",
        "correctAnswer": "C",
        "isCorrect": false,
        "explanation": "Đáp án đúng là C vì..."
      }
      // ... all questions
    ],
    "analysis": {
      "strengths": ["Part 1 - Điền từ vào chỗ trống"],
      "weaknesses": ["Part 2 - Đọc đoạn văn ngắn"]
    }
  }
}
```

**Response** (200 - Writing/Speaking with AI):
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "exerciseTitle": "Writing Full Test - Đề số 1",
      "skill": "writing",
      "status": "graded",
      "aiGradingStatus": "completed",
      "submittedAt": "2024-12-15T10:54:05Z",
      "aiGradedAt": "2024-12-15T10:55:23Z"
    },
    "scores": {
      "overall": 7.5,
      "taskAchievement": 7.5,
      "coherenceCohesion": 8.0,
      "lexicalResource": 7.0,
      "grammaticalAccuracy": 7.5
    },
    "feedback": {
      "overall": "Good essay overall with clear structure...",
      "strengths": [
        "Good use of paragraphing and organization",
        "Wide range of vocabulary related to the topic"
      ],
      "weaknesses": [
        "Some grammatical errors with complex sentences",
        "Limited use of cohesive devices"
      ],
      "task1Feedback": "Task 1 detailed feedback...",
      "task2Feedback": "Task 2 detailed feedback...",
      "suggestions": [
        {
          "type": "grammar",
          "position": 45,
          "original": "very good",
          "suggestion": "excellent",
          "explanation": "Use stronger adjectives"
        }
      ]
    },
    "userWriting": {
      "task1": "User's task 1 text...",
      "task2": "User's task 2 text..."
    },
    "sampleEssays": [
      {
        "title": "Sample Essay - Band 7.5",
        "content": "Full sample essay...",
        "annotations": [...]
      }
    ]
  }
}
```

**Response** (202 - AI Grading in progress):
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "status": "submitted",
      "aiGradingStatus": "processing",
      "submittedAt": "2024-12-15T10:54:05Z",
      "estimatedTimeRemaining": "20 seconds"
    }
  }
}
```

**Business Logic**:
1. Validate submission belongs to user
2. Check status:
   - 'in_progress' → Error: Not submitted yet
   - 'submitted' → Check AI grading status
     - 'pending' or 'processing' → Return 202
     - 'completed' → Return full result
     - 'failed' → Return error + option to retry
   - 'graded' → Return full result
3. For Reading/Listening: Return immediate results
4. For Writing/Speaking: Check AI grading status

---

### 7.7. POST /api/ai-grading/grade

**Mô tả**: Trigger AI grading (called by backend worker)

**Request** (Internal):
```typescript
POST /api/ai-grading/grade
Content-Type: application/json

{
  "submissionId": "uuid",
  "skill": "writing",
  "content": {
    "task1": "User's task 1...",
    "task2": "User's task 2..."
  },
  "rubric": {
    // Grading criteria
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "submissionId": "uuid",
    "scores": {
      "overall": 7.5,
      "taskAchievement": 7.5,
      "coherenceCohesion": 8.0,
      "lexicalResource": 7.0,
      "grammaticalAccuracy": 7.5
    },
    "feedback": {
      // Detailed feedback
    }
  }
}
```

**Business Logic**:
1. Validate submission exists
2. Call OpenAI API với prompt:
   - System: "You are a VSTEP Writing grader..."
   - User: Exercise prompt + User's writing
   - Format: JSON with scores + feedback
3. Parse AI response
4. Validate scores (0-10 range)
5. Update submission:
   - ai_scores
   - ai_feedback
   - ai_grading_status = 'completed'
   - ai_graded_at = NOW()
6. Send notification to user
7. Return results

---

### 7.8. GET /api/history

**Mô tả**: Lấy lịch sử làm bài

**Request**:
```typescript
GET /api/history?skill=reading&status=completed&sort=recent&page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters**:
- `skill`: Optional ('reading'|'listening'|'writing'|'speaking')
- `type`: Optional ('part'|'fulltest')
- `status`: Optional ('in_progress'|'submitted'|'graded')
- `dateFrom`: Optional (ISO date)
- `dateTo`: Optional (ISO date)
- `scoreMin`: Optional (0-10)
- `scoreMax`: Optional (0-10)
- `sort`: Optional ('recent'|'oldest'|'score_high'|'score_low')
- `page`: Optional (default: 1)
- `limit`: Optional (default: 20)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "submissionId": "uuid",
        "exerciseId": "uuid",
        "exerciseTitle": "Reading Full Test - Đề số 1",
        "skill": "reading",
        "type": "fulltest",
        "level": "B2",
        "status": "graded",
        "score": 8.5,
        "percentage": 85.0,
        "timeTaken": 3245,
        "submittedAt": "2024-12-15T10:54:05Z"
      }
      // ... more submissions
    ],
    "stats": {
      "total": 45,
      "completed": 42,
      "inProgress": 3
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

---

## 8. Business Rules

### 8.1. Exercise Rules

**Exercise Availability**:
- Public exercises: Available to all users
- Private exercises: Only creator and assigned users
- Level-based filtering: Recommend matching user's level

**Time Limit**:
- Standard: Follow VSTEP guidelines
  - Reading Full Test: 60 minutes
  - Listening Full Test: 40 minutes
  - Writing Full Test: 60 minutes
  - Speaking Full Test: 12 minutes
- Practice mode: Can disable timer
- Custom: Teacher can set custom time

---

### 8.2. Submission Rules

**One Active Submission**:
- User can only have 1 in-progress submission per exercise
- Starting new attempt will save current progress
- Option to continue or start fresh

**Auto-save Frequency**:
- Client-side: Every 10 seconds to localStorage
- Server-side: Every 30 seconds via API
- On page unload: Save immediately

**Submit Validation**:
- Must answer all questions (or confirm to skip)
- Cannot submit without starting
- Cannot submit twice (status check)

---

### 8.3. Scoring Rules

**Reading/Listening** (Auto-grading):
- Exact match with answer key
- Score = (Correct / Total) × 10
- Band score mapping:
  - 0-3.9: Band 3
  - 4.0-4.9: Band 4
  - 5.0-5.9: Band 5
  - 6.0-6.9: Band 6
  - 7.0-7.9: Band 7
  - 8.0-8.9: Band 8
  - 9.0-10: Band 9-10

**Writing/Speaking** (AI-grading):
- 4 criteria scored 0-10 each
- Overall = Average of 4 criteria
- Criteria:
  1. Task Achievement/Response
  2. Coherence and Cohesion
  3. Lexical Resource
  4. Grammatical Range and Accuracy
  5. (Speaking only) Pronunciation and Fluency

**Score Rounding**:
- Round to 1 decimal place (e.g., 7.3, 8.5)

---

### 8.4. AI Grading Rules

**Grading Time**:
- Estimated: 30-60 seconds for Writing
- Estimated: 1-2 minutes for Speaking
- Max wait: 5 minutes → Retry

**Retry Policy**:
- Failed grading: Auto-retry 3 times
- After 3 fails: Mark as failed
- User can request manual grading

**Feedback Quality**:
- Must include scores for all criteria
- Must include strengths (≥2 points)
- Must include weaknesses (≥2 points)
- Must include specific suggestions (≥3 examples)

---

### 8.5. Bookmark Rules

**Limit**:
- Max 100 bookmarks per user
- Auto-remove oldest if exceeds

**Access**:
- Can bookmark during exercise
- Can view all bookmarks from "My Bookmarks" page
- Can add notes to bookmarks

---

## Kết thúc Module Practice & Learning

Module này là trung tâm của VSTEPRO, tích hợp với:
- Module 03: Exam System (Thi thử)
- Module 04: Grading System (Chấm điểm)
- Module 07: Assignment Management (Bài tập được giao)
- Module 12: Achievements (Badges khi hoàn thành)
- Module 19: Statistics (Thống kê tiến độ)
- Module 20: Notification (Thông báo kết quả)
