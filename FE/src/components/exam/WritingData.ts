// Mock data cho bài thi Writing
export const mockWritingData = {
  directions: `Directions: In this part of the test, you will complete two writing tasks. You should write your answers clearly in pen. You will have 60 minutes to complete both tasks.`,
  parts: [
    {
      id: 'W1',
      title: 'PART 1',
      timeRecommendation: 'You should spend about 20 minutes on this task.',
      instruction: `You received an email from your English friend, Jane. She asked you for some information about one of your friends. Read part of her email below.`,
      prompt: `I've just got an email from your friend, An. She said she's going to take a course in London this summer. She asked if she could stay with my family until she could find an apartment. Can you tell me a bit about her (things like her personality, hobbies and interests, and her current work or study if possible)? I want to see if she will fit in with my family.`,
      task: 'Write an email responding to Jane.',
      requirements: 'You should write at least 120 words. You do not need to include your name or addresses. Your response will be evaluated in terms of Task Fulfillment, Organization, Vocabulary and Grammar.',
      minWords: 120,
      maxWords: 140,
    },
    {
      id: 'W2',
      title: 'PART 2',
      timeRecommendation: 'You should spend about 40 minutes on this task.',
      instruction: `You should write an essay on the following topic:`,
      prompt: `Some people believe that technology has made our lives easier and more convenient. Others argue that technology has made us more dependent and less capable of doing things ourselves.

Discuss both views and give your own opinion.`,
      task: 'Write your essay.',
      requirements: 'You should write at least 250 words. Your response will be evaluated in terms of Task Fulfillment, Organization, Vocabulary and Grammar.',
      minWords: 250,
      maxWords: 300,
    },
  ],
};
