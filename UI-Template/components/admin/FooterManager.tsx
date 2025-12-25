/**
 * Footer Manager Component (Admin Only)
 * Allows admins to manage footer content, links, and settings
 */

import { useState, useEffect } from 'react';
import { 
  Save, Plus, Trash2, Edit, Eye, EyeOff, ChevronDown, ChevronUp,
  Facebook, Youtube, MessageCircle, Lock, Bot, GraduationCap,
  Mail, Phone, MapPin, ExternalLink, AlertCircle
} from 'lucide-react';
import { 
  FooterConfig, 
  FooterSection, 
  FooterLink, 
  SocialLink,
  getFooterConfig,
  updateFooterConfig,
  toggleFooterLink
} from '../../config/footerConfig';

export function FooterManager() {
  const [config, setConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['brand', 'contact']);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await getFooterConfig();
      setConfig(data);
    } catch (error) {
      console.error('Error loading footer config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      await updateFooterConfig(config);
      setHasChanges(false);
      alert('✅ Đã lưu cấu hình Footer thành công!');
    } catch (error) {
      console.error('Error saving footer config:', error);
      alert('❌ Lỗi khi lưu. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const updateBrand = (field: keyof FooterConfig['brand'], value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      brand: { ...config.brand, [field]: value }
    });
    setHasChanges(true);
  };

  const updateContact = (field: keyof FooterConfig['contact'], value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      contact: { ...config.contact, [field]: value }
    });
    setHasChanges(true);
  };

  const toggleLinkEnabled = async (sectionId: string, linkId: string) => {
    if (!config) return;
    
    const updatedSections = config.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          links: section.links.map(link => 
            link.id === linkId ? { ...link, enabled: !link.enabled } : link
          )
        };
      }
      return section;
    });

    setConfig({ ...config, sections: updatedSections });
    setHasChanges(true);
    
    // Also update in backend
    const link = config.sections
      .find(s => s.id === sectionId)
      ?.links.find(l => l.id === linkId);
    
    if (link) {
      await toggleFooterLink(sectionId, linkId, !link.enabled);
    }
  };

  const toggleSocialEnabled = (socialId: string) => {
    if (!config) return;
    
    const updatedSocials = config.socialLinks.map(social =>
      social.id === socialId ? { ...social, enabled: !social.enabled } : social
    );
    
    setConfig({ ...config, socialLinks: updatedSocials });
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-red-700 mt-1">Không thể tải cấu hình Footer. Vui lòng thử lại.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Footer</h1>
          <p className="text-sm text-gray-600 mt-1">
            Cấu hình nội dung, liên kết và thông tin hiển thị ở Footer website
          </p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            hasChanges && !saving
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save className="size-4" />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Brand Section */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('brand')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent hover:from-blue-100 transition-colors"
        >
          <h2 className="font-semibold text-gray-900">Thương hiệu & Giới thiệu</h2>
          {expandedSections.includes('brand') ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
        
        {expandedSections.includes('brand') && (
          <div className="p-6 space-y-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên thương hiệu</label>
              <input
                type="text"
                value={config.brand.name}
                onChange={(e) => updateBrand('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
              <input
                type="text"
                value={config.brand.tagline}
                onChange={(e) => updateBrand('tagline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả (2 dòng)</label>
              <textarea
                value={config.brand.description}
                onChange={(e) => updateBrand('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('contact')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-transparent hover:from-green-100 transition-colors"
        >
          <h2 className="font-semibold text-gray-900">Thông tin liên hệ</h2>
          {expandedSections.includes('contact') ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
        
        {expandedSections.includes('contact') && (
          <div className="p-6 space-y-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="size-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={config.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="size-4" />
                  Hotline / Zalo
                </label>
                <input
                  type="tel"
                  value={config.contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="size-4" />
                Đơn vị vận hành
              </label>
              <input
                type="text"
                value={config.contact.organization}
                onChange={(e) => updateContact('organization', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </section>

      {/* Footer Sections (Courses & Support) */}
      {config.sections.map(section => (
        <section key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-orange-50 to-transparent hover:from-orange-100 transition-colors"
          >
            <h2 className="font-semibold text-gray-900">{section.title}</h2>
            {expandedSections.includes(section.id) ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
          </button>
          
          {expandedSections.includes(section.id) && (
            <div className="p-6 border-t border-gray-200">
              <div className="space-y-2">
                {section.links.map(link => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLinkEnabled(section.id, link.id)}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          link.enabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          link.enabled ? 'translate-x-5' : 'translate-x-1'
                        }`} />
                      </button>
                      <span className={link.enabled ? 'text-gray-900' : 'text-gray-400'}>{link.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{link.href}</span>
                      {link.enabled ? (
                        <Eye className="size-4 text-green-600" />
                      ) : (
                        <EyeOff className="size-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      {/* Social Media Links */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('social')}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-transparent hover:from-purple-100 transition-colors"
        >
          <h2 className="font-semibold text-gray-900">Mạng xã hội</h2>
          {expandedSections.includes('social') ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
        
        {expandedSections.includes('social') && (
          <div className="p-6 border-t border-gray-200">
            <div className="space-y-3">
              {config.socialLinks.map(social => (
                <div key={social.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleSocialEnabled(social.id)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        social.enabled ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        social.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                    {social.platform === 'facebook' && <Facebook className="size-5 text-blue-600" />}
                    {social.platform === 'youtube' && <Youtube className="size-5 text-red-600" />}
                    {social.platform === 'zalo' && <MessageCircle className="size-5 text-blue-500" />}
                    <span className="font-medium">{social.label}</span>
                  </div>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {social.href}
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Save Button (Bottom) */}
      {hasChanges && (
        <div className="sticky bottom-6 flex justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Save className="size-5" />
            {saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
          </button>
        </div>
      )}
    </div>
  );
}
