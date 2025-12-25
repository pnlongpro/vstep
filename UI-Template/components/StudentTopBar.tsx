import { MessageSquare, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function StudentTopBar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4">
      <div className="max-w-[1600px] mx-auto flex items-center justify-end text-sm">
        {/* Right: Language Switcher */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLanguage('vi')}
            className={`px-3 py-1 rounded-md transition-colors ${
              language === 'vi' 
                ? 'bg-white/20 font-semibold' 
                : 'hover:bg-white/10'
            }`}
          >
            🇻🇳 {t('topbar.vietnamese')}
          </button>
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-md transition-colors ${
              language === 'en' 
                ? 'bg-white/20 font-semibold' 
                : 'hover:bg-white/10'
            }`}
          >
            🇺🇸 {t('topbar.english')}
          </button>
        </div>
      </div>
    </div>
  );
}