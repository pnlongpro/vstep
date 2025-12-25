import { Heart, Mail, Phone, MapPin, Facebook, Youtube, MessageCircle, Shield, Lock, Bot, BookOpen, GraduationCap, FileText, HelpCircle, BookMarked, CreditCard, FileCheck, Database } from 'lucide-react';
import logoImage from 'figma:asset/0a20b2e75c15f09d98fc24bd0f6b028b4eeb4661.png';

interface FooterLink {
  label: string;
  href: string;
  enabled?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  // Footer sections - Can be managed via CMS/Admin in the future
  const coursesSection: FooterSection = {
    title: 'Khóa học & Luyện tập',
    links: [
      { label: 'Luyện thi VSTEP B1', href: '#', enabled: true },
      { label: 'Luyện thi VSTEP B2', href: '#', enabled: true },
      { label: 'Luyện thi VSTEP C1', href: '#', enabled: true },
      { label: 'Mock Test VSTEP Online', href: '#', enabled: true },
      { label: 'Chấm bài Speaking & Writing', href: '#', enabled: true },
      { label: 'Tài liệu VSTEP miễn phí', href: '#', enabled: true },
    ],
  };

  const supportSection: FooterSection = {
    title: 'Hỗ trợ học viên',
    links: [
      { label: 'Hướng dẫn sử dụng', href: '#', enabled: true },
      { label: 'Câu hỏi thường gặp (FAQ)', href: '#', enabled: true },
      { label: 'Quy trình chấm AI', href: '#', enabled: true },
      { label: 'Quy trình giáo viên chấm bài', href: '#', enabled: true },
      { label: 'Chính sách hoàn phí', href: '#', enabled: true },
      { label: 'Blog / Kinh nghiệm thi VSTEP', href: '#', enabled: true },
    ],
  };

  const legalLinks: FooterLink[] = [
    { label: 'Điều khoản sử dụng', href: '#', enabled: true },
    { label: 'Chính sách bảo mật', href: '#', enabled: true },
    { label: 'Chính sách thanh toán', href: '#', enabled: true },
    { label: 'Chính sách dữ liệu & AI', href: '#', enabled: true },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/vstepro', color: 'hover:text-blue-400' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/vstepro', color: 'hover:text-red-400' },
    { icon: MessageCircle, label: 'Zalo OA', href: 'https://zalo.me/vstepro', color: 'hover:text-blue-300' },
  ];

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-gray-300 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1 - Brand & Introduction */}
          <div className="space-y-4">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={handleLogoClick}
            >
              <img 
                src={logoImage} 
                alt="VSTEPRO Logo" 
                className="h-10 w-10 object-contain group-hover:scale-110 transition-transform"
              />
              <div>
                <h3 className="text-white font-bold text-lg">VSTEPRO</h3>
                <p className="text-xs text-gray-400">Nền tảng luyện thi VSTEP Online</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              Luyện thi VSTEP 4 kỹ năng với hệ thống bài tập chuẩn đề, 
              chấm AI Speaking & Writing chi tiết, lộ trình cá nhân hóa.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Lock className="size-3 text-green-500" />
                <span>Bảo mật dữ liệu</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Bot className="size-3 text-blue-500" />
                <span>AI chấm điểm minh bạch</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <GraduationCap className="size-3 text-orange-500" />
                <span>Chuẩn format Bộ GD&ĐT</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Courses & Practice */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="size-4 text-blue-400" />
              {coursesSection.title}
            </h4>
            <ul className="space-y-2.5">
              {coursesSection.links
                .filter(link => link.enabled !== false)
                .map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-start gap-2 group"
                    >
                      <span className="text-blue-600 group-hover:text-blue-400">›</span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Column 3 - Student Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="size-4 text-orange-400" />
              {supportSection.title}
            </h4>
            <ul className="space-y-2.5">
              {supportSection.links
                .filter(link => link.enabled !== false)
                .map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-orange-400 transition-colors flex items-start gap-2 group"
                    >
                      <span className="text-orange-600 group-hover:text-orange-400">›</span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Column 4 - Contact & Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Phone className="size-4 text-green-400" />
              Liên hệ & Pháp lý
            </h4>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a 
                href="mailto:support@vsteppro.vn"
                className="flex items-start gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors group"
              >
                <Mail className="size-4 mt-0.5 text-green-600 group-hover:text-green-400" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div>support@vsteppro.vn</div>
                </div>
              </a>
              
              <a 
                href="tel:0123456789"
                className="flex items-start gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors group"
              >
                <Phone className="size-4 mt-0.5 text-green-600 group-hover:text-green-400" />
                <div>
                  <div className="text-xs text-gray-500">Hotline / Zalo</div>
                  <div>0xxx xxx xxx</div>
                </div>
              </a>
              
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="size-4 mt-0.5 text-green-600" />
                <div>
                  <div className="text-xs text-gray-500">Đơn vị vận hành</div>
                  <div>Trung tâm VSTEPRO</div>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="space-y-2 mb-4 pt-4 border-t border-gray-800">
              {legalLinks
                .filter(link => link.enabled !== false)
                .map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors block"
                  >
                    {link.label}
                  </a>
                ))}
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center transition-all ${social.color} hover:bg-gray-700 hover:scale-110`}
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gradient-to-r from-gray-950 to-blue-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            {/* Copyright */}
            <div className="text-gray-500 text-center md:text-left">
              © 2024 VSTEPRO. All rights reserved.
            </div>

            {/* Made with Love */}
            <div className="flex items-center gap-1.5 text-gray-500">
              <span>Made with</span>
              <Heart className="size-4 text-red-500 fill-red-500 animate-pulse" />
              <span>for VSTEP learners</span>
            </div>

            {/* Optional: Version or additional info */}
            <div className="text-gray-600 text-xs hidden md:block">
              Nền tảng luyện thi VSTEP trực tuyến
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
