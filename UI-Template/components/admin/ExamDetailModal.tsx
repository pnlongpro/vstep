import { useState } from 'react';
import { X, Book, Headphones, PenTool, Mic, CheckCircle, XCircle, AlertCircle, Clock, FileText, Volume2, MessageSquare } from 'lucide-react';

interface ExamDetailModalProps {
  exam: any;
  onClose: () => void;
  onApprove?: (exam: any) => void;
  onReject?: (exam: any) => void;
  skill?: string;
  onEdit?: () => void;
}

export function ExamDetailModal({ exam, onClose, onApprove, onReject, skill, onEdit }: ExamDetailModalProps) {
  // Mock data chi tiết câu hỏi cho từng kỹ năng - ĐẦY ĐỦ THEO CẤU TRÚC VSTEP CHUẨN
  const examDetails = {
    reading: {
      parts: [
        {
          partNumber: 1,
          title: 'Part 1: Single Passage - Questions 1-10',
          passage: `To Get a Job in Your 50s, Maintain Friendships in Your 40s.

We hear it all the time: People who are over 50 take longer to find jobs than younger people. According to a study by Professor Wanberg and others, job seekers over 50 were unemployed 5.8 weeks longer than those from the ages of 30 to 49.

The researchers found that older people on average had smaller social networks than younger people. People are also less willing to take risks and often stay at the same job longer. During that time, the skills people have learned become narrow strategies they use when they search for work, especially as technology evolves ever more quickly.`,
          questions: [
            { id: 1, question: 'The word "gloom-and-doom" could be best replaced by:', options: ['A. hopeless', 'B. interesting', 'C. strange', 'D. cheerful'], correctAnswer: 'A', hasError: false },
            { id: 2, question: 'According to the study, which age group has the least unemployed time?', options: ['A. from 20 to 29', 'B. from 30 to 49', 'C. over 50', 'D. less than 20'], correctAnswer: 'B', hasError: false },
            { id: 3, question: 'What is the main problem for older job seekers?', options: ['A. Age discrimination', 'B. Smaller social networks', 'C. Lack of skills', 'D. Health issues'], correctAnswer: 'B', hasError: false },
            { id: 4, question: 'What does Professor Wanberg recommend?', options: ['A. Change careers', 'B. Stay in touch with networks', 'C. Retire early', 'D. Focus on technical skills'], correctAnswer: 'B', hasError: false },
            { id: 5, question: 'How long does it take for people over 50 to find jobs vs 30-49?', options: ['A. 5.8 weeks longer', 'B. 10.6 weeks longer', 'C. 3 weeks longer', 'D. Same time'], correctAnswer: 'A', hasError: false },
            { id: 6, question: 'What advantage do older workers have?', options: ['A. More energy', 'B. Better tech skills', 'C. Wisdom and emotional intelligence', 'D. Faster speed'], correctAnswer: 'C', hasError: false },
            { id: 7, question: 'The word "their" refers to:', options: ['A. social networks', 'B. older people', 'C. younger people', 'D. relationships'], correctAnswer: 'B', hasError: false },
            { id: 8, question: 'What is NOT mentioned as a challenge?', options: ['A. Smaller networks', 'B. Less risk-taking', 'C. Narrow skills', 'D. Physical disabilities'], correctAnswer: 'D', hasError: false },
            { id: 9, question: 'What should older workers do in their early 40s?', options: ['A. Quit working', 'B. Work social skills', 'C. Focus on salary', 'D. Avoid technology'], correctAnswer: 'B', hasError: false },
            { id: 10, question: 'Main purpose of this passage?', options: ['A. Discourage job hunting', 'B. Explain challenges and solutions', 'C. Criticize discrimination', 'D. Compare age groups'], correctAnswer: 'B', hasError: false },
          ]
        },
        {
          partNumber: 2,
          title: 'Part 2: Two Short Passages - Questions 11-20',
          passage: `Passage 1: The Impact of Social Media
Social media has revolutionized communication. Studies show excessive use can lead to anxiety and depression. Cyberbullying has become a serious issue among young people.

Passage 2: Remote Work Revolution
The COVID-19 pandemic accelerated remote work. For employees, it offers flexibility and eliminates commuting. However, it can also lead to feelings of isolation and difficulty separating work from personal life.`,
          questions: [
            { id: 11, question: 'Main topic of Passage 1?', options: ['A. History of social media', 'B. Benefits and challenges', 'C. How to use safely', 'D. Future of communication'], correctAnswer: 'B', hasError: false },
            { id: 12, question: 'One mental health concern?', options: ['A. Physical exhaustion', 'B. Memory loss', 'C. Anxiety and depression', 'D. Sleep improvement'], correctAnswer: 'C', hasError: false },
            { id: 13, question: 'The word "curated" means:', options: ['A. carefully selected', 'B. randomly posted', 'C. honest', 'D. boring'], correctAnswer: 'A', hasError: false },
            { id: 14, question: 'Issue affecting young people?', options: ['A. Job loss', 'B. Cyberbullying', 'C. High costs', 'D. Privacy laws'], correctAnswer: 'B', hasError: false },
            { id: 15, question: 'What accelerated remote work?', options: ['A. New technology', 'B. COVID-19 pandemic', 'C. Government regulations', 'D. Employee protests'], correctAnswer: 'B', hasError: false },
            { id: 16, question: 'One benefit of remote work?', options: ['A. Higher salary', 'B. More vacation', 'C. Flexibility and no commuting', 'D. Guaranteed promotion'], correctAnswer: 'C', hasError: false },
            { id: 17, question: 'Challenge of remote work?', options: ['A. Too much sleep', 'B. Feelings of isolation', 'C. Too many meetings', 'D. Increased expenses'], correctAnswer: 'B', hasError: false },
            { id: 18, question: 'Many employees report _____ when working from home.', options: ['A. decreased motivation', 'B. increased productivity', 'C. more distractions', 'D. less creativity'], correctAnswer: 'B', hasError: false },
            { id: 19, question: 'Both passages discuss:', options: ['A. technology costs', 'B. government policies', 'C. mental health challenges', 'D. education systems'], correctAnswer: 'C', hasError: false },
            { id: 20, question: 'Remote work was considered before pandemic:', options: ['A. Impossible', 'B. A perk by progressive companies', 'C. Mandatory', 'D. Illegal'], correctAnswer: 'B', hasError: false },
          ]
        },
        {
          partNumber: 3,
          title: 'Part 3: Three Short Passages - Questions 21-30',
          passage: `Passage 1: AI is transforming industries. Machine learning enables computers to learn from experience.

Passage 2: Climate change causes rising temperatures, severe weather, and ecosystem disruptions. Scientists warn action is needed.

Passage 3: Reading improves vocabulary and reduces stress by up to 68%.`,
          questions: [
            { id: 21, question: 'Main idea of Passage 1?', options: ['A. AI is transforming industries', 'B. AI is dangerous', 'C. AI will replace humans', 'D. AI is expensive'], correctAnswer: 'A', hasError: false },
            { id: 22, question: 'What is machine learning?', options: ['A. Computer hardware', 'B. Subset of AI that learns from experience', 'C. Programming language', 'D. Social media platform'], correctAnswer: 'B', hasError: false },
            { id: 23, question: 'AI systems can:', options: ['A. Only play games', 'B. Process data and recognize patterns', 'C. Replace all teachers', 'D. Cook meals'], correctAnswer: 'B', hasError: false },
            { id: 24, question: 'What causes rising temperatures?', options: ['A. Natural cycles only', 'B. Greenhouse gas emissions', 'C. Solar flares', 'D. Volcanic eruptions'], correctAnswer: 'B', hasError: false },
            { id: 25, question: 'Effects of climate change?', options: ['A. Better weather', 'B. Severe weather, rising seas, ecosystem disruptions', 'C. Colder winters', 'D. No effects'], correctAnswer: 'B', hasError: false },
            { id: 26, question: '"Catastrophic" means:', options: ['A. beneficial', 'B. disastrous', 'C. interesting', 'D. beautiful'], correctAnswer: 'B', hasError: false },
            { id: 27, question: 'One benefit of reading?', options: ['A. Weight loss', 'B. Improved vocabulary', 'C. Better eyesight', 'D. Increased height'], correctAnswer: 'B', hasError: false },
            { id: 28, question: 'Reading reduces stress by:', options: ['A. 30%', 'B. 50%', 'C. 68%', 'D. 90%'], correctAnswer: 'C', hasError: false },
            { id: 29, question: 'When is reading beneficial?', options: ['A. Morning', 'B. Before bed', 'C. During lunch', 'D. While exercising'], correctAnswer: 'B', hasError: false },
            { id: 30, question: 'Which passage discusses environment?', options: ['A. Passage 1', 'B. Passage 2', 'C. Passage 3', 'D. None'], correctAnswer: 'B', hasError: false },
          ]
        },
        {
          partNumber: 4,
          title: 'Part 4: Four Short Passages - Questions 31-40',
          passage: `Passage 1: EVs produce zero emissions. Battery advances extended driving ranges.

Passage 2: Online education offers courses from universities. Platforms like Coursera and edX provide lifelong learning.

Passage 3: Balanced diet prevents chronic diseases. Include fruits, vegetables, whole grains.

Passage 4: Space exploration with reusable rockets by SpaceX makes space accessible.`,
          questions: [
            { id: 31, question: 'Advantage of EVs?', options: ['A. Always cheaper', 'B. Zero direct emissions', 'C. Never need charging', 'D. Faster than all vehicles'], correctAnswer: 'B', hasError: false },
            { id: 32, question: 'What extended EV ranges?', options: ['A. Bigger cars', 'B. Battery technology advances', 'C. Lower speeds', 'D. Subsidies'], correctAnswer: 'B', hasError: false },
            { id: 33, question: 'Online education provided?', options: ['A. Free degrees', 'B. Lifelong learning opportunities', 'C. Guaranteed jobs', 'D. Physical textbooks'], correctAnswer: 'B', hasError: false },
            { id: 34, question: 'What is needed for online education?', options: ['A. Library card', 'B. Internet connection', 'C. University degree', 'D. Special equipment'], correctAnswer: 'B', hasError: false },
            { id: 35, question: 'Which platforms mentioned?', options: ['A. Facebook and Twitter', 'B. Coursera and edX', 'C. Netflix and Hulu', 'D. Amazon and eBay'], correctAnswer: 'B', hasError: false },
            { id: 36, question: 'Proper nutrition prevents?', options: ['A. All diseases', 'B. Many chronic diseases', 'C. Aging', 'D. Bad weather'], correctAnswer: 'B', hasError: false },
            { id: 37, question: 'Balanced diet includes?', options: ['A. Only meat', 'B. Fruits, vegetables, whole grains, lean proteins', 'C. Only supplements', 'D. Fast food'], correctAnswer: 'B', hasError: false },
            { id: 38, question: 'What makes space accessible?', options: ['A. Cheaper tickets', 'B. Mars missions and reusable rockets', 'C. Better telescopes', 'D. Science fiction'], correctAnswer: 'B', hasError: false },
            { id: 39, question: 'Company mentioned for reusable rockets?', options: ['A. Tesla', 'B. SpaceX', 'C. Boeing', 'D. NASA'], correctAnswer: 'B', hasError: false },
            { id: 40, question: 'Why is space exploration important?', options: ['A. Find aliens', 'B. Understand planets and protect Earth', 'C. Escape Earth', 'D. Entertainment'], correctAnswer: 'B', hasError: false },
          ]
        },
      ]
    },
    listening: {
      parts: [
        {
          partNumber: 1,
          title: 'Part 1: Short Conversations - Questions 1-8',
          audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
          duration: '6:30',
          questions: [
            { id: 1, question: 'Where does the conversation take place?', options: ['A. Restaurant', 'B. Office', 'C. Home', 'D. School'], correctAnswer: 'B', timestamp: '0:15', hasError: false },
            { id: 2, question: 'What is the main purpose?', options: ['A. Meeting arrangement', 'B. Interview', 'C. Discussion', 'D. Presentation'], correctAnswer: 'A', timestamp: '0:45', hasError: false },
            { id: 3, question: 'What time is meeting?', options: ['A. 9:00 AM', 'B. 10:00 AM', 'C. 2:00 PM', 'D. 3:00 PM'], correctAnswer: 'C', timestamp: '1:20', hasError: false },
            { id: 4, question: 'Who will attend?', options: ['A. Only managers', 'B. All team members', 'C. External clients', 'D. HR department'], correctAnswer: 'B', timestamp: '2:00', hasError: false },
            { id: 5, question: 'What to bring?', options: ['A. Laptops', 'B. Monthly reports', 'C. Business cards', 'D. Lunch'], correctAnswer: 'B', timestamp: '2:45', hasError: false },
            { id: 6, question: 'Where is meeting room?', options: ['A. First floor', 'B. Second floor', 'C. Third floor', 'D. Fourth floor'], correctAnswer: 'C', timestamp: '3:30', hasError: false },
            { id: 7, question: 'Meeting duration?', options: ['A. 30 minutes', 'B. 1 hour', 'C. 2 hours', 'D. 3 hours'], correctAnswer: 'C', timestamp: '4:10', hasError: false },
            { id: 8, question: 'What discussed first?', options: ['A. Budget', 'B. Sales figures', 'C. New projects', 'D. Personnel'], correctAnswer: 'B', timestamp: '5:00', hasError: false },
          ]
        },
        {
          partNumber: 2,
          title: 'Part 2: Monologue/Talk - Questions 9-17',
          audioUrl: 'https://cdn.pixabay.com/audio/2023/03/07/audio_426e87935b.mp3',
          duration: '8:45',
          questions: [
            { id: 9, question: 'Main topic?', options: ['A. Marketing strategies', 'B. Company history', 'C. Product development', 'D. Customer service'], correctAnswer: 'A', timestamp: '0:30', hasError: false },
            { id: 10, question: 'The speaker mentions _____ main points.', correctAnswer: 'three', hasError: false },
            { id: 11, question: 'Company founding year?', options: ['A. 2010', 'B. 2015', 'C. 2020', 'D. 2024'], correctAnswer: 'B', timestamp: '1:45', hasError: false },
            { id: 12, question: 'Number of employees?', options: ['A. 50-100', 'B. 100-200', 'C. 200-500', 'D. Over 500'], correctAnswer: 'C', timestamp: '2:30', hasError: false },
            { id: 13, question: 'Primary market?', options: ['A. Europe', 'B. Asia', 'C. North America', 'D. Global'], correctAnswer: 'D', timestamp: '3:20', hasError: false },
            { id: 14, question: 'Projected growth?', options: ['A. 10%', 'B. 15%', 'C. 20%', 'D. 25%'], correctAnswer: 'C', timestamp: '4:00', hasError: false },
            { id: 15, question: 'Challenge mentioned?', options: ['A. Competition', 'B. Funding', 'C. Staffing', 'D. Technology'], correctAnswer: 'A', timestamp: '5:10', hasError: false },
            { id: 16, question: 'Solution proposed?', options: ['A. Cost reduction', 'B. Innovation and quality', 'C. Market expansion', 'D. Mergers'], correctAnswer: 'B', timestamp: '6:30', hasError: false },
            { id: 17, question: 'Speaker role?', options: ['A. CEO', 'B. Marketing Director', 'C. HR Manager', 'D. Sales Rep'], correctAnswer: 'B', timestamp: '7:20', hasError: false },
          ]
        },
        {
          partNumber: 3,
          title: 'Part 3: Academic Discussion - Questions 18-35',
          audioUrl: 'https://cdn.pixabay.com/audio/2024/03/12/audio_83b5753b2b.mp3',
          duration: '12:30',
          questions: [
            { id: 18, question: 'Discussion topic?', options: ['A. Education', 'B. Technology', 'C. Business', 'D. Environmental sustainability'], correctAnswer: 'D', hasError: false },
            { id: 19, question: 'Number of speakers?', options: ['A. 2', 'B. 3', 'C. 4', 'D. 5'], correctAnswer: 'B', timestamp: '0:20', hasError: false },
            { id: 20, question: 'First speaker main argument?', options: ['A. Economic growth priority', 'B. Environmental protection first', 'C. Technology solves all', 'D. Individual actions irrelevant'], correctAnswer: 'B', timestamp: '1:00', hasError: false },
            { id: 21, question: 'Carbon emissions statistic?', options: ['A. 10% increase', 'B. 15% increase', 'C. 20% increase', 'D. 25% increase'], correctAnswer: 'C', timestamp: '2:15', hasError: false },
            { id: 22, question: 'Renewable energy example?', options: ['A. Coal', 'B. Oil', 'C. Solar and wind', 'D. Nuclear'], correctAnswer: 'C', timestamp: '3:00', hasError: false },
            { id: 23, question: 'Second speaker emphasizes?', options: ['A. Cost of measures', 'B. Balance economy-environment', 'C. Ignore climate change', 'D. International cooperation'], correctAnswer: 'B', timestamp: '4:30', hasError: false },
            { id: 24, question: 'Industry discussed?', options: ['A. Fashion', 'B. Automotive', 'C. Technology', 'D. Healthcare'], correctAnswer: 'B', timestamp: '5:20', hasError: false },
            { id: 25, question: 'Policy mentioned?', options: ['A. Carbon tax', 'B. Free education', 'C. Healthcare reform', 'D. Trade agreements'], correctAnswer: 'A', timestamp: '6:10', hasError: false },
            { id: 26, question: 'Positive example country?', options: ['A. USA', 'B. China', 'C. Sweden', 'D. Brazil'], correctAnswer: 'C', timestamp: '7:00', hasError: false },
            { id: 27, question: 'About public transportation?', options: ['A. Should be eliminated', 'B. Needs investment', 'C. Perfect as is', 'D. Too expensive'], correctAnswer: 'B', timestamp: '7:45', hasError: false },
            { id: 28, question: 'Consumer role?', options: ['A. No role', 'B. Minor role', 'C. Significant through choices', 'D. Only government matters'], correctAnswer: 'C', timestamp: '8:30', hasError: false },
            { id: 29, question: 'About plastic pollution?', options: ['A. Not a problem', 'B. Major concern', 'C. Solved', 'D. Exaggerated'], correctAnswer: 'B', timestamp: '9:15', hasError: false },
            { id: 30, question: 'Timeframe for action?', options: ['A. 5 years', 'B. 10 years', 'C. 20 years', 'D. 50 years'], correctAnswer: 'B', timestamp: '10:00', hasError: false },
            { id: 31, question: 'Third speaker perspective?', options: ['A. Pessimistic', 'B. Optimistic with conditions', 'C. Neutral', 'D. Dismissive'], correctAnswer: 'B', timestamp: '10:30', hasError: false },
            { id: 32, question: 'Technology discussed?', options: ['A. AI', 'B. Battery storage', 'C. Social media', 'D. Gaming'], correctAnswer: 'B', timestamp: '11:00', hasError: false },
            { id: 33, question: 'International agreements?', options: ['A. Unnecessary', 'B. Important but need enforcement', 'C. Perfect', 'D. Abandon'], correctAnswer: 'B', timestamp: '11:30', hasError: false },
            { id: 34, question: 'Final recommendation?', options: ['A. Do nothing', 'B. Immediate collective action', 'C. Wait for technology', 'D. Focus economics only'], correctAnswer: 'B', timestamp: '12:00', hasError: false },
            { id: 35, question: 'Overall tone?', options: ['A. Argumentative', 'B. Constructive and solution-focused', 'C. Depressing', 'D. Casual'], correctAnswer: 'B', timestamp: '12:15', hasError: false },
          ]
        },
      ]
    },
    writing: {
      tasks: [
        {
          taskNumber: 1,
          title: 'Task 1: Email Writing (20 minutes)',
          prompt: `You received an email from your manager about a project delay. Write a formal email response (at least 120 words) explaining the situation and proposing solutions.

Context:
Your manager has expressed concern that the marketing campaign project is behind schedule. The original deadline was next Friday, but your team needs more time due to unexpected challenges with the design phase.

Your email should:
• Acknowledge the delay professionally
• Explain the reasons clearly
• Propose a realistic new timeline
• Suggest steps to prevent future delays
• Maintain a formal, professional tone`,
          requirements: [
            '✅ Minimum 120 words',
            '✅ Formal tone and professional structure',
            '✅ Include: greeting, acknowledgment, explanation, proposed solutions, closing',
            '✅ Proper email format (Subject line, Dear..., Best regards)',
            '✅ Clear paragraphs with logical flow',
            '✅ Appropriate vocabulary for business communication',
          ],
          rubric: {
            taskResponse: '25%',
            coherence: '25%',
            vocabulary: '25%',
            grammar: '25%',
          },
          hasError: false,
        },
        {
          taskNumber: 2,
          title: 'Task 2: Essay Writing (40 minutes)',
          prompt: `Some people believe that technology has made our lives more complicated. Others think it has made life easier and more convenient.

Discuss both views and give your opinion. Give reasons for your answer and include relevant examples from your knowledge or experience.

Write at least 250 words.`,
          requirements: [
            '✅ Minimum 250 words',
            '✅ Clear introduction with thesis statement',
            '✅ Body paragraph 1: Discuss first view (technology makes life complicated)',
            '✅ Body paragraph 2: Discuss second view (technology makes life easier)',
            '✅ Body paragraph 3 (optional): Your opinion with supporting reasons',
            '✅ Conclusion summarizing main points and restating opinion',
            '✅ Use specific examples to support arguments',
            '✅ Demonstrate range of vocabulary and grammatical structures',
            '✅ Logical paragraph organization with clear topic sentences',
            '✅ Use cohesive devices (However, Moreover, In addition, etc.)',
          ],
          rubric: {
            taskResponse: '25%',
            coherence: '25%',
            vocabulary: '25%',
            grammar: '25%',
          },
          hasError: false,
        },
      ]
    },
    speaking: {
      parts: [
        {
          id: 'S1',
          title: 'PART I: SOCIAL INTERACTION (~ 3 mins)',
          topics: [
            {
              title: "Let's talk about rooms in your house",
              questions: [
                'Which room in your house do you like best?',
                'What do you usually do in that room?',
                'Would you like to change anything in your room?',
              ],
            },
            {
              title: "Now, let's talk about your home environment",
              questions: [
                'Do you prefer living in a house or an apartment? Why?',
                'What makes a home comfortable for you?',
                'How important is natural light in your home?',
              ],
            },
          ],
          hasError: false,
        },
        {
          id: 'S2',
          title: 'PART II: SOLUTION DISCUSSION (~ 4 mins)',
          situation: 'You are planning to redecorate your living room to make it more comfortable and functional. You have a limited budget and need to decide what to focus on. What will you suggest?',
          note: 'There are THREE options for you to choose:',
          options: [
            'Buy new furniture such as a sofa, coffee table, and shelves.',
            'Repaint the walls and change the curtains and decorations.',
            'Install better lighting and add some indoor plants.',
          ],
          hasError: false,
        },
        {
          id: 'S3',
          title: 'PART III: TOPIC DEVELOPMENT (~ 5 mins)',
          topic: 'What are the benefits of learning a foreign language?',
          mindMap: {
            center: 'Benefits of learning a foreign language',
            nodes: [
              'Career opportunities',
              'Cultural understanding',
              'Personal development',
              'Travel experiences',
            ],
          },
          questions: [
            'At what age do you think children should start learning a foreign language?',
            'Do you think everyone should learn English? Why or why not?',
            'How has technology changed the way people learn foreign languages?',
          ],
          hasError: false,
        },
      ]
    },
  };

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'reading': return <Book className="size-5 text-blue-600" />;
      case 'listening': return <Headphones className="size-5 text-emerald-600" />;
      case 'writing': return <PenTool className="size-5 text-violet-600" />;
      case 'speaking': return <Mic className="size-5 text-amber-600" />;
      default: return null;
    }
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading': return { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-700' };
      case 'listening': return { bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700' };
      case 'writing': return { bg: 'from-violet-50 to-violet-100', border: 'border-violet-200', text: 'text-violet-700' };
      case 'speaking': return { bg: 'from-amber-50 to-amber-100', border: 'border-amber-200', text: 'text-amber-700' };
      default: return { bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', text: 'text-gray-700' };
    }
  };

  const getSkillName = (skill: string) => {
    switch (skill) {
      case 'reading': return 'Reading';
      case 'listening': return 'Listening';
      case 'writing': return 'Writing';
      case 'speaking': return 'Speaking';
      default: return skill;
    }
  };

  // Đếm lỗi cho kỹ năng hiện tại
  const countErrors = () => {
    let errorCount = 0;
    const skill = exam.skill;

    if (skill === 'reading') {
      examDetails.reading.parts.forEach(part => {
        part.questions.forEach(q => {
          if (q.hasError) errorCount++;
        });
      });
    } else if (skill === 'listening') {
      examDetails.listening.parts.forEach(part => {
        part.questions.forEach(q => {
          if (q.hasError) errorCount++;
        });
      });
    } else if (skill === 'writing') {
      examDetails.writing.tasks.forEach(task => {
        if (task.hasError) errorCount++;
      });
    } else if (skill === 'speaking') {
      examDetails.speaking.parts.forEach(part => {
        if (part.hasError) errorCount++;
        if (part.questions) {
          part.questions.forEach(q => {
            if (q.hasError) errorCount++;
          });
        }
      });
    }

    return errorCount;
  };

  const totalErrors = countErrors();
  const skillColors = getSkillColor(exam.skill);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-6 border-b ${skillColors.border} bg-gradient-to-r ${skillColors.bg}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getSkillIcon(exam.skill)}
                <h3 className={`text-xl ${skillColors.text}`}>
                  📝 Chi Tiết Đề Thi - {getSkillName(exam.skill)}
                </h3>
                {totalErrors > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {totalErrors} lỗi cần sửa
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{exam.title}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                <span>ID: {exam.id}</span>
                <span>•</span>
                <span>Level: {exam.level}</span>
                <span>•</span>
                <span>Upload bởi: {exam.uploadedBy}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
              <X className="size-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Reading Content */}
          {exam.skill === 'reading' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="flex items-center gap-2 mb-2">
                  <Book className="size-5 text-blue-600" />
                  Reading Test - 4 Parts
                </h4>
                <p className="text-sm text-gray-600">
                  Tổng số câu hỏi: 40 câu (Part 1: 10 câu, Part 2: 10 câu, Part 3: 10 câu, Part 4: 10 câu)
                </p>
              </div>

              {examDetails.reading.parts.map((part) => (
                <div key={part.partNumber} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h5 className="mb-3">{part.title}</h5>
                  
                  {/* Passage */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-600 mb-2">📖 Đoạn văn:</p>
                    <p className="text-sm text-gray-700 italic">{part.passage}</p>
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {part.questions.map((q) => (
                      <div key={q.id} className={`p-4 rounded-lg border-2 ${
                        q.hasError ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm mb-2">
                              <strong>Câu {q.id}:</strong> {q.question}
                            </p>
                            {q.options && (
                              <div className="space-y-1 text-sm text-gray-600 ml-4">
                                {q.options.map((opt, idx) => (
                                  <div key={idx} className={opt.startsWith(q.correctAnswer) ? 'text-green-700' : ''}>
                                    {opt} {opt.startsWith(q.correctAnswer) && '✅'}
                                  </div>
                                ))}
                              </div>
                            )}
                            {!q.options && (
                              <p className="text-sm text-green-700 ml-4">
                                ✅ Đáp án: <strong>{q.correctAnswer}</strong>
                              </p>
                            )}
                            {q.hasError && q.errorNote && (
                              <div className="mt-2 flex items-start gap-2 text-sm text-red-700 bg-red-100 rounded p-2">
                                <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
                                <span>{q.errorNote}</span>
                              </div>
                            )}
                          </div>
                          {q.hasError ? (
                            <XCircle className="size-5 text-red-600 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Listening Content */}
          {exam.skill === 'listening' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="flex items-center gap-2 mb-2">
                  <Headphones className="size-5 text-emerald-600" />
                  Listening Test - 3 Parts
                </h4>
                <p className="text-sm text-gray-600">
                  Tổng thời lượng audio: ~27 phút | Tổng câu hỏi: 35 câu (Part 1: 8 câu, Part 2: 9 câu, Part 3: 18 câu)
                </p>
              </div>

              {examDetails.listening.parts.map((part) => (
                <div key={part.partNumber} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h5 className="mb-3">{part.title}</h5>
                  
                  {/* Audio Player */}
                  <div className="bg-emerald-50 rounded-lg p-4 mb-4 flex items-center gap-3">
                    <Volume2 className="size-5 text-emerald-600" />
                    <div className="flex-1">
                      <p className="text-sm">Audio: {part.audioUrl}</p>
                      <p className="text-xs text-gray-600">Duration: {part.duration}</p>
                    </div>
                    <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
                      ▶ Play
                    </button>
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {part.questions.map((q) => (
                      <div key={q.id} className={`p-4 rounded-lg border-2 ${
                        q.hasError ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm mb-2">
                              <strong>Câu {q.id}:</strong> {q.question}
                              {q.timestamp && <span className="text-xs text-gray-500 ml-2">({q.timestamp})</span>}
                            </p>
                            {q.options && (
                              <div className="space-y-1 text-sm text-gray-600 ml-4">
                                {q.options.map((opt, idx) => (
                                  <div key={idx} className={opt.startsWith(q.correctAnswer) ? 'text-green-700' : ''}>
                                    {opt} {opt.startsWith(q.correctAnswer) && '✅'}
                                  </div>
                                ))}
                              </div>
                            )}
                            {!q.options && (
                              <p className="text-sm text-green-700 ml-4">
                                ✅ Đáp án: <strong>{q.correctAnswer}</strong>
                              </p>
                            )}
                            {q.hasError && q.errorNote && (
                              <div className="mt-2 flex items-start gap-2 text-sm text-red-700 bg-red-100 rounded p-2">
                                <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
                                <span>{q.errorNote}</span>
                              </div>
                            )}
                          </div>
                          {q.hasError ? (
                            <XCircle className="size-5 text-red-600 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Writing Content */}
          {exam.skill === 'writing' && (
            <div className="space-y-6">
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <h4 className="flex items-center gap-2 mb-2">
                  <PenTool className="size-5 text-violet-600" />
                  Writing Test - {examDetails.writing.tasks.length} Tasks
                </h4>
                <p className="text-sm text-gray-600">
                  AI-graded tasks với rubric chi tiết
                </p>
              </div>

              {examDetails.writing.tasks.map((task) => (
                <div key={task.taskNumber} className={`bg-white border-2 rounded-xl p-6 ${
                  task.hasError ? 'border-red-200' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <h5 className="flex items-center gap-2">
                      {task.title}
                      {task.hasError && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                          Có lỗi
                        </span>
                      )}
                    </h5>
                    {task.hasError ? (
                      <XCircle className="size-5 text-red-600" />
                    ) : (
                      <CheckCircle className="size-5 text-green-600" />
                    )}
                  </div>

                  {/* Prompt */}
                  <div className="bg-violet-50 rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-600 mb-2">📝 Đề bài:</p>
                    <p className="text-sm text-gray-700">{task.prompt}</p>
                  </div>

                  {/* Requirements */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-600 mb-2">✓ Yêu cầu:</p>
                    <div className="space-y-1 text-sm">
                      {task.requirements.map((req, idx) => (
                        <div key={idx} className={req.includes('❌') ? 'text-red-700' : 'text-gray-700'}>
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rubric */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {Object.entries(task.rubric).map(([key, value]) => (
                      <div key={key} className="bg-white border border-violet-200 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-violet-600">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Error Note */}
                  {task.hasError && task.errorNote && (
                    <div className="flex items-start gap-2 text-sm text-red-700 bg-red-100 rounded-lg p-3">
                      <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
                      <span>{task.errorNote}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Speaking Content */}
          {exam.skill === 'speaking' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="flex items-center gap-2 mb-2">
                  <Mic className="size-5 text-amber-600" />
                  Speaking Test - {examDetails.speaking.parts.length} Parts
                </h4>
                <p className="text-sm text-gray-600">
                  Thời gian: ~12 phút | AI-graded với pronunciation, fluency, grammar assessment
                </p>
              </div>

              {examDetails.speaking.parts.map((part) => (
                <div key={part.id} className={`bg-white border-2 rounded-xl p-6 ${
                  part.hasError ? 'border-red-200' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <h5 className="flex items-center gap-2">
                      {part.title}
                      {part.hasError && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                          Có lỗi
                        </span>
                      )}
                    </h5>
                    {part.hasError ? (
                      <XCircle className="size-5 text-red-600" />
                    ) : (
                      <CheckCircle className="size-5 text-green-600" />
                    )}
                  </div>

                  {/* Part 1: Interview Questions */}
                  {part.id === 'S1' && part.topics && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-600 mb-3">📋 Câu hỏi phỏng vấn (Interview questions):</p>
                      {part.topics.map((topic, idx) => (
                        <div key={idx} className="p-4 rounded-lg border-2 border-gray-200 bg-white">
                          <div className="flex items-start gap-3">
                            <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm font-bold text-amber-700 flex-shrink-0">
                              {idx + 1}
                            </span>
                            <p className="text-sm flex-1">{topic.title}</p>
                            <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                          </div>
                          <div className="space-y-2 mt-2">
                            {topic.questions.map((question, qIdx) => (
                              <div key={qIdx} className="flex items-start gap-2">
                                <MessageSquare className="size-4 text-gray-500" />
                                <p className="text-sm">{question}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Part 2: Long Turn with Cue Card */}
                  {part.id === 'S2' && (
                    <div className="space-y-4">
                      {/* Topic */}
                      <div className="bg-amber-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-2">📝 Topic:</p>
                        <p className="text-sm font-medium text-amber-900">{part.situation}</p>
                      </div>

                      {/* Cue Card */}
                      <div className="bg-amber-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-2">🎯 Cue Card (Gợi ý):</p>
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{part.note}</pre>
                        <ul className="list-disc list-inside">
                          {part.options.map((option, idx) => (
                            <li key={idx} className="text-sm text-gray-700">{option}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Time Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white border border-amber-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="size-4 text-amber-600" />
                            <p className="text-xs text-gray-600">Thời gian chuẩn bị</p>
                          </div>
                          <p className="text-amber-700 font-medium">3 phút</p>
                        </div>
                        <div className="bg-white border border-amber-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Mic className="size-4 text-amber-600" />
                            <p className="text-xs text-gray-600">Thời gian nói</p>
                          </div>
                          <p className="text-amber-700 font-medium">4 phút</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Part 3: Discussion Questions */}
                  {part.id === 'S3' && (
                    <div className="space-y-4">
                      {/* Topic */}
                      <div className="bg-amber-50 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-2">📝 Topic:</p>
                        <p className="text-sm font-medium text-amber-900">{part.topic}</p>
                      </div>

                      {/* Mind Map */}
                      {part.mindMap && (
                        <div className="bg-amber-50 rounded-lg p-4">
                          <p className="text-xs text-gray-600 mb-3">🧠 Mind Map:</p>
                          <div className="flex flex-col items-center">
                            <div className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium mb-3">
                              {part.mindMap.center}
                            </div>
                            <div className="grid grid-cols-2 gap-3 w-full">
                              {part.mindMap.nodes.map((node, idx) => (
                                <div key={idx} className="bg-white border-2 border-amber-300 rounded-lg p-3 text-center">
                                  <p className="text-sm text-gray-700">{node}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Follow-up Questions */}
                      {part.questions && (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-600 mb-3">💬 Câu hỏi thảo luận (Follow-up questions):</p>
                          {part.questions.map((question, idx) => (
                            <div key={idx} className="p-4 rounded-lg border-2 border-gray-200 bg-white">
                              <div className="flex items-start gap-3">
                                <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm font-bold text-amber-700 flex-shrink-0">
                                  {idx + 1}
                                </span>
                                <p className="text-sm flex-1">{question}</p>
                                <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Part Error Note */}
                  {part.hasError && part.errorNote && (
                    <div className="flex items-start gap-2 text-sm text-red-700 bg-red-100 rounded-lg p-3 mt-4">
                      <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
                      <span>{part.errorNote}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {totalErrors > 0 ? (
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="size-5" />
                  <span className="text-sm">Tìm thấy {totalErrors} lỗi cần chỉnh sửa</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="size-5" />
                  <span className="text-sm">Đề thi hợp lệ, không có lỗi</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
              >
                Đóng
              </button>
              {exam.status === 'pending' && (
                <>
                  <button
                    onClick={() => onReject && onReject(exam)}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="size-4" />
                    Từ chối
                  </button>
                  <button
                    onClick={() => onApprove && onApprove(exam)}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="size-4" />
                    Duyệt đề thi
                  </button>
                </>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <PenTool className="size-4" />
                  Chỉnh sửa đề thi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}