export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Về VSTEPRO</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Giới thiệu</h2>
        <p className="text-muted-foreground leading-relaxed">
          VSTEPRO là nền tảng luyện thi VSTEP (Vietnamese Standardized Test of English Proficiency) 
          hàng đầu tại Việt Nam. Chúng tôi cung cấp giải pháp học tập toàn diện với công nghệ AI 
          chấm điểm tự động cho Writing và Speaking.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sứ mệnh</h2>
        <p className="text-muted-foreground leading-relaxed">
          Giúp người học Việt Nam tiếp cận chất lượng giáo dục tiếng Anh đẳng cấp quốc tế 
          với chi phí hợp lý và công nghệ hiện đại.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Liên hệ</h2>
        <div className="space-y-2 text-muted-foreground">
          <p>Email: support@vstepro.com</p>
          <p>Hotline: 1900 xxxx</p>
          <p>Địa chỉ: Hà Nội, Việt Nam</p>
        </div>
      </section>
    </div>
  );
}
