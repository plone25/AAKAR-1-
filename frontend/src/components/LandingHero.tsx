'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, 
  Target, 
  Users, 
  Compass, 
  Coins, 
  Calculator, 
  Landmark,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface LandingHeroProps {
  onStartAnalysis: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartAnalysis }) => {
  const { t } = useLanguage();

  const problemCards = [
    {
      id: 'right_business',
      icon: Target,
      accent: 'border-l-4 border-l-[#1F4E79]',
      title: t('hero.problems.right_business.title'),
      desc: t('hero.problems.right_business.desc'),
    },
    {
      id: 'local_demand',
      icon: Users,
      accent: 'border-l-4 border-l-[#2E8B3E]',
      title: t('hero.problems.local_demand.title'),
      desc: t('hero.problems.local_demand.desc'),
    },
    {
      id: 'competition',
      icon: Compass,
      accent: 'border-l-4 border-l-[#F28C28]',
      title: t('hero.problems.competition.title'),
      desc: t('hero.problems.competition.desc'),
    },
    {
      id: 'pricing',
      icon: Coins,
      accent: 'border-l-4 border-l-[#1F4E79]',
      title: t('hero.problems.pricing.title'),
      desc: t('hero.problems.pricing.desc'),
    },
    {
      id: 'loan_planning',
      icon: Calculator,
      accent: 'border-l-4 border-l-[#2E8B3E]',
      title: t('hero.problems.loan_planning.title'),
      desc: t('hero.problems.loan_planning.desc'),
    },
    {
      id: 'scheme_selection',
      icon: Landmark,
      accent: 'border-l-4 border-l-[#F28C28]',
      title: t('hero.problems.scheme_selection.title'),
      desc: t('hero.problems.scheme_selection.desc'),
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#1F4E79] text-xs font-semibold tracking-wide border border-slate-200 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
          <span>{t('hero.badge')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight sm:leading-tight">
          {t('hero.title')}
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* CTA Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStartAnalysis}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-white font-bold text-base bg-[#F28C28] hover:bg-[#D97706] shadow-sm transition-all transform active:scale-98 cursor-pointer"
          >
            <span>{t('hero.cta')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E8B3E]" />
            <span>24 Jharkhand Districts Socio-Economic Data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E8B3E]" />
            <span>90% Govt Loan & Moratorium Structuring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2E8B3E]" />
            <span>100% Free for Rural Entrepreneurs</span>
          </div>
        </div>
      </div>

      {/* The 6 Problems We Solve */}
      <div className="mt-16 sm:mt-24 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F4E79] tracking-tight">
            {t('hero.features_title')}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {t('hero.features_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problemCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`sih-card p-6 ${card.accent} flex flex-col justify-between`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[#1F4E79] mb-4">
                    <Icon className="w-5 h-5 text-[#1F4E79]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
