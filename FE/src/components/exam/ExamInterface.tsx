import { useState, useEffect } from 'react';
import { User, Play, Pause, Mic, ArrowLeft } from 'lucide-react';
import { mockReadingData } from './ReadingData';
import { mockWritingData } from './WritingData';
import { mockSpeakingData } from './SpeakingData';
import { SpeakingPreparationModal } from './SpeakingPreparationModal';
import { IncompletePartModal } from './IncompletePartModal';
import { SkillTransitionModal } from './SkillTransitionModal';
import { RecordingCountdownModal } from './RecordingCountdownModal';
import { TransitionCountdownModal } from './TransitionCountdownModal';
import { PreparationTimer } from './PreparationTimer';
import { AudioLevelMeter } from './AudioLevelMeter';

interface ExamInterfaceProps {
  examId?: string;
  examTitle?: string;
  studentName?: string;
  duration?: number;
  skills?: string[];
  onBack: () => void;
}

// Mock data cho bài thi Listening
const mockListeningData = {
  directions: `Directions: This is the listening test for levels from 3 to 5 of the Vietnam's 6-level Language Proficiency Test. There are three parts to the test. You will hear each part once. For each part of the test there will be time for you to look through the questions and time for you to check your answers. Write your answers on the question paper. You will have 5 minutes at the end of the test to transfer your answers onto the answer sheet.`,
  parts: [
    {
      id: 'L1',
      title: 'PART 1',
      instruction: 'There are eight questions in this part. For each question there are four options and a short recording. For each question, choose the correct answer A, B, C or D. You now have 48 seconds to look through the questions and the options in each question.',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      audioLabel: 'Audio cho câu 1-8',
      questions: [
        {
          id: 1,
          question: "When is the man's appointment?",
          options: ['Friday', 'Wednesday', 'Thursday', 'Tuesday'],
        },
        {
          id: 2,
          question: "Which is the aunt's postcard?",
          options: [
            'a pretty village',
            'a pretty village right by a river',
            'a pretty village in the mountains',
            'a pretty village behind the tall trees',
          ],
        },
        {
          id: 3,
          question: 'What time will the plane to Milan leave?',
          options: ['08:15', '06:15', '01:00', '09:30'],
        },
        {
          id: 4,
          question: 'What did the woman buy?',
          options: ['A shirt', 'A dress', 'Shoes', 'A bag'],
        },
        {
          id: 5,
          question: 'Where does the conversation take place?',
          options: ['At a bank', 'At a restaurant', 'At a hotel', 'At a hospital'],
        },
        {
          id: 6,
          question: 'What is the weather like?',
          options: ['Sunny', 'Rainy', 'Cloudy', 'Snowy'],
        },
        {
          id: 7,
          question: 'How much does the ticket cost?',
          options: ['$10', '$15', '$20', '$25'],
        },
        {
          id: 8,
          question: 'What is the man doing?',
          options: ['Reading', 'Cooking', 'Watching TV', 'Sleeping'],
        },
      ],
    },
    {
      id: 'L2',
      title: 'PART 2',
      instruction: 'You will hear three different conversations. For questions 9-20, choose the correct answer A, B, C or D.',
      sections: [
        {
          title: 'Conversation 1',
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          audioLabel: 'Audio cho câu 9-12',
          questions: [
            {
              id: 9,
              question: 'What is the main topic of the conversation?',
              options: ['Travel plans', 'Work projects', 'Family matters', 'Health issues'],
            },
            {
              id: 10,
              question: 'How does the woman feel about the situation?',
              options: ['Excited', 'Worried', 'Angry', 'Confused'],
            },
            {
              id: 11,
              question: 'What does the man suggest?',
              options: ['Waiting a few days', 'Calling immediately', 'Writing an email', 'Visiting in person'],
            },
            {
              id: 12,
              question: 'When will they meet again?',
              options: ['Tomorrow morning', 'Next week', 'This afternoon', 'Next month'],
            },
          ],
        },
        {
          title: 'Conversation 2',
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          audioLabel: 'Audio cho câu 13-16',
          questions: [
            {
              id: 13,
              question: 'What is the relationship between the speakers?',
              options: ['Colleagues', 'Friends', 'Family members', 'Teacher and student'],
            },
            {
              id: 14,
              question: 'What do they agree to do?',
              options: ['Cancel the plan', 'Postpone the meeting', 'Continue as planned', 'Ask for help'],
            },
            {
              id: 15,
              question: 'Where are they going?',
              options: ['To a restaurant', 'To a cinema', 'To a park', 'To a museum'],
            },
            {
              id: 16,
              question: 'What time will they arrive?',
              options: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
            },
          ],
        },
        {
          title: 'Conversation 3',
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
          audioLabel: 'Audio cho câu 17-20',
          questions: [
            {
              id: 17,
              question: 'Why is the woman calling?',
              options: ['To make a complaint', 'To ask for information', 'To make a reservation', 'To cancel an order'],
            },
            {
              id: 18,
              question: 'What problem does she mention?',
              options: ['Late delivery', 'Wrong item', 'Poor quality', 'High price'],
            },
            {
              id: 19,
              question: 'How does the man respond?',
              options: ['He apologizes', 'He argues', 'He ignores', 'He transfers the call'],
            },
            {
              id: 20,
              question: 'What is the final solution?',
              options: ['Full refund', 'Replacement', 'Discount', 'Store credit'],
            },
          ],
        },
      ],
    },
    {
      id: 'L3',
      title: 'PART 3',
      instruction: 'You will hear three different talks or lectures. For questions 21-35, choose the correct answer A, B, C or D.',
      sections: [
        {
          title: 'Talk 1',
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
          audioLabel: 'Audio cho câu 21-25',
          questions: [
            {
              id: 21,
              question: 'What is the lecture mainly about?',
              options: ['Climate change', 'Technology advances', 'Historical events', 'Economic trends'],
            },
            {
              id: 22,
              question: 'According to the speaker, what is the main problem?',
              options: ['Lack of funding', 'Poor communication', 'Limited resources', 'Time constraints'],
            },
            {
              id: 23,
              question: 'What example does the speaker give?',
              options: ['A recent study', 'A historical event', 'A personal experience', 'A famous person'],
            },
            {
              id: 24,
              question: 'What does the speaker recommend?',
              options: ['More research', 'Immediate action', 'Careful planning', 'Public awareness'],
            },
            {
              id: 25,
              question: 'What is the speaker\'s opinion?',
              options: ['Optimistic', 'Pessimistic', 'Neutral', 'Critical'],
            },
          ],
        },
        {
          title: 'Talk 2',
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
          audioLabel: 'Audio cho câu 26-30',
          questions: [
            {
              id: 26,
              question: 'What is the main purpose of this talk?',
              options: ['To inform', 'To persuade', 'To entertain', 'To warn'],
            },
            {
              id: 27,
              question: 'Who is the target audience?',
              options: ['Students', 'Professionals', 'General public', 'Researchers'],
            },
            {
              id: 28,
              question: 'What data does the speaker present?',
              options: ['Survey results', 'Statistical analysis', 'Case studies', 'Expert opinions'],
            },
            {
              id: 29,
              question: 'What conclusion does the speaker draw?',
              options: ['More study needed', 'Clear evidence found', 'Mixed results', 'Unexpected findings'],
            },
            {
              id: 30,
              question: 'What will happen next?',
              options: ['Q&A session', 'Break time', 'Group discussion', 'Written test'],
            },
          ],
        },
        {
          title: 'Talk 3',
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
          audioLabel: 'Audio cho câu 31-35',
          questions: [
            {
              id: 31,
              question: 'What field does this lecture cover?',
              options: ['Science', 'Arts', 'Business', 'Education'],
            },
            {
              id: 32,
              question: 'What recent development is mentioned?',
              options: ['New discovery', 'Policy change', 'Technology update', 'Market shift'],
            },
            {
              id: 33,
              question: 'What challenge does the speaker highlight?',
              options: ['Financial issues', 'Technical difficulties', 'Social resistance', 'Environmental concerns'],
            },
            {
              id: 34,
              question: 'What benefit is emphasized?',
              options: ['Cost savings', 'Time efficiency', 'Better quality', 'Wider access'],
            },
            {
              id: 35,
              question: 'What does the speaker suggest for the future?',
              options: ['Continue current approach', 'Try new methods', 'Seek collaboration', 'Wait for more data'],
            },
          ],
        },
      ],
    },
  ],
};

