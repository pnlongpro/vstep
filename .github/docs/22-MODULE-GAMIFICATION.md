# 🎮 Module 22: Gamification (Extended)

> **Module gamification mở rộng**
> 
> File: `22-MODULE-GAMIFICATION.md`  
> Version: 1.0  
> Last Updated: 15/12/2024

---

## Giới thiệu

Module Gamification mở rộng từ Module 12 (Achievements), bổ sung:
- Point System
- Leaderboards
- Challenges
- Rewards
- Social Competition

---

## Point System

### 1. Earning Points

**Activity Points**:
```typescript
const POINTS = {
  // Practice
  COMPLETE_EXERCISE: 10,
  PERFECT_SCORE: 20,
  FIRST_TRY_SUCCESS: 15,
  
  // Assignments
  SUBMIT_ASSIGNMENT: 15,
  ON_TIME_SUBMISSION: 5,
  HIGH_SCORE_ASSIGNMENT: 25,
  
  // Exams
  COMPLETE_MOCK_EXAM: 50,
  CERTIFICATE_EARNED: 100,
  
  // Engagement
  LOGIN_DAILY: 5,
  STREAK_MILESTONE: 50, // per milestone
  
  // Social
  HELP_CLASSMATE: 10,
  POSITIVE_REVIEW: 5,
  
  // Contribution
  UPLOAD_EXAM: 100,
  EXAM_APPROVED: 200
};
```

### 2. Point Multipliers

```typescript
interface Multiplier {
  type: 'streak' | 'premium' | 'event';
  value: number; // 1.5x, 2x, etc.
  expiresAt?: Date;
}

// Streak multiplier
if (userStreak >= 7) multiplier = 1.2;
if (userStreak >= 30) multiplier = 1.5;
if (userStreak >= 100) multiplier = 2.0;

// Premium user
if (isPremium) multiplier *= 1.5;

// Special events
if (isDoublePointsEvent) multiplier *= 2;
```

---

## Leaderboards

### 1. Leaderboard Types

```tsx
<LeaderboardTabs>
  <Tab>Global</Tab>
  <Tab>My Class</Tab>
  <Tab>Friends</Tab>
  <Tab>This Month</Tab>
</LeaderboardTabs>

<Leaderboard>
  <Header>
    <Title>🏆 Top Learners</Title>
    <TimeRange>This Month</TimeRange>
  </Header>
  
  <RankList>
    {/* Top 3 with special styling */}
    <RankItem rank={1} highlight>
      <Medal>🥇</Medal>
      <Avatar src={user1.avatar} />
      <Name>{user1.name}</Name>
      <Points>{user1.points.toLocaleString()} pts</Points>
    </RankItem>
    
    <RankItem rank={2} highlight>
      <Medal>🥈</Medal>
      <Avatar src={user2.avatar} />
      <Name>{user2.name}</Name>
      <Points>{user2.points.toLocaleString()} pts</Points>
    </RankItem>
    
    <RankItem rank={3} highlight>
      <Medal>🥉</Medal>
      <Avatar src={user3.avatar} />
      <Name>{user3.name}</Name>
      <Points>{user3.points.toLocaleString()} pts</Points>
    </RankItem>
    
    {/* Rest of top 10 */}
    {ranks4to10.map(user => (
      <RankItem rank={user.rank}>
        <Rank>#{user.rank}</Rank>
        <Avatar src={user.avatar} />
        <Name>{user.name}</Name>
        <Points>{user.points.toLocaleString()} pts</Points>
      </RankItem>
    ))}
  </RankList>
  
  <MyRank>
    <RankItem highlight>
      <Rank>#{myRank}</Rank>
      <Avatar src={me.avatar} />
      <Name>You</Name>
      <Points>{myPoints.toLocaleString()} pts</Points>
    </RankItem>
  </MyRank>
</Leaderboard>
```

### 2. Leaderboard Filters

- **Time Range**: Today, This Week, This Month, All Time
- **Scope**: Global, Class, Friends
- **Category**: Overall, Reading, Listening, Writing, Speaking

---

## Challenges

### 1. Daily Challenges

```tsx
<DailyChallenges>
  <Header>
    <Title>📅 Daily Challenges</Title>
    <Refresh>Resets in 5h 23m</Refresh>
  </Header>
  
  <ChallengeList>
    <Challenge completed>
      <Icon>✓</Icon>
      <Title>Complete 3 exercises</Title>
      <Progress>3/3</Progress>
      <Reward>+30 pts</Reward>
    </Challenge>
    
    <Challenge>
      <Icon>⏰</Icon>
      <Title>Study for 30 minutes</Title>
      <Progress>18/30 min</Progress>
      <Reward>+25 pts</Reward>
      <ProgressBar value={60} />
    </Challenge>
    
    <Challenge>
      <Icon>🎯</Icon>
      <Title>Get 8.0+ on any exercise</Title>
      <Progress>Best: 7.5</Progress>
      <Reward>+50 pts</Reward>
    </Challenge>
  </ChallengeList>
</DailyChallenges>
```

### 2. Weekly Challenges

```tsx
<WeeklyChallenges>
  <Challenge>
    <Title>Master of the Week</Title>
    <Description>Complete 20 exercises with avg 8.0+</Description>
    <Progress>12/20 exercises</Progress>
    <Reward>
      <Points>+200 pts</Points>
      <Badge>Master Badge</Badge>
    </Reward>
    <TimeLeft>4 days left</TimeLeft>
  </Challenge>
</WeeklyChallenges>
```

