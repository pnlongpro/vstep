# VSTEPRO - COMPREHENSIVE HANDOVER DOCUMENTATION

## 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [User Flow](#user-flow)
3. [Screen-by-Screen Descriptions](#screen-by-screen-descriptions)
4. [User Actions & Interactions](#user-actions--interactions)
5. [Functional Requirements](#functional-requirements)
6. [Design System](#design-system)
7. [Component Structure](#component-structure)
8. [Edge Cases & Validation](#edge-cases--validation)
9. [Developer Handover Notes](#developer-handover-notes)

---

## 🎯 PROJECT OVERVIEW

**Project Name:** VSTEPRO  
**Type:** VSTEP Exam Preparation Platform  
**Tech Stack:** React, TypeScript, Tailwind CSS v4.0, Recharts  
**Target Levels:** A2, B1, B2, C1  
**Skills Covered:** Reading, Listening, Writing, Speaking

### Key Features
- ✅ Practice exercises for 4 skills (Reading, Listening, Writing, Speaking)
- ✅ Full VSTEP mock tests
- ✅ Auto-grading for Reading/Listening
- ✅ AI grading for Writing/Speaking with detailed feedback
- ✅ Voice recording for Speaking tests
- ✅ Auto-save every 10 seconds
- ✅ Fullscreen mode
- ✅ Global search with suggestions
- ✅ Badge/Achievement system (14 badges across 4 categories)
- ✅ Goal setting (5 goal types)
- ✅ Statistics and progress tracking
- ✅ Notifications system
- ✅ Profile management
- ✅ AI Chat Assistant (FloatingChatButton)
- ✅ Responsive design (Desktop & Mobile)

---

## 🗺️ USER FLOW

### Main Navigation Flow
```
Landing Page (Home)
    │
    ├─→ Luyện tập (Practice) ← Main Hub
    │   ├─→ Reading Practice
    │   ├─→ Listening Practice
    │   ├─→ Writing Practice
    │   ├─→ Speaking Practice
    │   └─→ Full Test (4 skills combined)
    │
    ├─→ Lịch sử (History)
    │   └─→ View past exercises & scores
    │
    ├─→ Thống kê (Statistics)
    │   └─→ Charts, progress, analytics
    │
    ├─→ Mục tiêu (Goals)
    │   └─→ Set & track learning goals
    │
    ├─→ Huy hiệu (Badges)
    │   └─→ View achievements
    │
    ├─→ Thông báo (Notifications)
    │   └─→ View system notifications
    │
    └─→ Hồ sơ (Profile)
        ├─→ Personal Info
        ├─→ Study Progress
        ├─→ Achievements
        ├─→ Badges
        ├─→ Goals
        └─→ Settings
```

### Practice Flow (Core Learning Flow)
```
Practice Hub
    │
    ├─→ Select Skill (Reading/Listening/Writing/Speaking/Full Test)
    │
    ├─→ Select Level (A2/B1/B2/C1)
    │
    ├─→ Start Exercise
    │   │
    │   ├─→ Answer questions
    │   ├─→ Auto-save every 10s
    │   ├─→ Toggle Fullscreen mode
    │   │
    │   └─→ Submit
    │
    └─→ Results & Feedback
        ├─→ Score breakdown
        ├─→ AI feedback (Writing/Speaking)
        ├─→ Review answers
        └─→ Save to history
```

---

## 📱 SCREEN-BY-SCREEN DESCRIPTIONS

### 1. HOME PAGE (Landing/Dashboard)
**File:** `/App.tsx`

**Layout:**
- **Header:** Logo, Global Search, Navigation Menu, Notifications Badge, Profile Avatar
- **Hero Section:** Welcome message, current level display, quick stats
- **Quick Access Cards:** 6 main features (Luyện tập, Lịch sử, Thống kê, Mục tiêu, Huy hiệu, Thông báo)
- **Statistics Overview:** Charts showing recent progress
- **Recent Activity:** Last 5 completed exercises
- **FloatingChatButton:** AI assistant (bottom-right corner)

**Key Components:**
- Hero banner with gradient background
- 6 feature cards with icons
- Mini charts (progress, skill breakdown)
- Activity timeline

---

### 2. PRACTICE HUB (Luyện tập)
**File:** `/components/PracticeHub.tsx`

**Layout:**
- **Header:** Back button, Title "Luyện tập", Description
- **Skill Selection Cards:** 
  - Reading (Blue theme, Book icon)
  - Listening (Green theme, Headphones icon)
  - Writing (Purple theme, PenTool icon)
  - Speaking (Orange theme, Mic icon)
  - Full Test (Red theme, Trophy icon)
- **Level Pills:** A2, B1, B2, C1 (selectable)
- **Start Button:** Large, prominent CTA

**Features:**
- Skill cards show: icon, title, description, number of exercises
- Level selector changes available exercises
- Hover effects on cards
- Start button disabled until skill + level selected

---

### 3. READING PRACTICE
**File:** `/components/practice/ReadingPractice.tsx`

**Layout:**
- **Top Bar:** Timer, Progress (e.g., "Question 3/10"), Fullscreen toggle, Exit
- **Content Split:**
  - **Left Panel:** Reading passage with scroll
  - **Right Panel:** Questions with radio buttons (A, B, C, D)
- **Navigation:** Previous/Next buttons
- **Submit Button:** Bottom-right corner

**Features:**
- Auto-save answers every 10 seconds
- Highlight selected answers
- Scroll position maintained
- Fullscreen mode expands content
- Warning before exit if not submitted

**Question Types:**
- Multiple Choice
- True/False/Not Given
- Matching Headings

---

### 4. LISTENING PRACTICE
**File:** `/components/practice/ListeningPractice.tsx`

**Layout:**
- **Audio Player:** Play/Pause, Progress bar, Volume control, Speed control (0.75x, 1x, 1.25x)
- **Transcript Toggle:** Show/Hide transcript
- **Questions:** Similar to Reading (radio buttons)
- **Navigation:** Previous/Next
- **Submit:** Bottom-right

**Features:**
- Audio controls with replay ability
- Can listen multiple times
- Transcript hidden by default (toggle to show)
- Auto-save answers
- Fullscreen mode

**Question Types:**
- Multiple Choice
- Short Answer
- Note Completion

---

### 5. WRITING PRACTICE
**File:** `/components/practice/WritingPractice.tsx`

**Layout:**
- **Prompt Section:** Task description (Task 1 or Task 2)
- **Text Editor:** Large textarea with word count
- **Word Count Display:** Real-time, shows minimum requirement (e.g., "150/150 words")
- **Tips Panel:** Collapsible sidebar with writing tips
- **Submit Button:** Disabled until minimum word count reached

**Features:**
- Auto-save draft every 10 seconds to localStorage
- Real-time word count
- Minimum word requirements:
  - Task 1 (Letter): 150 words
  - Task 2 (Essay): 250 words
- Fullscreen mode
- AI grading after submission

**AI Grading Criteria:**
1. **Task Achievement** (0-10)
2. **Coherence & Cohesion** (0-10)
3. **Vocabulary** (0-10)
4. **Grammar** (0-10)

**Feedback Format:**
- Overall score (average of 4 criteria)
- Individual scores for each criterion
- Strengths (bullet points)
- Areas for improvement (bullet points)
- Detailed comments
- Action plan suggestions

---

### 6. SPEAKING PRACTICE
**File:** `/components/practice/SpeakingPractice.tsx`

**Layout:**
- **Question Display:** Part 1/2/3 indicator, question text
- **Recording Controls:** 
  - Record button (red when recording)
  - Stop button
  - Play button (review recording)
  - Re-record button
- **Timer:** Shows recording duration
- **Progress:** Question X/Y
- **Navigation:** Next question
- **Submit:** After all questions answered

**Features:**
- Voice recording using MediaRecorder API
- Playback recorded audio
- Re-record if unsatisfied
- Visual waveform during recording
- Maximum recording time per question: 2 minutes
- AI grading after submission

**AI Grading Criteria:**
1. **Fluency & Coherence** (0-10)
2. **Pronunciation** (0-10)
3. **Vocabulary** (0-10)
4. **Grammar** (0-10)

**Parts:**
- **Part 1:** Personal questions (6 questions, 1 min each)
- **Part 2:** Long turn (1 topic, 2 min)
- **Part 3:** Discussion (4-5 questions, 1-2 min each)

---

### 7. FULL TEST (Exam Mode)
**File:** `/components/practice/FullTest.tsx`

**Layout:**
- **Section Navigator:** Tabs for Reading → Listening → Writing → Speaking
- **Timer:** Overall test timer (150 minutes)
- **Progress Bar:** Shows completion % across all 4 skills
- **Section Content:** Same as individual practice screens
- **Submit:** Only available after all 4 sections completed

**Features:**
- Sequential flow (must complete Reading before Listening, etc.)
- Or allow jumping between sections (configurable)
- Overall timer for entire test
- Individual timers per section (optional)
- Warning before time runs out
- Comprehensive results page with breakdown

**Results Page:**
- Overall score (average of 4 skills)
- Individual scores: Reading, Listening, Writing, Speaking
- Detailed breakdown per section
- AI feedback for Writing & Speaking
- Pass/Fail indicator (based on target level)

---

### 8. HISTORY PAGE (Lịch sử)
**File:** `/components/History-new.tsx`

**Layout:**
- **Header:** Title, Search bar
- **Filters:** 
  - Skill filter (All, Reading, Listening, Writing, Speaking, Full Test)
  - Level filter (All, A2, B1, B2, C1)
  - Date range picker
- **History List:** Cards showing:
  - Skill icon & name
  - Exercise title
  - Level badge
  - Score (large, color-coded)
  - Date & time
  - Duration
  - "View Details" button

**Sorting:**
- Default: Newest first
- Options: Oldest first, Highest score, Lowest score

**Detail Modal:**
- Full exercise review
- Question-by-question breakdown
- Correct/incorrect answers highlighted
- AI feedback (for Writing/Speaking)
- Option to export PDF

---

### 9. STATISTICS PAGE (Thống kê)
**File:** `/components/Statistics.tsx`

**Layout:**
- **Header:** Title, Period selector (7 days / 30 days / All)
- **Overview Cards (4):**
  - Total practices completed
  - Total study time
  - Average score
  - Current streak (consecutive days)
  
**Charts & Visualizations:**

1. **Progress Over Time (Line Chart):**
   - X-axis: Dates
   - Y-axis: Scores (0-10)
   - 5 lines: Overall, Reading, Listening, Writing, Speaking

2. **Skill Breakdown (Progress Bars):**
   - 4 skills with current score
   - Number of practices per skill

3. **Study Time by Day (Bar Chart):**
   - X-axis: Days of week (Mon-Sun)
   - Y-axis: Minutes studied

4. **Level Distribution (Pie Chart):**
   - A2, B1, B2, C1 percentages

5. **Radar Chart (Competency Analysis):**
   - 6 dimensions: Grammar, Vocabulary, Pronunciation, Fluency, Comprehension, Writing

6. **Achievements Section:**
   - Badge icons (locked/unlocked)
   - Achievement titles

7. **Recent Activity:**
   - Last 5 exercises with scores

**Features:**
- Period selector updates all charts
- Color-coded by skill
- Hover tooltips on charts
- Responsive grid layout

---

### 10. GOALS PAGE (Mục tiêu)
**File:** `/components/Goals.tsx`

**Layout:**
- **Header:** Title "Đặt mục tiêu học tập"
- **Active Goals Section:**
  - Goal cards with progress bars
  - Goal type, target, current progress, deadline
  - Edit/Delete buttons
  
- **Create New Goal Button:** Opens modal

**Goal Creation Modal:**
- **Goal Types:**
  1. Target Score (e.g., "Reach 8.0 in Reading")
  2. Practice Count (e.g., "Complete 50 exercises")
  3. Study Time (e.g., "Study 30 hours")
  4. Daily Streak (e.g., "Study 30 days in a row")
  5. Skill Mastery (e.g., "Master B2 level in all skills")

- **Fields:**
  - Goal name (text input)
  - Goal type (dropdown)
  - Target value (number input)
  - Deadline (date picker)
  - Notes (textarea, optional)

**Goal Card Display:**
- Progress bar (e.g., "25/50 exercises")
- Percentage complete
- Days remaining
- Status badge (On Track / At Risk / Completed / Expired)

**Features:**
- Edit existing goals
- Delete goals (with confirmation)
- Mark goals as completed manually
- Auto-complete when target reached
- Sort by: Deadline, Progress %, Created date

---

### 11. BADGES PAGE (Huy hiệu)
**File:** `/components/Badges.tsx`

**Layout:**
- **Header:** Title "Huy hiệu"
- **Filter Tabs:** All, Practice, Score, Streak, Milestone
- **Badge Grid:** 3-4 columns

**Badge Categories & Examples:**

1. **Practice Badges:**
   - First Steps (Complete 1st exercise)
   - Practice Enthusiast (10 exercises)
   - Century Club (100 exercises)
   - Dedication Master (500 exercises)

2. **Score Badges:**
   - Good Start (Score 5.0+)
   - Competent (Score 6.5+)
   - Proficient (Score 8.0+)
   - Perfect Score (Score 10.0)

3. **Streak Badges:**
   - Daily Habit (3 days streak)
   - Week Warrior (7 days streak)
   - Monthly Champion (30 days streak)
   - Year Long (365 days streak)

4. **Milestone Badges:**
   - Time Traveler (10 hours study time)
   - Marathon Runner (50 hours)
   - Reading Master (Master Reading at B2+)
   - Full Test Champion (Complete 5 full tests)

**Badge Card:**
- Icon (color if unlocked, grayscale if locked)
- Badge name
- Description
- Progress bar (for in-progress badges)
- Unlocked date (if unlocked)
- Lock icon (if locked)

**Features:**
- Filter by category
- Sort: Recently unlocked, Progress %, Alphabetical
- Click to view badge details
- Share badge on social media (future feature)

---

### 12. NOTIFICATIONS PAGE (Thông báo)
**File:** `/components/NotificationsPage.tsx`

**Layout:**
- **Header:** Title, "Mark all as read" button
- **Search Bar:** Filter notifications
- **Tabs (Sidebar):**
  - Quan trọng (Important)
  - Bài tập (Exercise)
  - Tiến độ & Kết quả (Progress)
  - Hệ thống (System)

**Notification Card:**
- Icon (based on type)
- Title (bold if unread)
- Message text
- Timestamp (e.g., "2 hours ago")
- Pin button
- Delete button
- Mark as read/unread toggle

**Notification Types:**

1. **Important (Red):**
   - Deadline reminders
   - Goal expiring soon
   - Streak about to break

2. **Exercise (Blue):**
   - New exercises available
   - Recommended practice
   - Teacher feedback received

3. **Progress (Green):**
   - Goal completed
   - New badge unlocked
   - Level up notification
   - Score milestone reached

4. **System (Gray):**
   - App updates
   - Maintenance notices
   - Feature announcements

**Features:**
- Pinned notifications stay at top
- Search/filter notifications
- Delete with confirmation
- Mark all as read
- Auto-delete old notifications (30 days)
- Badge count on header icon

---

### 13. PROFILE PAGE (Hồ sơ)
**File:** `/components/Profile.tsx`

**Layout (Sidebar Tabs):**
- **Sidebar (Left):** 6 tabs
- **Content Area (Right):** Tab-specific content

**Tabs:**

#### Tab 1: Thông tin cá nhân (Personal Info)
- Avatar upload
- Name (editable)
- Email (editable)
- Phone (editable)
- Current level (A2/B1/B2/C1)
- Target level
- Study start date
- Save button

#### Tab 2: Tiến độ học tập (Study Progress)
- Overall progress bar
- Progress per skill (4 progress bars)
- Total exercises completed
- Total study time
- Current streak
- Mini charts

#### Tab 3: Thành tích (Achievements)
- List of completed goals
- Completion dates
- Achievements timeline

#### Tab 4: Huy hiệu (Badges)
- Quick view of unlocked badges
- Progress to next badge
- Link to full Badges page

#### Tab 5: Mục tiêu (Goals)
- Active goals list
- Quick add goal button
- Link to full Goals page

#### Tab 6: Cài đặt (Settings)
- **Notifications:**
  - Email notifications (on/off)
  - Push notifications (on/off)
  - Sound (on/off)
  
- **Study Preferences:**
  - Auto-save interval (5s / 10s / 30s)
  - Auto-submit on timer end (on/off)
  - Show hints (on/off)
  
- **AI Assistant:**
  - Enable AI Chat (toggle) ← Controls FloatingChatButton
  - AI feedback language (Vietnamese/English)
  
- **Display:**
  - Theme (Light/Dark) - future feature
  - Language (Vietnamese/English)
  
- **Privacy:**
  - Data sharing (on/off)
  - Analytics (on/off)
  
- **Account:**
  - Change password button
  - Export data button
  - Delete account button (with confirmation)

**Features:**
- Sidebar collapsible on mobile
- Auto-save settings changes
- Custom event system: 
  - `vstep-settings-updated` event
  - FloatingChatButton listens to this event
  - Shows/hides based on "Enable AI Chat" toggle

---

### 14. FLOATING CHAT BUTTON (AI Assistant)
**File:** `/components/FloatingChatButton.tsx`

**Position:** Fixed bottom-right corner

**States:**
- **Collapsed:** Chat bubble icon
- **Expanded:** Full chat panel (400px width, 600px height)

**Features:**
- Click to expand/collapse
- Drag to reposition
- Chat interface with message bubbles
- Input field with send button
- Voice input button (future)
- Context-aware suggestions
- Controlled by Profile → Settings → "Enable AI Chat" toggle

**Chat Capabilities:**
- Answer questions about VSTEP format
- Explain grammar rules
- Provide vocabulary suggestions
- Give study tips
- Review answers (if integrated)

---

## 🎬 USER ACTIONS & INTERACTIONS

### Navigation Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Click "Luyện tập" | Header menu or home card | Navigate to Practice Hub |
| Click "Lịch sử" | Header menu or home card | Navigate to History page |
| Click "Thống kê" | Header menu or home card | Navigate to Statistics page |
| Click Logo | Header logo | Return to Home page |
| Click Notification Bell | Header icon | Open Notifications dropdown/page |
| Click Profile Avatar | Header avatar | Navigate to Profile page |
| Global Search | Type in search bar | Show search suggestions dropdown |

### Practice Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Select Skill | Click skill card | Highlight skill, enable level selector |
| Select Level | Click level pill (A2/B1/B2/C1) | Enable "Start" button |
| Click "Start" | Start button | Begin exercise/test |
| Answer Question | Click radio button | Mark answer, trigger auto-save |
| Next Question | Click "Next" button | Navigate to next question |
| Previous Question | Click "Previous" button | Navigate to previous question |
| Toggle Fullscreen | Click fullscreen icon | Enter/exit fullscreen mode |
| Submit | Click "Submit" button | End exercise, calculate score, show results |
| Exit | Click "X" or "Exit" | Show warning modal if unsaved changes |

### Writing Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Type in Editor | Keyboard input | Update word count, trigger auto-save |
| Reach Word Limit | Type past minimum | Enable Submit button |
| Click Tips | Tips toggle button | Show/hide writing tips panel |
| Submit | Submit button | Send to AI for grading, show results |

### Speaking Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Click Record | Record button | Start recording, show timer |
| Click Stop | Stop button | Stop recording, enable playback |
| Click Play | Play button | Play recorded audio |
| Click Re-record | Re-record button | Delete recording, allow new recording |
| Next Question | Next button | Save recording, move to next question |
| Submit All | Submit button | Send all recordings to AI, show results |

### History Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Search | Type in search bar | Filter history list |
| Apply Filter | Select skill/level filter | Update history list |
| Click "View Details" | Button on history card | Open detail modal |
| Export PDF | Button in detail modal | Download PDF report |
| Delete History Item | Delete button | Show confirmation, delete if confirmed |

### Statistics Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Change Period | Click 7 days / 30 days / All | Update all charts |
| Hover Chart | Mouse over chart point | Show tooltip with details |
| Click Achievement | Achievement badge | Show achievement details modal |

### Goals Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Click "New Goal" | New Goal button | Open goal creation modal |
| Fill Goal Form | Input fields | Enable "Create" button |
| Create Goal | Create button | Add goal to active list, close modal |
| Edit Goal | Edit button on goal card | Open edit modal with pre-filled data |
| Delete Goal | Delete button | Show confirmation, delete if confirmed |
| Mark Complete | Checkbox on goal card | Mark goal as completed manually |

### Badges Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Filter by Category | Click category tab | Show badges in that category |
| Click Badge | Badge card | Show badge detail modal |
| Share Badge | Share button (future) | Open share dialog |

### Notifications Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Click Notification | Notification card | Mark as read, expand details |
| Pin Notification | Pin icon | Move to top of list |
| Delete Notification | Delete button | Show confirmation, delete if confirmed |
| Mark All Read | Button in header | Mark all notifications as read |
| Search | Type in search | Filter notification list |

### Profile Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Switch Tab | Click sidebar tab | Show tab content |
| Upload Avatar | Click avatar area | Open file picker, upload image |
| Edit Profile Field | Change input value | Enable "Save" button |
| Save Profile | Save button | Update profile, show success message |
| Toggle Setting | Click toggle switch | Update setting, dispatch event if AI toggle |
| Change Password | Change password button | Open change password modal |
| Export Data | Export button | Download JSON file with user data |
| Delete Account | Delete button | Show confirmation, delete if confirmed |

### Floating Chat Actions
| Action | Trigger | Outcome |
|--------|---------|---------|
| Click Chat Bubble | Chat icon (bottom-right) | Expand chat panel |
| Type Message | Input field | Enable Send button |
| Send Message | Send button or Enter key | Send message, show AI response |
| Close Chat | X button | Collapse chat panel |
| Drag Chat | Mouse drag on header | Reposition chat panel |

---

## ⚙️ FUNCTIONAL REQUIREMENTS

### Authentication (Future Implementation)
- User registration
- Login/logout
- Password reset
- Session management
- OAuth integration (Google, Facebook)

### Data Persistence

#### LocalStorage Keys:
```javascript
{
  "vstep_user_profile": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "avatar": "base64 | url",
    "currentLevel": "A2 | B1 | B2 | C1",
    "targetLevel": "A2 | B1 | B2 | C1",
    "studyStartDate": "ISO date string"
  },
  
  "vstep_settings": {
    "notifications": {
      "email": boolean,
      "push": boolean,
      "sound": boolean
    },
    "study": {
      "autoSaveInterval": number,
      "autoSubmit": boolean,
      "showHints": boolean
    },
    "ai": {
      "enableChat": boolean,
      "feedbackLanguage": "vi | en"
    },
    "display": {
      "theme": "light | dark",
      "language": "vi | en"
    }
  },
  
  "vstep_user_badges": [
    {
      "id": "string",
      "badgeId": "string",
      "unlockedAt": "ISO date string",
      "category": "practice | score | streak | milestone",
      "progress": number
    }
  ],
  
  "vstep_goals": [
    {
      "id": "string",
      "name": "string",
      "type": "score | practice | time | streak | mastery",
      "target": number,
      "current": number,
      "deadline": "ISO date string",
      "status": "active | completed | expired",
      "createdAt": "ISO date string"
    }
  ],
  
  "vstep_notifications": [
    {
      "id": "string",
      "type": "important | exercise | progress | system",
      "title": "string",
      "message": "string",
      "timestamp": "ISO date string",
      "isRead": boolean,
      "isPinned": boolean
    }
  ],
  
  "exam_history": [
    {
      "id": "string",
      "type": "reading | listening | writing | speaking | exam",
      "title": "string",
      "level": "A2 | B1 | B2 | C1",
      "score": number,
      "date": "ISO date string",
      "duration": number, // minutes
      "answers": object,
      "feedback": object
    }
  ],
  
  "auto_save_draft": {
    "exerciseId": "string",
    "timestamp": "ISO date string",
    "content": object
  }
}
```

### Auto-Save Mechanism
- Triggers: Every 10 seconds (configurable in settings)
- Saves to: `localStorage` under `auto_save_draft`
- Saves: Current answers, text content, recordings metadata
- On page load: Check for draft, prompt user to restore
- On submit: Clear draft

### Voice Recording
- **Browser API:** MediaRecorder API
- **Supported formats:** webm, mp4, ogg
- **Max duration per question:** 2 minutes
- **Storage:** Base64 encoded audio in localStorage (temporary)
- **Production:** Should upload to server/cloud storage
- **Playback:** HTML5 Audio element

### AI Grading (Mock Implementation)
**Note:** Current implementation uses mock AI responses. Production requires integration with actual AI service (e.g., OpenAI GPT-4, Google Gemini, custom model).

**Writing AI Grading:**
```javascript
function gradeWriting(essay: string) {
  // Mock implementation
  // Production: Call AI API
  return {
    taskAchievement: 7.5,
    coherence: 7.0,
    vocabulary: 6.5,
    grammar: 7.0,
    overallScore: 7.0,
    feedback: {
      strengths: [...],
      improvements: [...],
      detailedComments: {...}
    }
  }
}
```

**Speaking AI Grading:**
```javascript
function gradeSpeaking(audioBlob: Blob) {
  // Mock implementation
  // Production: 
  // 1. Convert audio to text (Speech-to-Text API)
  // 2. Analyze text for grammar, vocabulary
  // 3. Analyze audio for pronunciation, fluency
  return {
    fluency: 7.5,
    pronunciation: 7.0,
    vocabulary: 7.5,
    grammar: 8.0,
    overallScore: 7.5,
    feedback: {...}
  }
}
```

### Fullscreen Mode
- **API:** Fullscreen API
- **Trigger:** Button click
- **Exit:** ESC key or Exit button
- **Behavior:** Hides header, expands content area
- **Compatibility:** Check browser support, fallback for unsupported browsers

### Search Functionality
- **Type:** Client-side fuzzy search
- **Scope:** Exercise titles, skill names, history items
- **Suggestions:** Real-time dropdown
- **Debounce:** 300ms delay
- **Production:** Should use server-side search for better performance

### Notifications System
- **Badge count:** Unread notifications shown on bell icon
- **Real-time updates:** `vstep-notifications-updated` custom event
- **Auto-delete:** Notifications older than 30 days
- **Pin feature:** Pinned notifications stay at top
- **Mark as read:** Auto-mark when clicked

### Custom Events
```javascript
// Settings update event
window.dispatchEvent(new Event('vstep-settings-updated'));

// Notifications update event
window.dispatchEvent(new Event('vstep-notifications-updated'));

// Badge unlock event
window.dispatchEvent(new CustomEvent('vstep-badge-unlocked', { 
  detail: { badgeId: 'string' } 
}));

// Goal complete event
window.dispatchEvent(new CustomEvent('vstep-goal-completed', { 
  detail: { goalId: 'string' } 
}));
```

### Progress Calculation
```javascript
// Skill progress (0-100%)
function calculateSkillProgress(skill: string) {
  const history = getHistoryBySkill(skill);
  const avgScore = history.reduce((sum, h) => sum + h.score, 0) / history.length;
  const practiceCount = history.length;
  
  // Formula: (avgScore * 5) + (practiceCount / 2)
  // Max 100%
  return Math.min(100, (avgScore * 5) + (practiceCount / 2));
}

// Overall progress
function calculateOverallProgress() {
  const skills = ['reading', 'listening', 'writing', 'speaking'];
  const avgProgress = skills.reduce((sum, skill) => 
    sum + calculateSkillProgress(skill), 0) / 4;
  return avgProgress;
}
```

### Streak Calculation
```javascript
function calculateStreak() {
  const history = getHistory().sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < history.length; i++) {
    const itemDate = new Date(history[i].date);
    itemDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor(
      (currentDate.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}
```

---

## 🎨 DESIGN SYSTEM

### Color Palette

#### Primary Colors
```css
--blue-50: #EFF6FF;
--blue-100: #DBEAFE;
--blue-200: #BFDBFE;
--blue-500: #3B82F6;
--blue-600: #2563EB;
--blue-700: #1D4ED8;

--green-50: #F0FDF4;
--green-500: #10B981;
--green-600: #059669;

--purple-50: #FAF5FF;
--purple-500: #8B5CF6;
--purple-600: #7C3AED;

--orange-50: #FFF7ED;
--orange-500: #F59E0B;
--orange-600: #D97706;

--red-50: #FEF2F2;
--red-500: #EF4444;
--red-600: #DC2626;
```

#### Neutral Colors
```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

#### Skill Colors (Consistent throughout app)
- **Reading:** Blue (#3B82F6)
- **Listening:** Green (#10B981)
- **Writing:** Purple (#8B5CF6)
- **Speaking:** Orange (#F59E0B)
- **Full Test:** Red (#EF4444)

### Typography

**Note:** Tailwind v4.0 is used. Font size, weight, and line-height are controlled via `/styles/globals.css`. Do NOT use Tailwind classes for typography unless specifically requested.

#### Default Typography (from globals.css)
```css
/* Headers */
h1 { font-size: 2.25rem; font-weight: 700; line-height: 2.5rem; }
h2 { font-size: 1.875rem; font-weight: 700; line-height: 2.25rem; }
h3 { font-size: 1.5rem; font-weight: 600; line-height: 2rem; }
h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.75rem; }

/* Body */
p { font-size: 1rem; line-height: 1.5rem; }
small { font-size: 0.875rem; line-height: 1.25rem; }

/* Buttons */
button { font-size: 0.875rem; font-weight: 500; }
```

#### Font Family
- **Primary:** System font stack (default)
- **Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Spacing Scale
```css
/* Tailwind default spacing */
0.5 = 0.125rem = 2px
1   = 0.25rem  = 4px
2   = 0.5rem   = 8px
3   = 0.75rem  = 12px
4   = 1rem     = 16px
5   = 1.25rem  = 20px
6   = 1.5rem   = 24px
8   = 2rem     = 32px
10  = 2.5rem   = 40px
12  = 3rem     = 48px
16  = 4rem     = 64px
```

#### Common Spacing Patterns
- **Card padding:** `p-6` (24px)
- **Section gap:** `gap-6` (24px)
- **Button padding:** `px-4 py-2` (16px horizontal, 8px vertical)
- **Icon size:** `size-5` (20px) or `size-6` (24px)
- **Input padding:** `px-4 py-2.5` (16px horizontal, 10px vertical)

### Border Radius
```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px - default */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;  /* Circle */
```

#### Usage
- **Cards:** `rounded-xl` (16px)
- **Buttons:** `rounded-lg` (12px)
- **Input fields:** `rounded-lg` (12px)
- **Pills/Badges:** `rounded` (8px) or `rounded-full`
- **Avatars:** `rounded-full`

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

#### Usage
- **Cards:** `shadow-sm` + `border border-gray-100`
- **Modals:** `shadow-xl`
- **Floating elements:** `shadow-lg`
- **Hover state:** Increase shadow (e.g., `hover:shadow-md`)

### Transitions
```css
--transition-all: all 0.3s ease;
--transition-colors: colors 0.2s ease;
--transition-transform: transform 0.2s ease;
```

#### Standard Durations
- **Hover effects:** 200ms
- **Page transitions:** 300ms
- **Modals/Dropdowns:** 200ms
- **Sidebar collapse:** 300ms

### Icon System
- **Library:** Lucide React
- **Default size:** 20px (`size-5`) or 24px (`size-6`)
- **Color:** Inherit from parent or use skill colors
- **Stroke width:** 2 (default)

#### Common Icons
- **Navigation:** ArrowLeft, ArrowRight, ChevronDown, ChevronRight
- **Actions:** Check, X, Trash2, Edit2, Download, Upload
- **Skills:** Book, Headphones, PenTool, Mic, Trophy
- **UI:** Search, Filter, Bell, User, Settings, Eye, Lock

### Button Styles

#### Primary Button
```jsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Button Text
</button>
```

#### Secondary Button
```jsx
<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
  Button Text
</button>
```

#### Outline Button
```jsx
<button className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
  Button Text
</button>
```

#### Danger Button
```jsx
<button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
  Delete
</button>
```

#### Disabled State
```jsx
<button className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed" disabled>
  Disabled
</button>
```

### Input Styles

#### Text Input
```jsx
<input 
  type="text"
  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
  placeholder="Enter text..."
/>
```

#### Textarea
```jsx
<textarea 
  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
  rows={4}
  placeholder="Enter text..."
/>
```

#### Select Dropdown
```jsx
<select className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Card Styles

#### Standard Card
```jsx
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  Card Content
</div>
```

#### Gradient Card (for metrics)
```jsx
<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
  Card Content
</div>
```

#### Interactive Card (hover effect)
```jsx
<div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer">
  Card Content
</div>
```

### Badge Styles

#### Level Badge
```jsx
<span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
  B2
</span>
```

#### Skill Badge (color-coded)
```jsx
<span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs uppercase">
  Reading
</span>
```

#### Status Badge
```jsx
<span className="px-2.5 py-1 bg-green-100 text-green-600 rounded text-xs">
  Completed
</span>
```

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

#### Common Responsive Patterns
```jsx
// Grid columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Flex direction
<div className="flex flex-col md:flex-row gap-4">

// Hide on mobile
<div className="hidden md:block">

// Sidebar width
<div className="w-full md:w-72 lg:w-80">
```

---

## 🧩 COMPONENT STRUCTURE

### File Organization
```
/
├── App.tsx                          # Main app component
├── styles/
│   └── globals.css                  # Global styles, Tailwind tokens
├── components/
│   ├── Header.tsx                   # Global header
│   ├── FloatingChatButton.tsx       # AI chat assistant
│   ├── PracticeHub.tsx              # Practice selection page
│   ├── History.tsx                  # Export wrapper
│   ├── History-new.tsx              # History page implementation
│   ├── Statistics.tsx               # Statistics page
│   ├── Goals.tsx                    # Goals page
│   ├── Badges.tsx                   # Badges page
│   ├── NotificationsPage.tsx        # Notifications page
│   ├── Profile.tsx                  # Profile page
│   └── practice/
│       ├── ReadingPractice.tsx      # Reading exercise
│       ├── ListeningPractice.tsx    # Listening exercise
│       ├── WritingPractice.tsx      # Writing exercise
│       ├── SpeakingPractice.tsx     # Speaking exercise
│       └── FullTest.tsx             # Full test (4 skills)
└── INSTRUCTIONS.md                  # This file
```

### Component Hierarchy

#### App.tsx
```
App
├── Header
│   ├── Logo
│   ├── GlobalSearch
│   ├── Navigation
│   ├── NotificationBell
│   └── ProfileAvatar
├── Main Content
│   ├── Home (default)
│   ├── PracticeHub
│   │   └── Practice Components
│   ├── History
│   ├── Statistics
│   ├── Goals
│   ├── Badges
│   ├── NotificationsPage
│   └── Profile
└── FloatingChatButton
```

### Reusable Components (Suggested)

To improve code maintainability, consider extracting these reusable components:

#### SkillCard Component
```tsx
interface SkillCardProps {
  skill: 'reading' | 'listening' | 'writing' | 'speaking' | 'exam';
  title: string;
  description: string;
  count: number;
  onClick: () => void;
}

function SkillCard({ skill, title, description, count, onClick }: SkillCardProps) {
  const config = getSkillConfig(skill);
  return (
    <div className={`card ${config.bg} ${config.border}`} onClick={onClick}>
      <config.icon className={config.color} />
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{count} exercises</span>
    </div>
  );
}
```

#### ScoreDisplay Component
```tsx
interface ScoreDisplayProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function ScoreDisplay({ score, size = 'md' }: ScoreDisplayProps) {
  const color = score >= 8 ? 'green' : score >= 6.5 ? 'blue' : score >= 5 ? 'orange' : 'red';
  const textSize = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl';
  
  return (
    <div className={`${textSize} text-${color}-600`}>
      {score.toFixed(1)}
    </div>
  );
}
```

#### ProgressBar Component
```tsx
interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
}

function ProgressBar({ current, total, color = 'blue', showLabel = true }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  
  return (
    <div>
      {showLabel && <div>{current}/{total}</div>}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color}-600 transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

#### Modal Component
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2>{title}</h2>
          <button onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```

#### Badge Component
```tsx
interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

function Badge({ label, variant = 'default', size = 'md' }: BadgeProps) {
  const colors = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-orange-100 text-orange-600',
    error: 'bg-red-100 text-red-600',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };
  
  return (
    <span className={`${colors[variant]} ${sizes[size]} rounded`}>
      {label}
    </span>
  );
}
```

---

## ⚠️ EDGE CASES & VALIDATION

### Input Validation

#### Writing Practice
- **Min word count:** Must reach minimum (150 for Task 1, 250 for Task 2)
- **Max word count:** No hard limit, but warning if exceeds 350 (Task 1) or 500 (Task 2)
- **Empty submission:** Disabled submit button if no text
- **Special characters:** Allow all unicode characters
- **Paste from Word:** Strip formatting, keep plain text

#### Speaking Practice
- **Recording permission:** Check microphone permission before recording
- **No recording:** Disable submit if any question not answered
- **File size:** Warn if recording exceeds 10MB
- **Browser support:** Show warning if MediaRecorder API not supported
- **Recording failure:** Show error message, allow retry

#### Form Inputs (Profile, Goals, etc.)
- **Email:** Valid email format (regex validation)
- **Phone:** Optional, allow international formats
- **Name:** Min 2 characters, max 100 characters
- **Date:** Must be future date for deadlines/goals
- **Number inputs:** Min/max validation, no negative numbers

### Error Handling

#### Network Errors (Future Backend Integration)
- **Failed to load data:** Show retry button
- **Failed to save:** Show error message, keep data in memory
- **Timeout:** Show timeout message after 30 seconds
- **Offline:** Detect offline status, queue requests

#### LocalStorage Errors
- **Storage full:** Show warning, clear old data
- **Parse error:** Clear corrupted data, reload defaults
- **Access denied:** Fallback to in-memory storage

#### Audio/Media Errors
- **Microphone permission denied:** Show instructions to enable
- **Audio playback failed:** Show error, provide download link
- **Recording device error:** Detect error, show troubleshooting steps

### Browser Compatibility

#### Required Features
- LocalStorage (IE8+)
- MediaRecorder API (Chrome 47+, Firefox 25+, Safari 14+)
- Fullscreen API (IE11+, all modern browsers)
- Audio API (all modern browsers)

#### Fallbacks
- **No MediaRecorder:** Show message "Speaking practice requires Chrome, Firefox, or Safari 14+"
- **No Fullscreen:** Hide fullscreen button
- **No LocalStorage:** Use in-memory storage, show warning

### Data Integrity

#### Auto-Save
- **Concurrent edits:** Last save wins (no conflict resolution needed for single-user)
- **Save failure:** Retry up to 3 times, show error if all fail
- **Restore draft:** Prompt user on page load if draft exists

#### History Data
- **Duplicate prevention:** Check ID before adding to history
- **Data migration:** Version field for future schema changes
- **Max history items:** Limit to 500 items, delete oldest

#### User Progress
- **Negative scores:** Clamp to 0-10 range
- **Invalid dates:** Default to current date
- **Missing data:** Use default values, don't crash

### UI Edge Cases

#### Empty States
- **No history:** Show empty state with "Start practicing" CTA
- **No goals:** Show empty state with "Create your first goal" CTA
- **No notifications:** Show "No new notifications"
- **No badges unlocked:** Show locked badges with progress

#### Long Content
- **Long exercise titles:** Truncate with ellipsis, show full on hover
- **Long usernames:** Truncate in header, show full in profile
- **Long feedback:** Scrollable container, max-height

#### Mobile Considerations
- **Small screens:** Stack cards vertically, reduce padding
- **Touch targets:** Min 44x44px for buttons
- **Horizontal scroll:** Prevent, use flex-wrap
- **Keyboard:** Auto-scroll to input when focused

---

## 👨‍💻 DEVELOPER HANDOVER NOTES

### Getting Started

#### Prerequisites
- Node.js 16+ and npm/yarn
- Modern browser (Chrome, Firefox, Safari, Edge latest)
- Text editor with TypeScript support

#### Installation
```bash
# Clone repository
git clone <repo-url>
cd vstepro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Workflow

#### Project Structure
- **`/App.tsx`:** Main application component, routing logic
- **`/components/`:** All React components
- **`/styles/`:** Global CSS, Tailwind configuration
- **`/public/`:** Static assets (future)

#### Key Files to Understand
1. **App.tsx:** Main routing and state management
2. **components/PracticeHub.tsx:** Entry point for all practice exercises
3. **components/History-new.tsx:** Large file with mock data
4. **components/Profile.tsx:** Sidebar tabs implementation, custom events
5. **components/FloatingChatButton.tsx:** Listens to settings events

#### State Management
- **Current:** React useState hooks + localStorage
- **Recommendation for Production:** 
  - Use Context API for global state (user, settings)
  - Consider Zustand or Redux for complex state
  - Move to backend + database for persistence

### Backend Integration Checklist

#### API Endpoints Needed
```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/reset-password

User Profile:
GET    /api/user/profile
PUT    /api/user/profile
DELETE /api/user/account

Practice:
GET    /api/exercises?skill=reading&level=B2
GET    /api/exercises/:id
POST   /api/exercises/:id/submit
GET    /api/exercises/:id/results

History:
GET    /api/history?skill=reading&limit=50
GET    /api/history/:id
DELETE /api/history/:id

Statistics:
GET    /api/statistics?period=week

Goals:
GET    /api/goals
POST   /api/goals
PUT    /api/goals/:id
DELETE /api/goals/:id

Badges:
GET    /api/badges
POST   /api/badges/:id/unlock

Notifications:
GET    /api/notifications
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id

AI Grading:
POST   /api/ai/grade-writing
POST   /api/ai/grade-speaking

File Upload (for Speaking audio):
POST   /api/upload/audio
```

#### Database Schema (Suggested)

**Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  current_level VARCHAR(2),
  target_level VARCHAR(2),
  study_start_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Exercise_History Table:**
```sql
CREATE TABLE exercise_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  exercise_type VARCHAR(20), -- reading, listening, writing, speaking, exam
  exercise_id UUID,
  title VARCHAR(255),
  level VARCHAR(2),
  score DECIMAL(3,1),
  duration INTEGER, -- minutes
  answers JSONB,
  feedback JSONB,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

**Goals Table:**
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  type VARCHAR(20), -- score, practice, time, streak, mastery
  target INTEGER,
  current INTEGER,
  deadline DATE,
  status VARCHAR(20), -- active, completed, expired
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Badges Table:**
```sql
CREATE TABLE user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  badge_id VARCHAR(50),
  unlocked_at TIMESTAMP DEFAULT NOW()
);
```

**Notifications Table:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20), -- important, exercise, progress, system
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### AI Integration Guide

#### Writing AI Grading
**Recommended Service:** OpenAI GPT-4 or Google Gemini

**Prompt Template:**
```
You are an IELTS/VSTEP Writing examiner. Grade the following essay based on these criteria:
1. Task Achievement (0-10)
2. Coherence and Cohesion (0-10)
3. Vocabulary (0-10)
4. Grammar (0-10)

Essay Prompt: {prompt}
Student Essay: {essay}

Provide:
- Individual scores for each criterion
- Overall score (average)
- 3-5 strengths (bullet points)
- 3-5 areas for improvement (bullet points)
- Detailed feedback for each criterion
- Action plan (3 specific steps)

Format response as JSON.
```

#### Speaking AI Grading
**Recommended Services:**
- Speech-to-Text: Google Cloud Speech-to-Text, Azure Speech Service
- Text Analysis: GPT-4, Gemini
- Pronunciation: Azure Pronunciation Assessment

**Workflow:**
1. Upload audio to cloud storage
2. Convert speech to text (Speech-to-Text API)
3. Analyze text for grammar, vocabulary (GPT-4)
4. Analyze audio for pronunciation, fluency (Pronunciation API)
5. Combine scores and generate feedback

### Security Considerations

#### Authentication
- Use JWT or session-based auth
- Hash passwords with bcrypt (min 10 rounds)
- Implement rate limiting on auth endpoints
- Add email verification
- Support 2FA (future)

#### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all API calls
- Sanitize user inputs (prevent XSS)
- Validate file uploads (type, size)
- Implement CORS properly

#### Privacy
- GDPR compliance: Allow data export, deletion
- Don't store PII unnecessarily
- Clear privacy policy
- Cookie consent banner

### Performance Optimization

#### Frontend
- Lazy load components (React.lazy)
- Memoize expensive calculations (useMemo)
- Debounce search inputs
- Virtualize long lists (react-window)
- Optimize images (WebP, lazy loading)
- Code splitting by route

#### Backend
- Cache frequently accessed data (Redis)
- Paginate large result sets
- Index database properly
- Use CDN for static assets
- Compress API responses (gzip)

### Testing Strategy

#### Unit Tests
- Test utility functions (score calculation, streak logic)
- Test form validation
- Test data transformations

#### Integration Tests
- Test API endpoints
- Test database queries
- Test authentication flow

#### E2E Tests (Recommended: Playwright or Cypress)
- User registration → practice → view results flow
- Goal creation → completion flow
- Profile update flow
- Fullscreen mode
- Audio recording (if possible)

### Deployment

#### Environment Variables
```env
VITE_API_URL=https://api.vstepro.com
VITE_AI_API_KEY=<openai-key>
VITE_STORAGE_URL=<cloud-storage-url>
VITE_SENTRY_DSN=<error-tracking>
```

#### Build
```bash
npm run build
# Output: /dist folder
```

#### Hosting Recommendations
- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **Backend:** Railway, Render, AWS, Google Cloud
- **Database:** Supabase, PlanetScale, Neon
- **Storage:** AWS S3, Cloudinary, Backblaze

### Monitoring & Analytics

#### Error Tracking
- Use Sentry or similar
- Track: JS errors, API errors, failed recordings

#### Analytics
- Google Analytics or Plausible
- Track: Page views, practice completions, goal completions
- Funnel: Sign up → First practice → 10 practices → Goal complete

#### Performance
- Lighthouse scores (aim for 90+ on all metrics)
- Core Web Vitals monitoring
- API response times

### Known Issues & TODOs

#### Current Limitations
- ❌ No real backend (all data in localStorage)
- ❌ Mock AI grading (not real AI)
- ❌ Audio recordings not persisted (localStorage only)
- ❌ No user authentication
- ❌ No real-time features
- ❌ Limited to single device (no sync)

#### Future Enhancements
- [ ] Add backend API
- [ ] Integrate real AI for grading
- [ ] Cloud storage for audio
- [ ] User authentication
- [ ] Multi-device sync
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Teacher dashboard
- [ ] Group study features
- [ ] Payment integration (premium features)
- [ ] Certificate generation
- [ ] Social features (leaderboard, study groups)

### Support & Documentation

#### Internal Documentation
- Add JSDoc comments to complex functions
- Create API documentation (Swagger/OpenAPI)
- Maintain CHANGELOG.md

#### User Documentation
- Create user guide
- Add tooltips to complex features
- Create video tutorials
- FAQ section

---

## 📞 CONTACT & HANDOVER

### Key Decisions Made
1. **Tailwind v4.0:** No font size/weight classes in code, controlled via globals.css
2. **LocalStorage:** Temporary solution, migrate to backend ASAP
3. **Mock Data:** Extensive mock data for demo, easy to replace with API calls
4. **Custom Events:** Used for cross-component communication (Settings → FloatingChatButton)
5. **No Backend:** All logic is frontend, requires full backend implementation

### Next Steps for Development Team
1. ✅ **Review codebase** - Understand component structure
2. ✅ **Set up backend** - Choose tech stack (Node.js/Django/Rails)
3. ✅ **Create database** - Implement schema
4. ✅ **API development** - Build REST or GraphQL API
5. ✅ **AI integration** - Set up OpenAI/Gemini API
6. ✅ **Authentication** - Implement user auth
7. ✅ **Cloud storage** - For audio files
8. ✅ **Testing** - Write tests
9. ✅ **Deployment** - Deploy to production
10. ✅ **Monitoring** - Set up error tracking & analytics

### Questions to Address
- Which backend framework? (Node.js + Express, NestJS, Django, Rails?)
- Which database? (PostgreSQL, MySQL, MongoDB?)
- Which AI service? (OpenAI, Google Gemini, Azure, custom?)
- Which cloud provider? (AWS, Google Cloud, Azure?)
- Authentication method? (JWT, OAuth, Sessions?)
- Payment integration needed? (Stripe, PayPal?)

### Files to Review First
1. `/App.tsx` - Main app structure
2. `/components/PracticeHub.tsx` - Core practice flow
3. `/components/Profile.tsx` - Settings & custom events
4. `/components/History-new.tsx` - Data structure for history
5. `/INSTRUCTIONS.md` - This file!

---

**End of Documentation**

**Document Version:** 1.0  
**Last Updated:** 2025-12-09  
**Prepared By:** AI Assistant  
**Status:** Ready for Developer Handover

For any questions or clarifications, please refer to the codebase or contact the development team.
