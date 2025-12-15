export const listeningQuestions = [
  // ===========================
  // PART 1: SHORT CONVERSATIONS
  // ===========================
  {
    id: 'listen_part1_fulltest_b1',
    level: 'B1',
    type: 'short',
    part: 1,
    title: 'Part 1: Short Conversations - Full Test',
    description: '8 đoạn hội thoại ngắn theo chuẩn VSTEP',
    duration: 10,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    transcript: `[8 short conversations combined]
Conversation 1: At the restaurant
Conversation 2: Making an appointment
Conversation 3: Shopping
Conversation 4: At the library
Conversation 5: Travel plans
Conversation 6: Weather discussion
Conversation 7: Job interview
Conversation 8: School registration`,
    questions: [
      {
        question: 'What does the man want to order?',
        options: [
          'A steak with salad',
          'Pasta with vegetables',
          'Fish and chips',
          'Chicken soup',
        ],
        correctAnswer: 'A',
        explanation: 'The man says "I\'ll have the steak with salad, please."',
      },
      {
        question: 'When is the woman\'s appointment?',
        options: [
          'Monday at 9 AM',
          'Tuesday at 2 PM',
          'Wednesday at 10 AM',
          'Thursday at 3 PM',
        ],
        correctAnswer: 'C',
        explanation: 'The receptionist confirms "Wednesday at 10 AM."',
      },
      {
        question: 'How much does the dress cost?',
        options: [
          '$45',
          '$55',
          '$65',
          '$75',
        ],
        correctAnswer: 'B',
        explanation: 'The saleswoman states "It\'s $55, but we have a 10% discount today."',
      },
      {
        question: 'Where can the student find the history books?',
        options: [
          'On the first floor',
          'On the second floor, Section A',
          'On the third floor, Section B',
          'In the basement',
        ],
        correctAnswer: 'B',
        explanation: 'The librarian says "History books are on the second floor, Section A."',
      },
      {
        question: 'What time does the train to Boston leave?',
        options: [
          '7:15 AM',
          '8:30 AM',
          '9:45 AM',
          '10:00 AM',
        ],
        correctAnswer: 'C',
        explanation: 'The announcement states "The train to Boston departs at 9:45 AM."',
      },
      {
        question: 'What will the weather be like tomorrow?',
        options: [
          'Sunny and warm',
          'Cloudy with rain',
          'Windy and cold',
          'Snowy',
        ],
        correctAnswer: 'B',
        explanation: 'The forecast mentions "Tomorrow will be cloudy with occasional rain."',
      },
      {
        question: 'What position is the woman applying for?',
        options: [
          'Marketing Manager',
          'Sales Representative',
          'Customer Service Agent',
          'Accountant',
        ],
        correctAnswer: 'A',
        explanation: 'She says "I\'m very interested in the Marketing Manager position."',
      },
      {
        question: 'When does the registration deadline end?',
        options: [
          'Next Monday',
          'Next Friday',
          'This Friday',
          'This Wednesday',
        ],
        correctAnswer: 'C',
        explanation: 'The advisor reminds "Remember, registration closes this Friday."',
      },
    ],
  },
  {
    id: 'listen_b1_001',
    level: 'B1',
    type: 'short',
    part: 1,
    title: 'Making Restaurant Reservations',
    description: 'Hội thoại ngắn về đặt bàn nhà hàng',
    duration: 10,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    transcript: `Man: Hello, I'd like to make a reservation for dinner tonight.
Woman: Certainly, sir. For how many people?
Man: Four people, please.
Woman: And what time would you prefer?
Man: Around 7 PM, if possible.
Woman: Let me check... Yes, we have a table available at 7 PM. May I have your name, please?
Man: It's Johnson. Mark Johnson.
Woman: Perfect, Mr. Johnson. We have your reservation for four people at 7 PM this evening. We look forward to seeing you.
Man: Thank you very much.`,
    questions: [
      {
        question: 'How many people is the reservation for?',
        options: [
          'Two people',
          'Three people',
          'Four people',
          'Five people',
        ],
        correctAnswer: 'C',
        explanation: 'The man clearly states "Four people, please."',
      },
      {
        question: 'What time does the man want to have dinner?',
        options: [
          '6 PM',
          '7 PM',
          '8 PM',
          '9 PM',
        ],
        correctAnswer: 'B',
        explanation: 'The man requests "Around 7 PM, if possible."',
      },
      {
        question: 'What is the man\'s name?',
        options: [
          'John Martin',
          'Mark Jones',
          'Mark Johnson',
          'Mike Johnson',
        ],
        correctAnswer: 'C',
        explanation: 'He introduces himself as "Mark Johnson."',
      },
      {
        question: 'When is the reservation for?',
        options: [
          'Tomorrow',
          'This evening',
          'Next week',
          'This afternoon',
        ],
        correctAnswer: 'B',
        explanation: 'The woman confirms "your reservation... at 7 PM this evening."',
      },
    ],
  },
  {
    id: 'listen_a2_001',
    level: 'A2',
    type: 'short',
    part: 1,
    title: 'Shopping at the Supermarket',
    description: 'Hội thoại ngắn tại siêu thị',
    duration: 8,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    transcript: `Woman: Excuse me, where can I find the milk?
Man: The dairy products are in aisle 3, at the back of the store.
Woman: Thank you. And do you have fresh bread?
Man: Yes, the bakery section is right over there, next to the entrance.
Woman: Great! One more thing - are the tomatoes on sale today?
Man: Yes, they are. All vegetables are 20% off today.
Woman: Perfect! Thank you for your help.`,
    questions: [
      {
        question: 'Where is the milk located?',
        options: [
          'Aisle 2',
          'Aisle 3',
          'Aisle 4',
          'At the entrance',
        ],
        correctAnswer: 'B',
        explanation: 'The man says "The dairy products are in aisle 3."',
      },
      {
        question: 'Where is the bakery section?',
        options: [
          'At the back',
          'In the middle',
          'Next to the entrance',
          'Upstairs',
        ],
        correctAnswer: 'C',
        explanation: 'The bakery section is "right over there, next to the entrance."',
      },
      {
        question: 'How much discount do vegetables have today?',
        options: [
          '10% off',
          '15% off',
          '20% off',
          '25% off',
        ],
        correctAnswer: 'C',
        explanation: 'The man states "All vegetables are 20% off today."',
      },
    ],
  },
];