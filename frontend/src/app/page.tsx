'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { LandingHero } from '../components/LandingHero';
import { InputForm } from '../components/InputForm';
import { ReportDashboard } from '../components/ReportDashboard';
import { Footer } from '../components/Footer';
import { ComprehensiveReport } from '../types';
import { SAMPLE_RAMGARH_REPORT } from '../utils/sampleReport';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, CheckCircle2, Sparkles, Terminal } from 'lucide-react';

const DEFAULT_DISTRICTS = [
  'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka',
  'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla',
  'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar',
  'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi',
  'Sahibganj', 'Seraikela-Kharsawan', 'Simdega', 'West Singhbhum'
];

const DEFAULT_CATEGORIES = [
  'Dairy',
  'Retail',
  'Textiles',
  'Agriculture',
  'Food Processing',
  'Handicrafts',
  'Services',
  'OTHER'
];

export default function Home() {
  const { t } = useLanguage();

  const [districts, setDistricts] = useState<string[]>(DEFAULT_DISTRICTS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [report, setReport] = useState<ComprehensiveReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Fetch districts & categories from FastAPI backend on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [districtsRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:8000/api/districts').catch(() => null),
          fetch('http://localhost:8000/api/categories').catch(() => null),
        ]);

        if (districtsRes && districtsRes.ok) {
          const distData = await districtsRes.json();
          if (Array.isArray(distData) && distData.length > 0) {
            setDistricts(distData);
          }
        }

        if (categoriesRes && categoriesRes.ok) {
          const catData = await categoriesRes.json();
          if (Array.isArray(catData) && catData.length > 0) {
            setCategories(catData);
          }
        }
      } catch (err) {
        // Fallbacks already in place
        console.warn('Backend not yet reachable on http://localhost:8000, using local metadata.');
      }
    };

    fetchMetadata();
  }, []);

  const handleStartAnalysis = () => {
    const formElement = document.getElementById('analysis-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (data: { location: string; margin: number; category: string }) => {
    setIsLoading(true);
    setApiError(null);
    setIsDemoMode(false);

    try {
      const response = await fetch('http://localhost:8000/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: data.location,
          margin: data.margin,
          category: data.category,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server returned error (${response.status})`);
      }

      const reportData: ComprehensiveReport = await response.json();
      setReport(reportData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('Backend API request failed:', err.message);
      setApiError(err.message || 'Could not connect to FastAPI backend at http://localhost:8000.');
      
      // Provide option to view demo report
      setIsDemoMode(true);
      const customizedDemo: ComprehensiveReport = {
        ...SAMPLE_RAMGARH_REPORT,
        user_input: {
          geographic_location: data.location,
          available_margin_capital: data.margin,
          proposed_business_category: data.category,
        },
        financial_plan: {
          ...SAMPLE_RAMGARH_REPORT.financial_plan,
          project_cost: data.margin / 0.10,
          loan_amount: (data.margin / 0.10) - data.margin,
          margin_money: data.margin,
        }
      };
      setReport(customizedDemo);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setReport(null);
    setApiError(null);
    setIsDemoMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <Header onStartNew={handleStartOver} />

      <main className="flex-1 pb-16">
        {/* Offline Demo Mode Notification Banner */}
        {isDemoMode && (
          <div className="max-w-6xl mx-auto px-4 mt-6 no-print">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start sm:items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#F28C28] shrink-0" />
                <div>
                  <span className="font-bold">{t('common.demo_mode')}</span>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {t('common.demo_mode_desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-amber-200 text-slate-700 text-xs font-mono shrink-0">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>uvicorn api:app --reload</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
            <div className="w-16 h-16 border-4 border-[#1F4E79] border-t-[#F28C28] rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {t('form.analyzing')}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Running Jharkhand socio-economic model, calculating 5-10km market reach, structuring loan repayment and moratorium schedules.
              </p>
            </div>

            {/* Skeleton Card Preview */}
            <div className="sih-card p-8 max-w-2xl mx-auto animate-pulse space-y-4 text-left">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="h-20 bg-slate-100 rounded-lg" />
                <div className="h-20 bg-slate-100 rounded-lg" />
                <div className="h-20 bg-slate-100 rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {/* View 1: Landing Page & Input Form */}
        {!report && !isLoading && (
          <div className="space-y-8">
            <LandingHero onStartAnalysis={handleStartAnalysis} />
            <InputForm
              districts={districts}
              categories={categories}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* View 2: Report Dashboard */}
        {report && !isLoading && (
          <ReportDashboard
            report={report}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
