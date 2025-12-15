export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Bảng giá</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard
          name="Miễn phí"
          price="0đ"
          features={[
            "10 bài luyện tập/tháng",
            "Chấm tự động R/L",
            "Dashboard cơ bản",
          ]}
        />
        <PricingCard
          name="Premium"
          price="299,000đ"
          features={[
            "Không giới hạn bài tập",
            "AI chấm W/S",
            "Dashboard nâng cao",
            "Thi thử không giới hạn",
          ]}
          highlighted
        />
        <PricingCard
          name="VIP"
          price="599,000đ"
          features={[
            "Tất cả Premium",
            "1-1 với giáo viên",
            "Lộ trình cá nhân hóa",
            "Ưu tiên hỗ trợ",
          ]}
        />
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  features,
  highlighted,
}: {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`border rounded-lg p-8 ${
        highlighted ? "border-primary shadow-lg scale-105" : ""
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-4xl font-bold mb-6">{price}</p>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