export function ExamInterface({ examId, examTitle, studentName = 'Học viên', duration, skills, onBack }: ExamInterfaceProps) {
  const [currentPartId, setCurrentPartId] = useState('L1'); // Track current part ID
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [writingTexts, setWritingTexts] = useState<Record<string, string>>({});
  
  // Skill-based timers (in seconds)
  const [listeningTimeLeft, setListeningTimeLeft] = useState(45 * 60); // 45 minutes
  const [readingTimeLeft, setReadingTimeLeft] = useState(60 * 60); // 60 minutes
  const [writingTimeLeft, setWritingTimeLeft] = useState(60 * 60); // 60 minutes
  const [speakingTimeLeftState, setSpeakingTimeLeftState] = useState(12 * 60); // 12 minutes
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState({ current: 0, total: 0 });
  
  // Speaking specific states
  const [showPreparationModal, setShowPreparationModal] = useState(false);
  const [preparationTimeLeft, setPreparationTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSpeakingPhase, setCurrentSpeakingPhase] = useState<'prepare' | 'respond' | 'idle'>('idle');
  const [hasShownPreparationModal, setHasShownPreparationModal] = useState(false);

  // Speaking Part 1 auto-recording states
  const [audioPlaybackFinished, setAudioPlaybackFinished] = useState(false);
  const [showRecordingCountdown, setShowRecordingCountdown] = useState(false);
  const [recordingCountdown, setRecordingCountdown] = useState(3);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [hasCompletedRecording, setHasCompletedRecording] = useState(false);
  const [showTransitionCountdown, setShowTransitionCountdown] = useState(false); // 3s transition after Part 1 recording
  const [transitionCountdown, setTransitionCountdown] = useState(3); // 3s countdown
  const [preparationCountdown, setPreparationCountdown] = useState(60); // For Part 2 & 3

  // Incomplete part modal state
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [pendingNextPartId, setPendingNextPartId] = useState<string | null>(null);

  // Skill transition modal state
  const [showSkillTransitionModal, setShowSkillTransitionModal] = useState(false);
  const [nextSkill, setNextSkill] = useState<string | null>(null);

  // Track completed skills (cannot go back after moving to next skill)
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);

  // Skill-based Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentPartId.startsWith('L')) {
        setListeningTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (currentPartId.startsWith('R')) {
        setReadingTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (currentPartId.startsWith('W')) {
        setWritingTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (currentPartId.startsWith('S')) {
        setSpeakingTimeLeftState((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPartId]);

  // Preparation modal countdown timer
  useEffect(() => {
    if (showPreparationModal && preparationTimeLeft > 0) {
      const timer = setInterval(() => {
        setPreparationTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showPreparationModal, preparationTimeLeft]);

  // Show preparation modal when entering Speaking for the first time
  useEffect(() => {
    if (currentPartId.startsWith('S') && !hasShownPreparationModal) {
      setShowPreparationModal(true);
      setPreparationTimeLeft(60); // Changed back to 60s
      setHasShownPreparationModal(true);
    }
  }, [currentPartId, hasShownPreparationModal]);

  const handlePreparationComplete = () => {
    setShowPreparationModal(false);
    // Start auto-playing audio for all Speaking Parts
    if (currentPartId.startsWith('S')) {
      console.log('Starting audio playback for', currentPartId);
      // Simulate 12s audio playback
      setAudioTime({ current: 0, total: 12 });
      setIsPlaying(true);
      
      // Simulate audio progress
      let currentTime = 0;
      const audioInterval = setInterval(() => {
        currentTime += 1;
        setAudioTime({ current: currentTime, total: 12 });
        console.log('Audio progress:', currentTime, '/', 12);
        
        if (currentTime >= 12) {
          clearInterval(audioInterval);
          console.log('Audio finished for', currentPartId, ', starting countdown...');
          setIsPlaying(false);
          setAudioPlaybackFinished(true);
          setShowRecordingCountdown(true);
          
          // Set countdown based on part
          if (currentPartId === 'S1') {
            console.log('Part 1: Setting countdown to 3s');
            setRecordingCountdown(3); // Part 1: 3 seconds
          } else {
            console.log('Part 2/3: Setting countdown to 60s');
            setRecordingCountdown(60); // Part 2 & 3: 60 seconds
          }
        }
      }, 1000);
    }
  };

  // Recording countdown timer (3s for Part 1, 60s for Part 2 & 3)
  useEffect(() => {
    console.log('Countdown state:', { showRecordingCountdown, recordingCountdown, currentPartId });
    
    if (showRecordingCountdown && recordingCountdown > 0) {
      const timer = setTimeout(() => {
        setRecordingCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (showRecordingCountdown && recordingCountdown === 0) {
      setShowRecordingCountdown(false);
      
      // All parts: Start recording 3 minutes after countdown
      console.log(`${currentPartId}: Countdown finished, starting recording!`);
      setIsRecording(true);
      setRecordingTimeLeft(180); // 3 minutes for all parts
    }
  }, [showRecordingCountdown, recordingCountdown, currentPartId]);

  // Recording timer (3 minutes countdown for all parts)
  useEffect(() => {
    if (isRecording && recordingTimeLeft > 0) {
      const timer = setInterval(() => {
        setRecordingTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRecording(false);
            setHasCompletedRecording(true);
            
            // Auto-advance based on current part
            if (currentPartId === 'S1') {
              console.log('Part 1 recording finished, showing transition countdown 3s');
              // Show transition countdown modal for 3s
              setShowTransitionCountdown(true);
              setTransitionCountdown(3);
            } else if (currentPartId === 'S2') {
              console.log('Part 2 recording finished, auto-advancing to Part 3');
              setTimeout(() => {
                setCurrentPartId('S3');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 500);
            } else if (currentPartId === 'S3') {
              console.log('Part 3 recording finished, Speaking complete!');
              // Speaking finished - can show completion message
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRecording, recordingTimeLeft, currentPartId]);

  // Reset speaking states when changing parts
  useEffect(() => {
    if (currentPartId.startsWith('S')) {
      setAudioPlaybackFinished(false);
      setShowRecordingCountdown(false);
      setRecordingCountdown(3);
      setRecordingTimeLeft(180);
      setIsRecording(false);
      setHasCompletedRecording(false);
      setShowTransitionCountdown(false);
      
      // For Part 2 & 3: Auto-start audio without preparation modal
      if (currentPartId === 'S2' || currentPartId === 'S3') {
        console.log(`${currentPartId}: Auto-starting audio playback (no preparation modal)...`);
        setTimeout(() => {
          handlePreparationComplete();
        }, 500); // Small delay to ensure component is mounted
      }
    }
  }, [currentPartId]);

  // Transition countdown timer (3s for Part 1 after recording)
  useEffect(() => {
    if (showTransitionCountdown && transitionCountdown > 0) {
      const timer = setTimeout(() => {
        setTransitionCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (showTransitionCountdown && transitionCountdown === 0) {
      console.log('Transition complete, advancing to Part 2');
      setShowTransitionCountdown(false);
      setCurrentPartId('S2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showTransitionCountdown, transitionCountdown]);

  // Preparation countdown timer (60s for Part 2 & 3)
  useEffect(() => {
    if ((currentPartId === 'S2' || currentPartId === 'S3') && preparationCountdown > 0 && preparationCountdown < 60) {
      const timer = setInterval(() => {
        setPreparationCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            
            // Auto-advance to next part
            if (currentPartId === 'S2') {
              console.log('Part 2 preparation finished, auto-advancing to Part 3');
              setTimeout(() => {
                setCurrentPartId('S3');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 500);
            } else if (currentPartId === 'S3') {
              console.log('Part 3 preparation finished, Speaking complete!');
              setHasCompletedRecording(true);
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPartId, preparationCountdown]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleWritingText = (questionId: string, text: string) => {
    setWritingTexts((prev) => ({ ...prev, [questionId]: text }));
  };

  const currentPartData = mockListeningData.parts.find((p) => p.id === currentPartId);
  const currentReadingPartData = mockReadingData.parts.find((p) => p.id === currentPartId);
  const currentWritingPartData = mockWritingData.parts.find((p) => p.id === currentPartId);
  const currentSpeakingPartData = mockSpeakingData.parts.find((p) => p.id === currentPartId);
  
  // Determine if current part is Reading
  const isReadingPart = currentPartId.startsWith('R');
  
  // Determine if current part is Writing
  const isWritingPart = currentPartId.startsWith('W');
  
  // Determine if current part is Speaking
  const isSpeakingPart = currentPartId.startsWith('S');

  // Get current skill's time left
  const getCurrentSkillTimeLeft = () => {
    if (currentPartId.startsWith('L')) return listeningTimeLeft;
    if (currentPartId.startsWith('R')) return readingTimeLeft;
    if (currentPartId.startsWith('W')) return writingTimeLeft;
    if (currentPartId.startsWith('S')) return speakingTimeLeftState;
    return 0;
  };

  const currentSkillTime = getCurrentSkillTimeLeft();

  // Get current part's questions for incomplete check
  const getCurrentPartQuestionCount = () => {
    if (currentPartId.startsWith('L')) {
      const part = mockListeningData.parts.find(p => p.id === currentPartId);
      if (!part) return 0;
      if ('questions' in part && part.questions) {
        return part.questions.length;
      } else if ('sections' in part && part.sections) {
        return part.sections.reduce((sum, section) => sum + section.questions.length, 0);
      }
    } else if (currentPartId.startsWith('R')) {
      const part = mockReadingData.parts.find(p => p.id === currentPartId);
      if (!part) return 0;
      return part.passages.reduce((sum, passage) => sum + passage.questions.length, 0);
    } else if (currentPartId.startsWith('W')) {
      // Writing doesn't use this check
      return 0;
    } else if (currentPartId.startsWith('S')) {
      // Speaking doesn't use this check
      return 0;
    }
    return 0;
  };

  // Get current part's answered questions
  const getCurrentPartAnsweredCount = () => {
    if (currentPartId.startsWith('L')) {
      const part = mockListeningData.parts.find(p => p.id === currentPartId);
      if (!part) return 0;
      
      let questionIds: number[] = [];
      if ('questions' in part && part.questions) {
        questionIds = part.questions.map(q => q.id);
      } else if ('sections' in part && part.sections) {
        questionIds = part.sections.flatMap(section => section.questions.map(q => q.id));
      }
      
      return questionIds.filter(id => answers[id]).length;
    } else if (currentPartId.startsWith('R')) {
      const part = mockReadingData.parts.find(p => p.id === currentPartId);
      if (!part) return 0;
      
      const questionIds = part.passages.flatMap(passage => passage.questions.map(q => q.id));
      return questionIds.filter(id => answers[id]).length;
    }
    return 0;
  };
  
  // Calculate total questions across all parts (Listening + Reading + Writing)
  const totalListeningQuestions = mockListeningData.parts.reduce((sum, part) => {
    if ('sections' in part) {
      return sum + part.sections.reduce((sectionSum, section) => sectionSum + section.questions.length, 0);
    }
    return sum + part.questions.length;
  }, 0);
  
  const totalReadingQuestions = mockReadingData.parts.reduce((sum, part) => {
    return sum + part.passages.reduce((passageSum, passage) => passageSum + passage.questions.length, 0);
  }, 0);
  
  // Writing has 2 parts (essays), count as 2 "questions" for tracking
  const totalWritingParts = mockWritingData.parts.length;
  
  const totalQuestions = totalListeningQuestions + totalReadingQuestions + totalWritingParts;
  
  const answeredCount = Object.keys(answers).length;

  // Get current part's question count and answered count for display
  const currentPartTotalQuestions = getCurrentPartQuestionCount();
  const currentPartAnswered = getCurrentPartAnsweredCount();

  // Navigation structure for all skills
  const skillSections = [
    {
      skill: 'listening',
      label: 'Listening - 45',
      parts: [
        { id: 'L1', label: 'PART 1' },
        { id: 'L2', label: 'PART 2' },
        { id: 'L3', label: 'PART 3' },
      ],
      bgColor: 'bg-gray-700',
    },
    {
      skill: 'reading',
      label: 'Reading - 60',
      parts: [
        { id: 'R1', label: 'PART 1' },
        { id: 'R2', label: 'PART 2' },
        { id: 'R3', label: 'PART 3' },
        { id: 'R4', label: 'PART 4' },
      ],
      bgColor: 'bg-gray-600',
    },
    {
      skill: 'writing',
      label: 'Writing - 60',
      parts: [
        { id: 'W1', label: 'PART 1' },
        { id: 'W2', label: 'PART 2' },
      ],
      bgColor: 'bg-gray-700',
    },
    {
      skill: 'speaking',
      label: 'Speaking - 12',
      parts: [
        { id: 'S1', label: 'PART 1' },
        { id: 'S2', label: 'PART 2' },
        { id: 'S3', label: 'PART 3' },
      ],
      bgColor: 'bg-gray-600',
    },
  ];

  // Get all part IDs in order
  const allPartIds = skillSections.flatMap((section) => section.parts.map((part) => part.id));

  // Get skill name from part ID
  const getSkillFromPartId = (partId: string): string => {
    const section = skillSections.find(s => s.parts.some(p => p.id === partId));
    return section?.skill || '';
  };

  // Handle next part navigation
  const handleNextPart = () => {
    const currentPartQuestionCount = getCurrentPartQuestionCount();
    const currentPartAnsweredCount = getCurrentPartAnsweredCount();
    
    // Check if current part has unanswered questions (only for Listening and Reading)
    if ((currentPartId.startsWith('L') || currentPartId.startsWith('R')) && 
        currentPartAnsweredCount < currentPartQuestionCount) {
      // Show incomplete modal
      const currentIndex = allPartIds.indexOf(currentPartId);
      if (currentIndex < allPartIds.length - 1) {
        setPendingNextPartId(allPartIds[currentIndex + 1]);
        setShowIncompleteModal(true);
      }
      return;
    }
    
    // If all questions answered or Writing/Speaking, proceed to check skill transition
    const currentIndex = allPartIds.indexOf(currentPartId);
    if (currentIndex < allPartIds.length - 1) {
      const nextPartId = allPartIds[currentIndex + 1];
      const currentSkill = getSkillFromPartId(currentPartId);
      const nextSkillName = getSkillFromPartId(nextPartId);
      
      // Check if transitioning to a different skill
      if (currentSkill !== nextSkillName) {
        setPendingNextPartId(nextPartId);
        setNextSkill(nextSkillName);
        setShowSkillTransitionModal(true);
      } else {
        // Same skill, just change part
        setCurrentPartId(nextPartId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Last part - submit exam
      alert('Bạn đã hoàn thành tất cả các phần! Hãy nộp bài.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Header - Blue bar with student info, timer, and submit */}
      <div className="bg-blue-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={() => {
              if (confirm('Bạn có chắc muốn thoát khỏi bài thi? Tiến trình sẽ không được lưu.')) {
                onBack();
              }
            }}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
            title="Quay lại Trang chủ"
          >
            <ArrowLeft className="size-5" />
          </button>
          
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <User className="size-6 text-blue-900" />
          </div>
          <span className="text-sm">{studentName}</span>
        </div>

        {/* Center: Skill Timer and Question Count */}
        <div className="flex items-center gap-6">
          {/* Flip-style Timer (current skill time) - hide completely when in Speaking */}
          {!isSpeakingPart && (
            <div className="flex items-center gap-1">
              {/* Minutes tens */}
              <div className="w-10 h-12 bg-gradient-to-b from-orange-500 to-orange-600 rounded flex items-center justify-center shadow-lg border-2 border-orange-700">
                <span className="text-2xl tabular-nums">{Math.floor(currentSkillTime / 60 / 10)}</span>
              </div>
              {/* Minutes ones */}
              <div className="w-10 h-12 bg-gradient-to-b from-orange-500 to-orange-600 rounded flex items-center justify-center shadow-lg border-2 border-orange-700">
                <span className="text-2xl tabular-nums">{Math.floor(currentSkillTime / 60) % 10}</span>
              </div>
              
              <span className="text-2xl mx-1">:</span>
              
              {/* Seconds tens */}
              <div className="w-10 h-12 bg-gradient-to-b from-orange-500 to-orange-600 rounded flex items-center justify-center shadow-lg border-2 border-orange-700">
                <span className="text-2xl tabular-nums">{Math.floor((currentSkillTime % 60) / 10)}</span>
              </div>
              {/* Seconds ones */}
              <div className="w-10 h-12 bg-gradient-to-b from-orange-500 to-orange-600 rounded flex items-center justify-center shadow-lg border-2 border-orange-700">
                <span className="text-2xl tabular-nums">{(currentSkillTime % 60) % 10}</span>
              </div>
            </div>
          )}

          {/* Recording Timer - ONLY show when recording Speaking */}
          {isRecording && isSpeakingPart && (
            <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg border-2 border-red-800 animate-pulse">
              <Mic className="size-4" />
              <span className="text-sm">Recording:</span>
              <span className="text-xl tabular-nums">{formatTime(recordingTimeLeft)}</span>
            </div>
          )}

          {/* Question Count - Show for Listening and Reading, based on CURRENT PART */}
          {!isSpeakingPart && !isWritingPart && (
            <div className="bg-white text-blue-900 px-4 py-2 rounded-lg border-2 border-blue-300 shadow">
              <span className="text-sm">
                Đã chọn: <span className="font-semibold">{currentPartAnswered}</span> / <span className="font-semibold">{currentPartTotalQuestions}</span> câu
              </span>
            </div>
          )}
        </div>

        <button className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors">
          NỘP BÀI
        </button>
      </div>

      {/* Audio Level Meter with Warning - Show when recording Speaking (Sticky) */}
      {isRecording && isSpeakingPart && (
        <div className="sticky top-12 z-40 bg-blue-900 px-6 py-2 border-b border-blue-800 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <AudioLevelMeter isRecording={isRecording} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* LISTENING CONTENT */}
          {!isReadingPart && !isWritingPart && !isSpeakingPart && (
            <>
              {/* Directions */}
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <p className="text-sm leading-relaxed text-gray-700">{mockListeningData.directions}</p>
              </div>

              {/* Part Title and Instructions */}
              {currentPartData && (
                <>
                  <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                    <h3 className="text-center mb-3">{currentPartData.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-700">{currentPartData.instruction}</p>
                  </div>

                  {/* Audio Player - Only show for Part 1 (questions type) */}
                  {'questions' in currentPartData && (
                    <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-4 mb-6 shadow-lg border-4 border-red-600">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-12 h-12 bg-purple-900 rounded flex items-center justify-center hover:bg-purple-950 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="size-6 text-white fill-white" />
                          ) : (
                            <Play className="size-6 text-white fill-white ml-1" />
                          )}
                        </button>
                        <div className="flex-1 flex items-center justify-between text-white">
                          <span className="text-lg tabular-nums">{formatTime(audioTime.current)}</span>
                          <div className="flex-1 mx-6 h-2 bg-black rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white transition-all"
                              style={{
                                width:
                                  audioTime.total > 0 ? `${(audioTime.current / audioTime.total) * 100}%` : '0%',
                              }}
                            />
                          </div>
                          <span className="text-lg tabular-nums">{formatTime(audioTime.total)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  <div className="bg-white rounded-lg p-6 shadow-sm space-y-8">
                    {/* Part 1: Simple list of questions with single audio */}
                    {'questions' in currentPartData && currentPartData.questions.map((q, index) => (
                      <div key={q.id}>
                        <p className="mb-3">{q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((option, optIndex) => {
                            const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D
                            return (
                              <label
                                key={optIndex}
                                className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={answers[q.id] === optionLetter}
                                  onChange={() => handleAnswer(q.id, optionLetter)}
                                  className="mt-1"
                                />
                                <span className="text-gray-700">
                                  <span>{optionLetter}.</span> {option}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Part 2 & 3: Multiple sections with separate audio players */}
                    {'sections' in currentPartData && currentPartData.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border-t-2 border-gray-200 pt-6 first:border-t-0 first:pt-0">
                        <h4 className="mb-4">{section.title}</h4>
                        
                        {/* Audio player for this section */}
                        <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-4 mb-6 shadow-lg border-4 border-red-600">
                          <div className="text-white text-xs mb-2">{section.audioLabel}</div>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="w-12 h-12 bg-purple-900 rounded flex items-center justify-center hover:bg-purple-950 transition-colors"
                            >
                              {isPlaying ? (
                                <Pause className="size-6 text-white fill-white" />
                              ) : (
                                <Play className="size-6 text-white fill-white ml-1" />
                              )}
                            </button>
                            <div className="flex-1 flex items-center justify-between text-white">
                              <span className="text-lg tabular-nums">{formatTime(audioTime.current)}</span>
                              <div className="flex-1 mx-6 h-2 bg-black rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-white transition-all"
                                  style={{
                                    width:
                                      audioTime.total > 0 ? `${(audioTime.current / audioTime.total) * 100}%` : '0%',
                                  }}
                                />
                              </div>
                              <span className="text-lg tabular-nums">{formatTime(audioTime.total)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Questions for this section */}
                        <div className="space-y-6">
                          {section.questions.map((q, qIndex) => (
                            <div key={q.id}>
                              <p className="mb-3">{q.question}</p>
                              <div className="space-y-2">
                                {q.options.map((option, optIndex) => {
                                  const optionLetter = String.fromCharCode(65 + optIndex);
                                  return (
                                    <label
                                      key={optIndex}
                                      className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        checked={answers[q.id] === optionLetter}
                                        onChange={() => handleAnswer(q.id, optionLetter)}
                                        className="mt-1"
                                      />
                                      <span className="text-gray-700">
                                        <span>{optionLetter}.</span> {option}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* READING CONTENT - 2 Column Layout */}
          {isReadingPart && currentReadingPartData && (
            <>
              {/* Directions */}
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <p className="text-sm leading-relaxed text-gray-700">{mockReadingData.directions}</p>
              </div>

              {/* Part Title and Instructions */}
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <h3 className="text-center mb-3">{currentReadingPartData.title}</h3>
                <p className="text-sm leading-relaxed text-gray-700">{currentReadingPartData.instruction}</p>
              </div>

              {/* 2 Column Layout: Passage(s) left, Questions right */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column - Reading Passages */}
                <div className="bg-white rounded-lg p-6 shadow-sm overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                  {currentReadingPartData.passages.map((passage, passageIndex) => (
                    <div key={passageIndex} className={passageIndex > 0 ? 'mt-8 pt-8 border-t-2 border-gray-200' : ''}>
                      {currentReadingPartData.passages.length > 1 && (
                        <h4 className="mb-3">{passage.title}</h4>
                      )}
                      {currentReadingPartData.passages.length === 1 && passage.title && (
                        <h4 className="mb-3">{passage.title}</h4>
                      )}
                      <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                        {passage.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column - Questions */}
                <div className="bg-white rounded-lg p-6 shadow-sm overflow-y-auto space-y-6" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                  {currentReadingPartData.passages.map((passage) =>
                    passage.questions.map((q) => (
                      <div key={q.id}>
                        <p className="mb-3">
                          <span>{q.id}.</span> {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((option, optIndex) => {
                            const optionLetter = String.fromCharCode(65 + optIndex);
                            return (
                              <label
                                key={optIndex}
                                className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={answers[q.id] === optionLetter}
                                  onChange={() => handleAnswer(q.id, optionLetter)}
                                  className="mt-1"
                                />
                                <span className="text-gray-700">
                                  <span>{optionLetter}.</span> {option}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* WRITING CONTENT */}
          {isWritingPart && currentWritingPartData && (
            <>
              {/* Directions */}
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <p className="text-sm leading-relaxed text-gray-700">{mockWritingData.directions}</p>
              </div>

              {/* Task and Requirements */}
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm space-y-4">
                <p className="text-sm text-gray-700">{currentWritingPartData.timeRecommendation}</p>
                
                <p className="text-sm text-gray-700">{currentWritingPartData.instruction}</p>
                
                {/* Prompt Box */}
                <div className="border-2 border-gray-300 p-4 bg-gray-50 rounded">
                  <p className="text-sm leading-relaxed text-gray-700 italic">
                    {currentWritingPartData.prompt}
                  </p>
                </div>
                
                <p className="text-sm text-gray-700">{currentWritingPartData.task}</p>
                
                <p className="text-sm text-gray-700">{currentWritingPartData.requirements}</p>
              </div>

              {/* Writing Text Area with Word Count */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="relative">
                  <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Word count: {(writingTexts[currentWritingPartData.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length}
                  </div>
                  <textarea
                    value={writingTexts[currentWritingPartData.id] || ''}
                    onChange={(e) => handleWritingText(currentWritingPartData.id, e.target.value)}
                    placeholder="Write your answer here..."
                    className="w-full h-[500px] p-4 pt-12 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500 text-sm leading-relaxed"
                  />
                </div>
              </div>
            </>
          )}

          {/* SPEAKING CONTENT */}
          {isSpeakingPart && currentSpeakingPartData && (
            <>
              {/* Directions */}
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <p className="text-sm leading-relaxed text-gray-700">{mockSpeakingData.directions}</p>
              </div>

              {/* Part Title */}
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <h3 className="text-center">{currentSpeakingPartData.title}</h3>
              </div>

              {/* Audio Player - 12s instruction audio */}
              <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-4 mb-6 shadow-lg border-4 border-red-600">
                <div className="text-white text-xs mb-2">
                  {currentPartId === 'S1' && 'Social Interaction (3\')'}
                  {currentPartId === 'S2' && 'Solution Discussion (4\')'}
                  {currentPartId === 'S3' && 'Topic Development (5\')'}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-purple-900 rounded flex items-center justify-center hover:bg-purple-950 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="size-6 text-white fill-white" />
                    ) : (
                      <Play className="size-6 text-white fill-white ml-1" />
                    )}
                  </button>
                  <div className="flex-1 flex items-center justify-between text-white">
                    <span className="text-lg tabular-nums">{formatTime(audioTime.current)}</span>
                    <div className="flex-1 mx-6 h-2 bg-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all"
                        style={{
                          width:
                            audioTime.total > 0 ? `${(audioTime.current / audioTime.total) * 100}%` : '0%',
                        }}
                      />
                    </div>
                    <span className="text-lg tabular-nums">{formatTime(audioTime.total)}</span>
                  </div>
                </div>
              </div>



              {/* PART 1: Social Interaction */}
              {currentPartId === 'S1' && 'topics' in currentSpeakingPartData && (
                <div className="bg-white rounded-lg p-8 shadow-sm space-y-8">
                  {currentSpeakingPartData.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className={topicIndex > 0 ? 'border-t-2 border-gray-200 pt-8' : ''}>
                      <p className="mb-4 italic">{topic.title}</p>
                      <ol className="space-y-3 ml-6">
                        {topic.questions.map((question, qIndex) => (
                          <li key={qIndex} className="text-sm text-gray-700 leading-relaxed">
                            {question}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}

                </div>
              )}

              {/* PART 2: Solution Discussion */}
              {currentPartId === 'S2' && 'situation' in currentSpeakingPartData && 'options' in currentSpeakingPartData && (
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <p className="mb-2">
                    <strong>Situation:</strong> {currentSpeakingPartData.situation}
                  </p>
                  
                  {currentSpeakingPartData.note && (
                    <p className="mt-6 mb-3">{currentSpeakingPartData.note}</p>
                  )}
                  
                  <ul className="space-y-2 ml-6">
                    {currentSpeakingPartData.options.map((option, index) => (
                      <li key={index} className="text-sm text-gray-700 leading-relaxed">
                        - {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* PART 3: Topic Development */}
              {currentPartId === 'S3' && 'topic' in currentSpeakingPartData && 'mindMap' in currentSpeakingPartData && (
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <p className="mb-6">
                    <strong>Topic:</strong> {currentSpeakingPartData.topic}
                  </p>

                  {/* Mind Map Visual */}
                  {currentSpeakingPartData.mindMap && (
                    <div className="mb-8 p-6 border-2 border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex flex-col items-center gap-4">
                        {/* Top nodes */}
                        <div className="flex gap-8 justify-center">
                          <div className="border-2 border-gray-400 bg-white px-4 py-2 rounded text-sm">
                            {currentSpeakingPartData.mindMap.nodes[0]}
                          </div>
                        </div>
                        
                        {/* Connector line */}
                        <div className="w-px h-8 bg-gray-400"></div>
                        
                        {/* Center node */}
                        <div className="flex gap-8 items-center">
                          <div className="border-2 border-gray-400 bg-white px-4 py-2 rounded text-sm">
                            {currentSpeakingPartData.mindMap.nodes[1]}
                          </div>
                          
                          <div className="w-8 h-px bg-gray-400"></div>
                          
                          <div className="border-2 border-blue-600 bg-blue-50 px-6 py-3 rounded text-sm">
                            {currentSpeakingPartData.mindMap.center}
                          </div>
                          
                          <div className="w-8 h-px bg-gray-400"></div>
                          
                          <div className="border-2 border-gray-400 bg-white px-4 py-2 rounded text-sm">
                            {currentSpeakingPartData.mindMap.nodes[2]}
                          </div>
                        </div>
                        
                        {/* Connector line */}
                        <div className="w-px h-8 bg-gray-400"></div>
                        
                        {/* Bottom node */}
                        <div className="flex gap-8 justify-center">
                          <div className="border-2 border-gray-400 bg-white px-4 py-2 rounded text-sm">
                            {currentSpeakingPartData.mindMap.nodes[3]}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  {currentSpeakingPartData.questions && currentSpeakingPartData.questions.length > 0 && (
                    <div className="space-y-2">
                      {currentSpeakingPartData.questions.map((question, index) => (
                        <p key={index} className="text-sm text-gray-700 leading-relaxed">
                          - {question}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-gray-200 border-t-2 border-gray-300 px-6 py-3 flex items-center gap-4 sticky bottom-0 z-50 shadow-lg">
        <div className="flex items-stretch gap-0 flex-1 max-w-5xl">
          {skillSections.map((section, sectionIndex) => {
            const isSkillCompleted = completedSkills.includes(section.skill);
            
            return (
              <div key={section.skill} className={`${section.bgColor} flex flex-col items-stretch border-r-2 border-gray-900 flex-1`}>
                {/* Parts Row */}
                <div className="flex items-stretch">
                  {section.parts.map((part, partIndex) => (
                    <button
                      key={part.id}
                      onClick={() => {
                        // Cannot navigate to completed skills
                        if (isSkillCompleted) {
                          return;
                        }
                        console.log('Navigate to:', part.id);
                        setCurrentPartId(part.id);
                      }}
                      disabled={isSkillCompleted}
                      className={`flex-1 px-4 py-2 text-xs whitespace-nowrap border-r border-gray-400 transition-colors ${
                        isSkillCompleted
                          ? 'bg-gray-500 text-gray-700 cursor-not-allowed opacity-60'
                          : part.id === currentPartId
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-400 text-gray-900 hover:bg-gray-500'
                      }`}
                    >
                      {part.label}
                    </button>
                  ))}
                </div>
                {/* Skill Label Row */}
                <div className={`text-white text-xs text-center py-1 px-2 whitespace-nowrap ${isSkillCompleted ? 'opacity-60' : ''}`}>
                  {section.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleNextPart}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            TIẾP TỤC
          </button>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
            LƯU BÀI
          </button>
        </div>
      </div>

      {/* Speaking Preparation Modal */}
      {showPreparationModal && (
        <SpeakingPreparationModal
          timeLeft={preparationTimeLeft}
          onComplete={handlePreparationComplete}
        />
      )}

      {/* Incomplete Part Modal */}
      {showIncompleteModal && (
        <IncompletePartModal
          answeredCount={getCurrentPartAnsweredCount()}
          totalCount={getCurrentPartQuestionCount()}
          onContinue={() => {
            if (pendingNextPartId) {
              // Check if we're transitioning to a different skill
              const currentSkill = getSkillFromPartId(currentPartId);
              const nextSkillName = getSkillFromPartId(pendingNextPartId);
              
              setShowIncompleteModal(false);
              
              if (currentSkill !== nextSkillName) {
                // Show skill transition modal
                setNextSkill(nextSkillName);
                setShowSkillTransitionModal(true);
              } else {
                // Same skill, just change part
                setCurrentPartId(pendingNextPartId);
                setPendingNextPartId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          }}
          onStay={() => {
            setPendingNextPartId(null);
            setShowIncompleteModal(false);
          }}
        />
      )}

      {/* Skill Transition Modal */}
      {showSkillTransitionModal && nextSkill && (
        <SkillTransitionModal
          currentSkill={getSkillFromPartId(currentPartId)}
          nextSkill={nextSkill}
          onConfirm={() => {
            if (pendingNextPartId) {
              // Mark current skill as completed
              const currentSkill = getSkillFromPartId(currentPartId);
              setCompletedSkills(prev => [...prev, currentSkill]);
              
              setCurrentPartId(pendingNextPartId);
              setPendingNextPartId(null);
              setNextSkill(null);
              setShowSkillTransitionModal(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          onCancel={() => {
            setPendingNextPartId(null);
            setNextSkill(null);
            setShowSkillTransitionModal(false);
          }}
        />
      )}

      {/* Recording Countdown Modal */}
      {showRecordingCountdown && currentPartId === 'S1' && (
        <RecordingCountdownModal
          countdown={recordingCountdown}
        />
      )}

      {/* Preparation Timer (Part 2 & 3 - small corner timer) */}
      {showRecordingCountdown && (currentPartId === 'S2' || currentPartId === 'S3') && (
        <PreparationTimer
          countdown={recordingCountdown}
        />
      )}

      {/* Transition Countdown Modal (Part 1 after recording) */}
      {showTransitionCountdown && (
        <TransitionCountdownModal
          countdown={transitionCountdown}
        />
      )}
    </div>
  );
}