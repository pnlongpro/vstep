/**
 * Footer Configuration
 * This file contains all footer content that can be managed by Admin/CMS
 * 
 * TODO: Replace with API calls to CMS/Admin panel
 */

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order?: number;
}

export interface FooterSection {
  id: string;
  title: string;
  icon?: string;
  links: FooterLink[];
  enabled: boolean;
}

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'youtube' | 'zalo' | 'instagram' | 'tiktok' | 'twitter';
  label: string;
  href: string;
  enabled: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  organization: string;
  address?: string;
}

export interface FooterConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
    logoUrl?: string;
  };
  contact: ContactInfo;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  legalLinks: FooterLink[];
  trustBadges: {
    security: boolean;
    aiTransparency: boolean;
    officialFormat: boolean;
  };
  bottomBar: {
    copyright: string;
    tagline: string;
    additionalInfo?: string;
  };
}

/**
 * Default Footer Configuration
 * This can be replaced with data from Admin panel or CMS
 */
export const defaultFooterConfig: FooterConfig = {
  brand: {
    name: 'VSTEPRO',
    tagline: 'Nền tảng luyện thi VSTEP Online',
    description: 'Luyện thi VSTEP 4 kỹ năng với hệ thống bài tập chuẩn đề, chấm AI Speaking & Writing chi tiết, lộ trình cá nhân hóa.',
  },
  
  contact: {
    email: 'support@vsteppro.vn',
    phone: '0xxx xxx xxx',
    organization: 'Trung tâm VSTEPRO',
    address: 'Hà Nội, Việt Nam',
  },
  
  sections: [
    {
      id: 'courses',
      title: 'Khóa học & Luyện tập',
      icon: 'BookOpen',
      enabled: true,
      links: [
        { id: 'course-b1', label: 'Luyện thi VSTEP B1', href: '/courses/b1', enabled: true, order: 1 },
        { id: 'course-b2', label: 'Luyện thi VSTEP B2', href: '/courses/b2', enabled: true, order: 2 },
        { id: 'course-c1', label: 'Luyện thi VSTEP C1', href: '/courses/c1', enabled: true, order: 3 },
        { id: 'mock-test', label: 'Mock Test VSTEP Online', href: '/mock-test', enabled: true, order: 4 },
        { id: 'ai-grading', label: 'Chấm bài Speaking & Writing', href: '/ai-grading', enabled: true, order: 5 },
        { id: 'materials', label: 'Tài liệu VSTEP miễn phí', href: '/materials', enabled: true, order: 6 },
      ],
    },
    {
      id: 'support',
      title: 'Hỗ trợ học viên',
      icon: 'HelpCircle',
      enabled: true,
      links: [
        { id: 'guide', label: 'Hướng dẫn sử dụng', href: '/guide', enabled: true, order: 1 },
        { id: 'faq', label: 'Câu hỏi thường gặp (FAQ)', href: '/faq', enabled: true, order: 2 },
        { id: 'ai-process', label: 'Quy trình chấm AI', href: '/ai-process', enabled: true, order: 3 },
        { id: 'teacher-grading', label: 'Quy trình giáo viên chấm bài', href: '/teacher-grading', enabled: true, order: 4 },
        { id: 'refund', label: 'Chính sách hoàn phí', href: '/refund-policy', enabled: true, order: 5 },
        { id: 'blog', label: 'Blog / Kinh nghiệm thi VSTEP', href: '/blog', enabled: true, order: 6 },
      ],
    },
  ],
  
  socialLinks: [
    { id: 'facebook', platform: 'facebook', label: 'Facebook', href: 'https://facebook.com/vstepro', enabled: true },
    { id: 'youtube', platform: 'youtube', label: 'YouTube', href: 'https://youtube.com/vstepro', enabled: true },
    { id: 'zalo', platform: 'zalo', label: 'Zalo OA', href: 'https://zalo.me/vstepro', enabled: true },
  ],
  
  legalLinks: [
    { id: 'terms', label: 'Điều khoản sử dụng', href: '/terms', enabled: true, order: 1 },
    { id: 'privacy', label: 'Chính sách bảo mật', href: '/privacy', enabled: true, order: 2 },
    { id: 'payment', label: 'Chính sách thanh toán', href: '/payment-policy', enabled: true, order: 3 },
    { id: 'ai-data', label: 'Chính sách dữ liệu & AI', href: '/ai-data-policy', enabled: true, order: 4 },
  ],
  
  trustBadges: {
    security: true,
    aiTransparency: true,
    officialFormat: true,
  },
  
  bottomBar: {
    copyright: '© 2024 VSTEPRO. All rights reserved.',
    tagline: 'Made with ❤️ for VSTEP learners',
    additionalInfo: 'Nền tảng luyện thi VSTEP trực tuyến',
  },
};

/**
 * Get footer configuration
 * In the future, this will fetch from API/CMS
 */
export async function getFooterConfig(): Promise<FooterConfig> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/footer-config');
  // return response.json();
  
  return defaultFooterConfig;
}

/**
 * Update footer configuration (Admin only)
 */
export async function updateFooterConfig(config: Partial<FooterConfig>): Promise<void> {
  // TODO: Implement API call to update footer config
  console.log('Updating footer config:', config);
  
  // For now, just log to console
  // In production, this would send to backend:
  // await fetch('/api/admin/footer-config', {
  //   method: 'PUT',
  //   body: JSON.stringify(config),
  // });
}

/**
 * Toggle footer link enabled/disabled (Admin)
 */
export async function toggleFooterLink(sectionId: string, linkId: string, enabled: boolean): Promise<void> {
  // TODO: Implement API call
  console.log(`Toggle link ${linkId} in section ${sectionId}: ${enabled}`);
}

/**
 * Update contact information (Admin)
 */
export async function updateContactInfo(contact: ContactInfo): Promise<void> {
  // TODO: Implement API call
  console.log('Updating contact info:', contact);
}

/**
 * Update social links (Admin)
 */
export async function updateSocialLinks(links: SocialLink[]): Promise<void> {
  // TODO: Implement API call
  console.log('Updating social links:', links);
}
