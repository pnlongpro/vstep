// Mock data cho bài thi Listening đầy đủ (35 câu, 3 Parts)
// Copy từ ExamInterface.tsx - Đề số 01

export const listeningFullTestData = {
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
              question: "What is the speaker's opinion?",
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
