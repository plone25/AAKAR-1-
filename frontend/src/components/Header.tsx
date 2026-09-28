'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages, Sparkles } from 'lucide-react';

interface HeaderProps {
  onStartNew?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartNew }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark & Tagline */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={onStartNew}
          >
            <div className="w-10 h-10 rounded-lg bg-[#1F4E79] flex items-center justify-center text-white font-extrabold text-xl tracking-wider shadow-xs">
              A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-[#1F4E79]">
                  AAKAR
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-amber-50 text-[#F28C28] border border-amber-200 hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#F28C28]" />
                  SIH 2026 • PS SIH26091
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md md:max-w-xl">
                {t('brand.tagline')}
              </p>
            </div>
          </div>

          {/* Right controls: Language Toggle & SIH tag for mobile */}
          <div className="flex items-center space-x-3">
            <span className="text-xs px-2 py-0.5 rounded font-semibold bg-amber-50 text-[#F28C28] border border-amber-200 sm:hidden">
              SIH26091
            </span>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-all ${
                  language === 'en'
                    ? 'bg-white text-[#1F4E79] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded transition-all ${
                  language === 'hi'
                    ? 'bg-white text-[#1F4E79] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle tricolor line under header */}
      <div className="tricolor-stripe" />
    </header>
  );
};
