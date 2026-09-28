'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Languages, Sparkles, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onStartNew?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartNew }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-[#161822]/95 light:bg-white/95 backdrop-blur-md border-b border-[#262B3B] light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Wordmark & Tagline */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={onStartNew}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] light:from-[#1F4E79] light:to-[#163857] flex items-center justify-center text-white font-black text-xl tracking-wider shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-white light:text-[#1F4E79]">
                  AAKAR
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-500/15 light:bg-amber-50 text-amber-400 light:text-[#F28C28] border border-amber-500/30 light:border-amber-200 hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400 light:text-[#F28C28]" />
                  SIH 2026 • PS SIH26091
                </span>
              </div>
              <p className="text-xs text-slate-400 light:text-slate-500 font-medium truncate max-w-xs sm:max-w-md md:max-w-xl">
                {t('brand.tagline')}
              </p>
            </div>
          </div>

          {/* Right controls: Theme Toggle, Language Toggle & Mobile Tag */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-500/15 light:bg-amber-50 text-amber-400 light:text-[#F28C28] border border-amber-500/30 light:border-amber-200 sm:hidden">
              SIH26091
            </span>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#222634] light:bg-slate-100 text-slate-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 border border-[#2E3548] light:border-slate-200 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark/light theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#222634] light:bg-slate-100 p-1 rounded-lg border border-[#2E3548] light:border-slate-200 text-xs font-semibold">
              <Languages className="w-3.5 h-3.5 text-slate-400 light:text-slate-500 ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#38BDF8] light:bg-white text-slate-950 light:text-[#1F4E79] shadow-xs font-bold'
                    : 'text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[#38BDF8] light:bg-white text-slate-950 light:text-[#1F4E79] shadow-xs font-bold'
                    : 'text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
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
