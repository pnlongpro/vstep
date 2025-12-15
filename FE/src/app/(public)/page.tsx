import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Nền tảng luyện thi VSTEP chuyên nghiệp
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Luyện thi 4 kỹ năng với AI chấm điểm tự động. Nâng cao trình độ tiếng Anh của bạn ngay hôm nay!
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg">Đăng ký miễn phí</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tính năng nổi bật
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Luyện tập 4 kỹ năng"
              description="Reading, Listening, Writing, Speaking với đề thi chuẩn VSTEP"
            />
            <FeatureCard
              title="AI chấm điểm"
              description="Chấm tự động Writing & Speaking với feedback chi tiết"
            />
            <FeatureCard
              title="Theo dõi tiến độ"
              description="Dashboard trực quan, thống kê chi tiết điểm số"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
