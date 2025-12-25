// Shared course configurations for VSTEP courses
export const courseConfigs: Record<string, { sessions: number, titles: string[] }> = {
  'VSTEP Complete': {
    sessions: 10,
    titles: [
      'Giới thiệu & Từ vựng cơ bản',
      'Reading Skills - Skimming & Scanning',
      'Listening - Note Taking & Multiple Choice',
      'Writing Task 1 - Describing Data',
      'Speaking Part 1 & 2 - Introduction',
      'Reading - True/False & Matching',
      'Listening - Gap Fill & Diagram',
      'Writing Task 2 - Opinion Essay',
      'Speaking Part 3 - Discussion',
      'Final Practice Test - 4 Skills',
    ]
  },
  'VSTEP Intensive': {
    sessions: 8,
    titles: [
      'Vocabulary & Grammar Intensive',
      'Reading Speed Techniques',
      'Listening Comprehension Focus',
      'Writing Task 1 Intensive',
      'Speaking Fluency Practice',
      'Writing Task 2 Intensive',
      'Speaking Advanced Topics',
      'Full Mock Test - All Skills',
    ]
  },
  'VSTEP Practice': {
    sessions: 15,
    titles: [
      'Foundation Review',
      'Reading Part 1 Practice',
      'Listening Part 1 Practice',
      'Basic Writing Skills',
      'Basic Speaking Skills',
      'Reading Part 2 Practice',
      'Listening Part 2 Practice',
      'Writing Task 1 Focus',
      'Speaking Part 1-2 Focus',
      'Reading Part 3 Practice',
      'Listening Part 3 Practice',
      'Writing Task 2 Focus',
      'Speaking Part 3 Focus',
      'Mock Test 1',
      'Mock Test 2 & Review',
    ]
  },
  'VSTEP Foundation': {
    sessions: 20,
    titles: Array.from({ length: 20 }, (_, i) => {
      if (i < 4) return `Foundation Grammar ${i + 1}`;
      if (i < 8) return `Basic Vocabulary ${i - 3}`;
      if (i < 12) return `Reading Basics ${i - 7}`;
      if (i < 16) return `Listening Basics ${i - 11}`;
      if (i < 18) return `Writing Basics ${i - 15}`;
      return i === 18 ? 'Speaking Basics' : 'Foundation Review Test';
    })
  },
  'VSTEP Starter': {
    sessions: 6,
    titles: [
      'Introduction to VSTEP',
      'Reading & Listening Overview',
      'Writing Basics',
      'Speaking Basics',
      'Practice Session',
      'Mini Test & Review',
    ]
  },
  'VSTEP Builder': {
    sessions: 12,
    titles: [
      'Building Reading Skills 1',
      'Building Listening Skills 1',
      'Building Writing Skills 1',
      'Building Speaking Skills 1',
      'Reading Intermediate 1',
      'Listening Intermediate 1',
      'Writing Intermediate 1',
      'Speaking Intermediate 1',
      'Reading Intermediate 2',
      'Listening Intermediate 2',
      'Writing & Speaking Review',
      'Builder Mock Test',
    ]
  },
  'VSTEP Developer': {
    sessions: 16,
    titles: Array.from({ length: 16 }, (_, i) => {
      const cycle = i % 4;
      const round = Math.floor(i / 4) + 1;
      const skills = ['Reading', 'Listening', 'Writing', 'Speaking'];
      return i === 15 ? 'Developer Final Test' : `${skills[cycle]} Development ${round}`;
    })
  },
  'VSTEP Booster': {
    sessions: 4,
    titles: [
      'Quick Reading & Listening Boost',
      'Writing Power Session',
      'Speaking Confidence Boost',
      'Rapid Mock Test',
    ]
  },
  'VSTEP Premium': {
    sessions: 24,
    titles: Array.from({ length: 24 }, (_, i) => {
      if (i < 6) return `Premium Reading ${i + 1}`;
      if (i < 12) return `Premium Listening ${i - 5}`;
      if (i < 18) return `Premium Writing ${i - 11}`;
      if (i < 23) return `Premium Speaking ${i - 17}`;
      return 'Premium Final Assessment';
    })
  },
  'VSTEP Master': {
    sessions: 30,
    titles: Array.from({ length: 30 }, (_, i) => {
      if (i < 8) return `Master Reading ${i + 1}`;
      if (i < 16) return `Master Listening ${i - 7}`;
      if (i < 24) return `Master Writing ${i - 15}`;
      if (i < 29) return `Master Speaking ${i - 23}`;
      return 'Master Comprehensive Test';
    })
  }
};

export const getSessionTitle = (courseName: string, session: number): string => {
  const config = courseConfigs[courseName];
  if (!config) return `Buổi ${session}`;
  return config.titles[session - 1] || `Buổi ${session}`;
};
