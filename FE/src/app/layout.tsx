import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "VSTEPRO - Nền tảng luyện thi VSTEP",
  description: "Hệ thống luyện thi VSTEP chuyên nghiệp với AI chấm điểm tự động",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