### 3. Special Events

```tsx
<SpecialEvent>
  <Banner>
    <Title>🎉 Double Points Weekend!</Title>
    <Subtitle>Earn 2x points on all activities</Subtitle>
    <Countdown>
      <Time>1d 5h 23m remaining</Time>
    </Countdown>
  </Banner>
</SpecialEvent>
```

---

## Rewards & Shop

### 1. Reward Types

```typescript
interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number; // points
  type: 'badge' | 'avatar' | 'theme' | 'feature';
  
  // Feature rewards
  unlocks?: {
    type: 'unlimited_practice' | 'ai_tutor' | 'priority_support';
    duration?: number; // days
  };
}
```

### 2. Rewards Shop

```tsx
<RewardsShop>
  <Header>
    <Title>🏪 Rewards Shop</Title>
    <Balance>Your Points: {userPoints.toLocaleString()}</Balance>
  </Header>
  
  <Categories>
    <Tab>Badges</Tab>
    <Tab>Avatars</Tab>
    <Tab>Themes</Tab>
    <Tab>Features</Tab>
  </Categories>
  
  <RewardGrid>
    <RewardCard>
      <Image src={reward.image} />
      <Name>{reward.name}</Name>
      <Description>{reward.description}</Description>
      <Cost>{reward.cost} pts</Cost>
      <Button disabled={userPoints < reward.cost}>
        {owned ? 'Owned' : 'Redeem'}
      </Button>
    </RewardCard>
  </RewardGrid>
</RewardsShop>
```

### 3. Redeemable Rewards

**Cosmetic**:
- Exclusive badges
- Custom avatars
- Profile themes
- Profile frames

**Functional**:
- 7-day unlimited practice (500 pts)
- AI tutor access (1000 pts)
- Priority support (300 pts)
- Mock exam unlock (200 pts)

---

## Social Features

### 1. Friends System

```tsx
<Friends>
  <FriendList>
    <Friend>
      <Avatar />
      <Name>John Doe</Name>
      <Level>Level 15</Level>
      <OnlineStatus online />
      <CompareButton>Compare Progress</CompareButton>
    </Friend>
  </FriendList>
  
  <AddFriend>
    <Input placeholder="Search by name or email..." />
    <Button>Add Friend</Button>
  </AddFriend>
</Friends>
```

### 2. Progress Comparison

```tsx
<ProgressComparison>
  <Header>
    <User1>You</User1>
    <VS>VS</VS>
    <User2>John Doe</User2>
  </Header>
  
  <ComparisonChart>
    <Metric>
      <Label>Total Points</Label>
      <Bar1 value={user1Points} />
      <Bar2 value={user2Points} />
    </Metric>
    
    <Metric>
      <Label>Exercises Completed</Label>
      <Bar1 value={user1Exercises} />
      <Bar2 value={user2Exercises} />
    </Metric>
    
    <Metric>
      <Label>Average Score</Label>
      <Bar1 value={user1AvgScore} />
      <Bar2 value={user2AvgScore} />
    </Metric>
  </ComparisonChart>
</ProgressComparison>
```

---

## Database Design

### Table: user_points

```sql
CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  total_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  -- Total includes spent points
  
  current_multiplier DECIMAL(3,2) DEFAULT 1.0,
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);
```

### Table: point_transactions

```sql
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  amount INTEGER NOT NULL,
  -- Positive for earning, negative for spending
  
  type VARCHAR(50) NOT NULL,
  -- 'earn_exercise' | 'earn_assignment' | 'spend_reward' | etc.
  
  description TEXT,
  reference_id UUID,
  -- ID of related entity (exercise, assignment, etc.)
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_point_transactions_user ON point_transactions(user_id, created_at DESC);
```

### Table: leaderboards

```sql
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  scope VARCHAR(20) NOT NULL,
  -- 'global' | 'class' | 'friends'
  
  period VARCHAR(20) NOT NULL,
  -- 'daily' | 'weekly' | 'monthly' | 'alltime'
  
  points INTEGER NOT NULL,
  rank INTEGER,
  
  class_id UUID REFERENCES classes(id),
  -- For class leaderboards
  
  period_start DATE,
  period_end DATE,
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, scope, period, period_start)
);

CREATE INDEX idx_leaderboards_rank ON leaderboards(scope, period, rank);
```

### Table: challenges

```sql
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  -- 'daily' | 'weekly' | 'special'
  
  criteria JSONB NOT NULL,
  -- { type: 'exercise_count', target: 3 }
  
  reward_points INTEGER,
  reward_badge_id UUID REFERENCES badges(id),
  
  start_date DATE,
  end_date DATE,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: user_challenges

```sql
CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  challenge_id UUID NOT NULL REFERENCES challenges(id),
  
  progress JSONB,
  -- { current: 2, target: 3 }
  
  status VARCHAR(20) DEFAULT 'active',
  -- 'active' | 'completed' | 'expired'
  
  completed_at TIMESTAMP,
  
  UNIQUE(user_id, challenge_id)
);
```

---

## API Endpoints

### GET /api/gamification/points

Get user points and transactions

### POST /api/gamification/points/earn

Award points (internal)

### GET /api/leaderboards

Get leaderboard

**Query**: `?scope=global&period=monthly`

### GET /api/challenges

Get active challenges

### POST /api/challenges/:id/claim

Claim challenge reward

---

## Kết thúc Module Gamification

Tích hợp với Module 12 (Achievements), Module 02 (Practice), Module 19 (Statistics).
