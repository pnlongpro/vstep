// VSTEP Speaking Tasks - Theo format chuẩn VSTEP (lấy từ bộ đề thi thử)

export const speakingTasks = [
  // ============ PART 1: SOCIAL INTERACTION ============
  // B1 Level - Part 1
  {
    id: 31,
    level: 'B1',
    part: 'part1',
    title: 'Bài tập 1: Giới thiệu bản thân',
    preparationTime: 0,
    speakingTime: 180,
    topics: [
      {
        title: "Let's talk about yourself",
        questions: [
          'Can you tell me about yourself?',
          'Where are you from?',
          'What do you do for a living?',
          'What are your hobbies?',
          'What do you like to do in your free time?',
        ],
      },
    ],
    tips: [
      'Trả lời tự nhiên như khi trò chuyện bình thường',
      'Đưa ra ví dụ cụ thể từ cuộc sống hàng ngày',
      'Không cần trả lời quá dài, 2-3 câu cho mỗi câu hỏi',
    ],
  },

  // A2 Level - Part 1
  {
    id: 32,
    level: 'A2',
    part: 'part1',
    title: 'Bài tập 2: Nói về sở thích',
    preparationTime: 0,
    speakingTime: 180,
    topics: [
      {
        title: "Let's talk about your hobbies",
        questions: [
          'What do you like to do in your free time?',
          'How often do you do these activities?',
          'Do you prefer doing hobbies alone or with friends?',
          'What hobby would you like to try in the future?',
          'Why do you enjoy these activities?',
        ],
      },
    ],
    tips: [
      'Mô tả đơn giản và rõ ràng',
      'Sử dụng từ vựng quen thuộc',
      'Trả lời đầy đủ về sở thích cá nhân',
    ],
  },

  // ============ PART 2: SOLUTION DISCUSSION ============
  // B2 Level - Part 2
  {
    id: 33,
    level: 'B2',
    part: 'part2',
    title: 'Bài tập 3: Diễn thuyết về môi trường',
    preparationTime: 0,
    speakingTime: 240,
    situation: 'Your local community wants to improve environmental protection. You need to suggest the best approach. What will you suggest?',
    note: 'There are THREE options for you to choose:',
    options: [
      'Organize regular community clean-up activities.',
      'Create an educational campaign about recycling and waste reduction.',
      'Plant more trees and create green spaces in the neighborhood.',
    ],
    tips: [
      'Đánh giá toàn diện từng lựa chọn',
      'Xem xét các yếu tố: chi phí, thời gian, hiệu quả',
      'Trình bày logic và thuyết phục',
    ],
  },

  // B1 Level - Part 2
  {
    id: 34,
    level: 'B1',
    part: 'part2',
    title: 'Bài tập 4: Diễn thuyết về du lịch',
    preparationTime: 0,
    speakingTime: 240,
    situation: 'You are planning a vacation with your family. You need to decide where to go. What will you choose?',
    note: 'There are THREE options for you to choose:',
    options: [
      'Visit a beach resort for relaxation.',
      'Explore a historical city to learn about culture.',
      'Go to a mountain area for adventure activities.',
    ],
    tips: [
      'Thảo luận đầy đủ cả 3 options',
      'Phân tích ưu nhược điểm của từng lựa chọn',
      'Đưa ra quyết định cuối cùng có lý do rõ ràng',
    ],
  },

  // ============ PART 3: TOPIC DEVELOPMENT ============
  // C1 Level - Part 3
  {
    id: 35,
    level: 'C1',
    part: 'part3',
    title: 'Bài tập 5: Thảo luận văn hóa',
    preparationTime: 0,
    speakingTime: 300,
    topic: 'Factors that influence cultural identity in modern society?',
    mindMap: {
      center: 'Cultural Identity',
      nodes: [
        'Language & traditions',
        'Media & technology',
        'Your own ideas',
        'Education system',
      ],
    },
    questions: [
      'How does globalization affect local cultures?',
      'Should countries preserve traditional customs in the modern world?',
      'What role does language play in maintaining cultural identity?',
    ],
    tips: [
      'Phân tích đa chiều và có chiều sâu',
      'Thể hiện hiểu biết rộng về vấn đề xã hội',
      'Sử dụng ngôn ngữ học thuật và chính xác',
    ],
  },

  // B2 Level - Part 3
  {
    id: 36,
    level: 'B2',
    part: 'part3',
    title: 'Bài tập 6: Thảo luận xã hội',
    preparationTime: 0,
    speakingTime: 300,
    topic: 'Factors that affect social relationships in modern life?',
    mindMap: {
      center: 'Social Relationships',
      nodes: [
        'Social media',
        'Work-life balance',
        'Your own ideas',
        'Community activities',
      ],
    },
    questions: [
      'How has technology changed the way people interact?',
      'Do you think people are more isolated now than in the past?',
      'What can communities do to strengthen social bonds?',
    ],
    tips: [
      'Phát triển ý tưởng sâu và toàn diện',
      'So sánh và đối chiếu các yếu tố khác nhau',
      'Thể hiện quan điểm cá nhân có cơ sở',
    ],
  },
];