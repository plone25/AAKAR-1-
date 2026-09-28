'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 bg-white border-t border-slate-200 py-10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-base tracking-tight text-[#1F4E79]">
                AAKAR
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-sm font-semibold text-slate-800">
                Team CryptuS
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium border border-slate-200">
                SIH26091
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 max-w-xl">
              AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs.
              Built for Smart India Hackathon 2026.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#F28C28]" />
              <span>Smart India Hackathon 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E8B3E]" />
              <span>Ministry Guidelines Compliant</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 Team CryptuS • PS SIH26091 • AAKAR Platform</p>
          <p>Theme: Agriculture, Food Tech & Rural Development</p>
        </div>
      </div>
    </footer>
  );
};
