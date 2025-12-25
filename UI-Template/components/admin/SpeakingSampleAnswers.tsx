import { AlertCircle } from 'lucide-react';

interface SpeakingSampleAnswersProps {
  part: 1 | 2 | 3;
  data: any;
  setData: (data: any) => void;
}

export function SpeakingSampleAnswers({ part, data, setData }: SpeakingSampleAnswersProps) {
  if (part === 1) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
        <label className="block text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
          <AlertCircle className="size-4" />
          Đáp án mẫu Part 1 - Để học viên tham khảo
        </label>
        <textarea
          rows={6}
          placeholder="Nhập câu trả lời mẫu cho Part 1...&#10;&#10;Q: What do you do in your free time?&#10;A: In my free time, I enjoy reading books and playing sports. I find that reading helps me relax and expand my knowledge, while sports keep me physically fit and energized.&#10;&#10;Q: Do you prefer staying at home or going out?&#10;A: I prefer a balance between both. During weekdays, I enjoy staying at home to rest, but on weekends, I like going out to meet friends or explore new places."
          value={data.part1.sampleAnswer || ''}
          onChange={(e) => setData({ ...data, part1: { ...data.part1, sampleAnswer: e.target.value } })}
          className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-sm resize-none font-mono"
        />
        <p className="text-xs text-yellow-700 mt-2 flex items-start gap-1">
          <span>💡</span>
          <span>Học viên sẽ thấy các câu trả lời mẫu này sau khi nộp bài để tham khảo cách trả lời tự nhiên, từ vựng, cấu trúc câu...</span>
        </p>
      </div>
    );
  }

  if (part === 2) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
        <label className="block text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
          <AlertCircle className="size-4" />
          Đáp án mẫu Part 2 - Để học viên tham khảo
        </label>
        <textarea
          rows={10}
          placeholder="Nhập script/transcript mẫu cho Part 2...&#10;&#10;I'd like to talk about a memorable trip I took to Da Nang last summer. It was in July, and I went there with my family for a week.&#10;&#10;Da Nang is a beautiful coastal city in central Vietnam, famous for its stunning beaches and bridges. We stayed at a hotel near My Khe Beach, which has been rated as one of the most beautiful beaches in the world.&#10;&#10;During the trip, we visited many interesting places such as the Marble Mountains, Ba Na Hills, and the Dragon Bridge. What made this trip truly memorable was...&#10;&#10;Overall, it was an unforgettable experience that brought my family closer together."
          value={data.part2.sampleAnswer || ''}
          onChange={(e) => setData({ ...data, part2: { ...data.part2, sampleAnswer: e.target.value } })}
          className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-sm resize-none font-mono"
        />
        <p className="text-xs text-yellow-700 mt-2 flex items-start gap-1">
          <span>💡</span>
          <span>Học viên sẽ thấy bài nói mẫu này (2 phút) sau khi nộp bài để tham khảo cách triển khai ý, từ vựng, cấu trúc...</span>
        </p>
      </div>
    );
  }

  if (part === 3) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
        <label className="block text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
          <AlertCircle className="size-4" />
          Đáp án mẫu Part 3 - Để học viên tham khảo
        </label>
        <textarea
          rows={8}
          placeholder="Nhập câu trả lời mẫu cho Part 3...&#10;&#10;Q: Do you think traveling is important for young people? Why?&#10;A: Yes, I strongly believe that traveling is extremely important for young people. First of all, it broadens their horizons and exposes them to different cultures, which helps develop a more open-minded perspective. Additionally, traveling teaches valuable life skills such as independence, problem-solving, and adaptability...&#10;&#10;Q: How has tourism changed in your country over the past decade?&#10;A: Tourism in Vietnam has undergone significant changes in the past decade. With improved infrastructure and international promotion, we've seen a dramatic increase in both domestic and international tourists..."
          value={data.part3.sampleAnswer || ''}
          onChange={(e) => setData({ ...data, part3: { ...data.part3, sampleAnswer: e.target.value } })}
          className="w-full px-4 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-sm resize-none font-mono"
        />
        <p className="text-xs text-yellow-700 mt-2 flex items-start gap-1">
          <span>💡</span>
          <span>Học viên sẽ thấy các câu trả lời mẫu này sau khi nộp bài để tham khảo cách trả lời sâu, lập luận, từ vựng academic...</span>
        </p>
      </div>
    );
  }

  return null;
}
