'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { formatIndianCurrency } from '../utils/formatters';
import { 
  Milk, 
  Store, 
  Scissors, 
  Sprout, 
  UtensilsCrossed, 
  Palette, 
  Wrench, 
  Layers, 
  MapPin, 
  Coins, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Edit3
} from 'lucide-react';

interface InputFormProps {
  districts: string[];
  categories: string[];
  onSubmit: (data: { location: string; margin: number; category: string }) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  districts,
  categories,
  onSubmit,
  isLoading,
}) => {
  const { t } = useLanguage();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('Ramgarh');
  const [isCustomLocation, setIsCustomLocation] = useState<boolean>(false);
  const [customLocationText, setCustomLocationText] = useState<string>('');
  
  const [marginCapital, setMarginCapital] = useState<number | string>(100000);
  const [selectedCategory, setSelectedCategory] = useState<string>('Handicrafts');
  const [error, setError] = useState<string | null>(null);

  // Category icons mapping
  const categoryIcons: Record<string, React.ElementType> = {
    Dairy: Milk,
    Retail: Store,
    Textiles: Scissors,
    Agriculture: Sprout,
    'Food Processing': UtensilsCrossed,
    Handicrafts: Palette,
    Services: Wrench,
    OTHER: Layers,
    Other: Layers,
  };

  const parsedMargin = typeof marginCapital === 'number' 
    ? marginCapital 
    : parseFloat(marginCapital) || 0;

  // Computed values: margin is 10% of total project cost
  const computedProjectCost = parsedMargin > 0 ? parsedMargin / 0.10 : 0;
  const computedLoanAmount = computedProjectCost > parsedMargin ? computedProjectCost - parsedMargin : 0;

  const quickPicks = [25000, 50000, 75000, 100000, 200000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const location = isCustomLocation ? customLocationText.trim() : selectedDistrict.trim();

    if (!location) {
      setError(t('form.validation_location'));
      return;
    }

    if (parsedMargin < 1) {
      setError(t('form.validation_margin_min'));
      return;
    }

    if (parsedMargin > 500000) {
      setError(t('form.validation_margin_max'));
      return;
    }

    if (!selectedCategory) {
      setError(t('form.validation_category'));
      return;
    }

    onSubmit({
      location,
      margin: parsedMargin,
      category: selectedCategory,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="analysis-form">
      <div className="sih-card p-6 sm:p-10 border border-slate-200">
        <div className="border-b border-slate-100 pb-6 mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-[#1F4E79] tracking-tight">
            {t('form.title')}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {t('form.subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Field 1: Geographic Location */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1F4E79]" />
                <span>1. {t('form.location_label')}</span>
              </label>

              <button
                type="button"
                onClick={() => setIsCustomLocation(!isCustomLocation)}
                className="text-xs font-semibold text-[#1F4E79] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isCustomLocation ? 'Select District' : 'Type Block/Village'}</span>
              </button>
            </div>

            {!isCustomLocation ? (
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-12 px-3.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent transition-all"
                >
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}, Jharkhand
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={customLocationText}
                  onChange={(e) => setCustomLocationText(e.target.value)}
                  placeholder={t('form.location_custom_placeholder')}
                  disabled={isLoading}
                  className="w-full h-12 px-3.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent transition-all"
                />
              </div>
            )}
            <p className="text-xs text-slate-500">
              {t('form.location_hint')}
            </p>
          </div>

          {/* Field 2: Margin Capital in ₹ */}
          <div className="space-y-3">
            <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#F28C28]" />
              <span>2. {t('form.margin_label')}</span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                ₹
              </div>
              <input
                type="number"
                min="1"
                max="500000"
                step="any"
                value={marginCapital}
                onChange={(e) => setMarginCapital(e.target.value)}
                disabled={isLoading}
                placeholder="100000"
                className="w-full h-12 pl-8 pr-4 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent transition-all"
              />
            </div>

            {/* Quick Pick Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 mr-1">Quick Select:</span>
              {quickPicks.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMarginCapital(val)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                    parsedMargin === val
                      ? 'bg-[#1F4E79] text-white border-[#1F4E79] font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                  }`}
                >
                  {formatIndianCurrency(val)}
                </button>
              ))}
            </div>

            {/* Live Computed Calculation Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  {t('form.computed_project_cost')} (Margin ÷ 10%)
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[#1F4E79]">
                  {formatIndianCurrency(computedProjectCost)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  {t('form.computed_loan_amount')}
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-[#2E8B3E]">
                  {formatIndianCurrency(computedLoanAmount)}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              {t('form.margin_hint')}
            </p>
          </div>

          {/* Field 3: Business Category (8 Icon Tiles) */}
          <div className="space-y-3">
            <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#1F4E79]" />
              <span>3. {t('form.category_label')}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const IconComponent = categoryIcons[cat] || Layers;
                const isSelected = selectedCategory === cat;
                const categoryLabel = t(`categories.${cat}`, cat);

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    disabled={isLoading}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-28 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-amber-50/50 border-[#F28C28] ring-2 ring-[#F28C28]/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#F28C28] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F28C28]" />
                      )}
                    </div>

                    <div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug">
                        {categoryLabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500">
              {t('form.category_hint')}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl text-white font-bold text-base bg-[#F28C28] hover:bg-[#D97706] shadow-sm flex items-center justify-center gap-2.5 transition-all transform active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('form.analyzing')}</span>
                </>
              ) : (
                <>
                  <span>{t('form.submit_btn')}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
