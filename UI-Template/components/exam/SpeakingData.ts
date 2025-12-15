// Mock data cho bài thi Speaking VSTEP chuẩn
export const mockSpeakingData = {
  directions: `Directions: In this part of the test, you will answer questions about familiar topics. Your responses will be recorded. Please speak clearly into the microphone.`,
  preparationTime: 60, // 60 seconds to prepare headset and microphone
  parts: [
    {
      id: 'S1',
      title: 'PART I: SOCIAL INTERACTION (~ 3 mins)',
      instruction: '',
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
    },
    {
      id: 'S2',
      title: 'PART II: SOLUTION DISCUSSION (~ 4 mins)',
      instruction: '',
      situation: 'You are planning to redecorate your living room to make it more comfortable and functional. You have a limited budget and need to decide what to focus on. What will you suggest?',
      options: [
        'Buy new furniture such as a sofa, coffee table, and shelves.',
        'Repaint the walls and change the curtains and decorations.',
        'Install better lighting and add some indoor plants.',
      ],
      note: 'There are THREE options for you to choose:',
    },
    {
      id: 'S3',
      title: 'PART III: TOPIC DEVELOPMENT (~ 5 mins)',
      instruction: '',
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
    },
  ],
};