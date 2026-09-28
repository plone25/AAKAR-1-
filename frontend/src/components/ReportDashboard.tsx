'use client';

import React, { useState } from 'react';
import { ComprehensiveReport, RiskScenario } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  formatIndianCurrency, 
  formatIndianNumber, 
  formatPercent,
  formatCompactCurrency
} from '../utils/formatters';
import { 
  Building2, 
  Wallet, 
  Printer, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  PieChart, 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  ChevronRight,
  Info,
  ArrowUpRight,
  Check,
  Calendar,
  Percent,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';

interface ReportDashboardProps {
  report: ComprehensiveReport;
  onStartOver: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report,
  onStartOver,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'local' | 'financial'>('local');
  const [emiPage, setEmiPage] = useState<number>(1);
  const emiPageSize = 8;

  const { user_input, feasibility_report, financial_plan } = report;
  const { market_reach, opportunity_analysis, swot_analysis, threats_identification, competitor_mapping, product_market_value, risk_simulation } = feasibility_report;

  // Prepare Competitor Mapping chart data with trimmed keys
  const competitorChartData = Object.entries(competitor_mapping || {}).map(([key, val]) => ({
    name: key.trim(),
    competitors: Number(val) || 0,
  }));

  // Prepare Amortization line chart data
  const amortizationData = (financial_plan.emi_schedule || []).map((item) => ({
    quarter: `Q${item.quarter}`,
    opening: Math.round(item.opening_balance),
    closing: Math.round(item.closing_balance),
    emi: Math.round(item.emi_payment),
  }));

  // Prepare Interest vs Principal stacked bar data
  const breakdownData = (financial_plan.emi_schedule || []).map((item) => ({
    quarter: `Q${item.quarter}`,
    principal: Math.round(item.principal),
    interest: Math.round(item.interest),
    total: Math.round(item.emi_payment),
  }));

  // Prepare Moratorium Impact calculation
  const monthlyRate = (financial_plan.loan_scheme.interest_rate / 100) / 12;
  const tenureYears = financial_plan.loan_scheme.tenure_years;
  const morMonths = financial_plan.loan_scheme.moratorium_months;
  const loanAmount = financial_plan.loan_amount;

  // Standard loan without moratorium for comparison
  const totalMonthsNoMor = tenureYears * 12;
  const totalQuartersNoMor = totalMonthsNoMor / 3;
  const qRate = Math.pow(1 + monthlyRate, 3) - 1;
  const emiWithoutMor = qRate > 0 
    ? (loanAmount * (qRate * Math.pow(1 + qRate, totalQuartersNoMor))) / (Math.pow(1 + qRate, totalQuartersNoMor) - 1)
    : loanAmount / totalQuartersNoMor;
  const totalRepaymentWithoutMor = emiWithoutMor * totalQuartersNoMor;
  const totalInterestWithoutMor = totalRepaymentWithoutMor - loanAmount;

  const moratoriumComparisonData = [
    {
      scenario: t('financial.with_moratorium'),
      principal: Math.round(loanAmount),
      interest: Math.round(financial_plan.total_interest),
      total: Math.round(financial_plan.total_repayment),
    },
    {
      scenario: t('financial.without_moratorium'),
      principal: Math.round(loanAmount),
      interest: Math.round(totalInterestWithoutMor),
      total: Math.round(totalRepaymentWithoutMor),
    },
  ];

  // Scheme eligibility data
  const projectCost = financial_plan.project_cost;
  const schemeData = [
    {
      scheme: 'Micro Finance',
      min: 0,
      max: 140000,
      eligible: projectCost <= 140000,
      status: projectCost <= 140000 ? 'Eligible' : 'Exceeds limit',
    },
    {
      scheme: 'Term Loan',
      min: 140000,
      max: 5000000,
      eligible: projectCost > 140000 && projectCost <= 5000000,
      status: projectCost > 140000 && projectCost <= 5000000 ? 'Selected' : 'Not applicable',
    },
  ];

  // Pagination for EMI table
  const totalEmiCount = financial_plan.emi_schedule?.length || 0;
  const totalPages = Math.ceil(totalEmiCount / emiPageSize);
  const currentEmiSlice = financial_plan.emi_schedule?.slice((emiPage - 1) * emiPageSize, emiPage * emiPageSize) || [];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(report, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `AAKAR_Report_${user_input.geographic_location.replace(/\s+/g, '_')}_${user_input.proposed_business_category}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const reachScore = market_reach?.reach_score || 0;
  const getReachColor = (score: number) => {
    if (score >= 70) return '#2E8B3E';
    if (score >= 45) return '#1F4E79';
    return '#F28C28';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Action Controls */}
      <div className="sih-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1F4E79] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2E8B3E]" />
            <span>Smart India Hackathon 2026 • Verified Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            {t('dashboard.subtitle')}{' '}
            <span className="font-bold text-[#1F4E79]">{user_input.geographic_location}</span> (
            <span className="font-semibold text-slate-800">{user_input.proposed_business_category}</span>)
            {' • '}
            <span>Margin Capital: {formatIndianCurrency(user_input.available_margin_capital)}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            title={t('actions.print_hint')}
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{t('actions.download_pdf')}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{t('actions.download_json')}</span>
          </button>

          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F28C28] hover:bg-[#D97706] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-white" />
            <span>{t('actions.start_over')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 no-print">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab('local')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-bold text-sm sm:text-base transition-all cursor-pointer ${
              activeTab === 'local'
                ? 'border-[#1F4E79] text-[#1F4E79]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>{t('dashboard.tab_local')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-bold text-sm sm:text-base transition-all cursor-pointer ${
              activeTab === 'financial'
                ? 'border-[#1F4E79] text-[#1F4E79]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span>{t('dashboard.tab_financial')}</span>
          </button>
        </nav>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: LOCAL BUSINESS INTELLIGENCE */}
      {/* ========================================================= */}
      {(activeTab === 'local' || false) && (
        <div className="space-y-8 tab-content-print">
          {/* Top Row: Reach Score Gauge & 3 Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Reach Score Gauge Card */}
            <div className="sih-card p-6 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t('dashboard.reach_score')}
              </span>

              {/* Gauge display */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-100"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={getReachColor(reachScore)}
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * reachScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">
                    {reachScore.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {reachScore >= 70 ? 'High Potential' : reachScore >= 45 ? 'Viable Opportunity' : 'Developing Zone'}
              </div>
            </div>

            {/* KPI 1: Target Population */}
            <div className="sih-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <Users className="w-5 h-5 text-[#1F4E79]" />
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">5-10 km</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t('dashboard.kpi_population')}
                </span>
                <span className="text-2xl font-black text-slate-900 block mt-1">
                  {formatIndianNumber(market_reach?.target_population_5_10km)}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Local consumer base in geographic radius
              </p>
            </div>

            {/* KPI 2: Estimated Monthly Market Size */}
            <div className="sih-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <TrendingUp className="w-5 h-5 text-[#2E8B3E]" />
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-50 text-[#2E8B3E]">Monthly</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t('dashboard.kpi_market_size')}
                </span>
                <span className="text-2xl font-black text-[#1F4E79] block mt-1">
                  {formatCompactCurrency(market_reach?.estimated_monthly_market_size_inr || 0)}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500 truncate" title={formatIndianCurrency(market_reach?.estimated_monthly_market_size_inr)}>
                Total: {formatIndianCurrency(market_reach?.estimated_monthly_market_size_inr)}
              </p>
            </div>

            {/* KPI 3: Market Penetration Potential */}
            <div className="sih-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <PieChart className="w-5 h-5 text-[#F28C28]" />
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-[#F28C28]">Target</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t('dashboard.kpi_penetration')}
                </span>
                <span className="text-2xl font-black text-slate-900 block mt-1">
                  {formatPercent(market_reach?.market_penetration_potential || 0)}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Estimated addressable enterprise capture
              </p>
            </div>
          </div>

          {/* Opportunities & Threats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opportunities List */}
            <div className="sih-card p-6 border-l-4 border-l-[#2E8B3E]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#2E8B3E]">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('dashboard.opportunities_title')}
                </h3>
              </div>

              <ul className="space-y-3">
                {(opportunity_analysis || []).map((opp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-[#2E8B3E] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{opp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location Threats List */}
            <div className="sih-card p-6 border-l-4 border-l-rose-500">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('dashboard.threats_title')}
                </h3>
              </div>

              <ul className="space-y-3">
                {(threats_identification || []).map((threat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      !
                    </span>
                    <span className="leading-relaxed">{threat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2x2 SWOT Matrix */}
          <div className="sih-card p-6 sm:p-8">
            <h3 className="text-lg font-bold text-[#1F4E79] mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1F4E79]" />
              <span>{t('dashboard.swot_title')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-5 rounded-xl bg-slate-50 border-t-4 border-t-[#2E8B3E]">
                <h4 className="font-bold text-sm text-[#2E8B3E] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2E8B3E]" />
                  <span>{t('dashboard.strengths')} (S)</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {(swot_analysis?.Strengths || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#2E8B3E] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-5 rounded-xl bg-slate-50 border-t-4 border-t-amber-500">
                <h4 className="font-bold text-sm text-amber-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{t('dashboard.weaknesses')} (W)</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {(swot_analysis?.Weaknesses || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="p-5 rounded-xl bg-slate-50 border-t-4 border-t-[#1F4E79]">
                <h4 className="font-bold text-sm text-[#1F4E79] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1F4E79]" />
                  <span>{t('dashboard.opportunities')} (O)</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {(swot_analysis?.Opportunities || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#1F4E79] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="p-5 rounded-xl bg-slate-50 border-t-4 border-t-rose-500">
                <h4 className="font-bold text-sm text-rose-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{t('dashboard.threats')} (T)</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {(swot_analysis?.Threats || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Competitor Mapping & Product Market Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Competitor Mapping Bar Chart (trimmed keys) */}
            <div className="sih-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {t('dashboard.competitors_title')}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Count of competitor types detected in local cluster
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={competitorChartData} layout="vertical" margin={{ top: 10, right: 40, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }} />
                    <Tooltip 
                      formatter={(val: any) => [`${val} Businesses / Units`, 'Competitors']}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                    <Bar dataKey="competitors" fill="#1F4E79" radius={[0, 4, 4, 0]} barSize={22}>
                      {competitorChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? '#1F4E79' : index === 1 ? '#2A6496' : index === 2 ? '#F28C28' : '#2E8B3E'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Market Value Table */}
            <div className="sih-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {t('dashboard.pricing_title')}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Benchmarked pricing based on local purchasing power
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-2.5 px-3">{t('dashboard.product_name')}</th>
                      <th className="py-2.5 px-3 text-right">{t('dashboard.benchmark_price')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(product_market_value || {}).map(([product, price]) => (
                      <tr key={product} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-medium text-slate-800">{product}</td>
                        <td className="py-3 px-3 text-right font-extrabold text-[#1F4E79]">
                          {formatIndianCurrency(Number(price), true)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Risk Simulation Scenarios (Best / Expected / Worst Case) */}
          {risk_simulation && (
            <div className="sih-card p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#1F4E79]">
                  {t('dashboard.risk_sim_title')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t('dashboard.risk_sim_sub')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Best Case */}
                {risk_simulation.best_case && (
                  <div className="p-5 rounded-xl border border-green-200 bg-green-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-[#2E8B3E] uppercase tracking-wider">
                        {t('dashboard.scenario_best')}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B3E]" />
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between py-1 border-b border-green-100">
                        <span className="text-slate-600">{t('dashboard.monthly_income')}</span>
                        <span className="font-bold text-slate-900">{formatIndianCurrency(risk_simulation.best_case.monthly_income, true)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-green-100">
                        <span className="text-slate-600">{t('dashboard.monthly_expenses')}</span>
                        <span className="font-bold text-slate-900">{formatIndianCurrency(risk_simulation.best_case.monthly_expenses, true)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-green-100">
                        <span className="text-slate-600 font-semibold">{t('dashboard.net_profit')}</span>
                        <span className="font-extrabold text-[#2E8B3E]">{formatIndianCurrency(risk_simulation.best_case.net_profit, true)}</span>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="text-slate-600">{t('dashboard.survival_months')}</span>
                        <span className="font-bold text-slate-900">{risk_simulation.best_case.survival_months} {t('dashboard.months')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expected Case */}
                {risk_simulation.expected_case && (
                  <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider">
                        {t('dashboard.scenario_expected')}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1F4E79]" />
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between py-1 border-b border-blue-100">
                        <span className="text-slate-600">{t('dashboard.monthly_income')}</span>
                        <span className="font-bold text-slate-900">{formatIndianCurrency(risk_simulation.expected_case.monthly_income, true)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-blue-100">
                        <span className="text-slate-600">{t('dashboard.monthly_expenses')}</span>
                        <span className="font-bold text-slate-900">{formatIndianCurrency(risk_simulation.expected_case.monthly_expenses, true)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-blue-100">
                        <span className="text-slate-600 font-semibold">{t('dashboard.net_profit')}</span>
                        <span className={`font-extrabold ${risk_simulation.expected_case.net_profit >= 0 ? 'text-[#2E8B3E]' : 'text-rose-600'}`}>
                          {formatIndianCurrency(risk_simulation.expected_case.net_profit, true)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="text-slate-600">{t('dashboard.survival_months')}</span>
                        <span className="font-bold text-slate-900">{risk_simulation.expected_case.survival_months} {t('dashboard.months')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Worst Case */}
                {risk_simulation.worst_case && (
                  <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                        {t('dashboard.scenario_worst')}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between py-1 border-b border-rose-100">
                        <span className="text-slate-600">{t('dashboard.monthly_income')}</span>
                        <span className="font-bold text-slate-900">{formatIndianCurrency(risk_simulation.worst_case.monthly_income, true)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-rose-100">
                        <span className="text-slate-600">{t('dashboard.monthly_expenses')}</span>
                        <span className="font-bold text-slate-900">{formatIndianCurrency(risk_simulation.worst_case.monthly_expenses, true)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-rose-100">
                        <span className="text-slate-600 font-semibold">{t('dashboard.net_profit')}</span>
                        <span className={`font-extrabold ${risk_simulation.worst_case.net_profit >= 0 ? 'text-[#2E8B3E]' : 'text-rose-600'}`}>
                          {formatIndianCurrency(risk_simulation.worst_case.net_profit, true)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="text-slate-600">{t('dashboard.survival_months')}</span>
                        <span className="font-bold text-slate-900">{risk_simulation.worst_case.survival_months} {t('dashboard.months')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FINANCIAL INTELLIGENCE */}
      {/* ========================================================= */}
      {(activeTab === 'financial' || false) && (
        <div className="space-y-8 tab-content-print">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sih-card p-6 border-l-4 border-l-[#1F4E79]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t('financial.project_cost')}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#1F4E79] block mt-2">
                {formatIndianCurrency(financial_plan.project_cost)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                Margin ÷ 0.10 total enterprise outlay
              </span>
            </div>

            <div className="sih-card p-6 border-l-4 border-l-[#2E8B3E]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t('financial.loan_amount')}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#2E8B3E] block mt-2">
                {formatIndianCurrency(financial_plan.loan_amount)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                90% institutional funding coverage
              </span>
            </div>

            <div className="sih-card p-6 border-l-4 border-l-[#F28C28]">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t('financial.margin_money')}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-2">
                {formatIndianCurrency(financial_plan.margin_money)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                10% promoter contribution
              </span>
            </div>
          </div>

          {/* Selected Scheme Card */}
          <div className="sih-card p-6 sm:p-8 bg-slate-50 border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block">
                  {t('financial.scheme_title')}
                </span>
                <h3 className="text-2xl font-black text-[#1F4E79] mt-1">
                  {financial_plan.loan_scheme.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-[#2E8B3E]">
                  <Check className="w-3.5 h-3.5" />
                  Auto-Selected Scheme
                </span>
              </div>
            </div>

            {/* Scheme Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  {t('financial.interest_rate')}
                </span>
                <span className="text-lg font-extrabold text-slate-900 mt-1 block">
                  {financial_plan.loan_scheme.interest_rate}% p.a.
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  {t('financial.tenure')}
                </span>
                <span className="text-lg font-extrabold text-slate-900 mt-1 block">
                  {financial_plan.loan_scheme.tenure_years} {t('common.years')}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  {t('financial.moratorium')}
                </span>
                <span className="text-lg font-extrabold text-[#F28C28] mt-1 block">
                  {financial_plan.loan_scheme.moratorium_months} {t('common.months')}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  {t('financial.total_interest')}
                </span>
                <span className="text-lg font-extrabold text-[#1F4E79] mt-1 block">
                  {formatIndianCurrency(financial_plan.total_interest)}
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row 1: Amortization & EMI Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Amortization Line Chart */}
            <div className="sih-card p-6">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                {t('financial.amortization_title')}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Quarterly trajectory of loan reduction
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={amortizationData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => formatCompactCurrency(v)} 
                    />
                    <Tooltip 
                      formatter={(val: any) => [formatIndianCurrency(Number(val)), '']}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="opening" name="Opening Balance" stroke="#1F4E79" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="closing" name="Closing Balance" stroke="#2E8B3E" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Stacked Bar Chart for Interest vs Principal */}
            <div className="sih-card p-6">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                {t('financial.breakdown_title')}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Quarterly repayment composition
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdownData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => formatCompactCurrency(v)} 
                    />
                    <Tooltip 
                      formatter={(val: any) => [formatIndianCurrency(Number(val)), '']}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="interest" name="Interest" stackId="a" fill="#F28C28" />
                    <Bar dataKey="principal" name="Principal" stackId="a" fill="#1F4E79" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2: Scheme Eligibility & Moratorium Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: Scheme Eligibility Comparison */}
            <div className="sih-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {t('financial.scheme_comparison_title')}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Current project cost: <span className="font-bold text-[#1F4E79]">{formatIndianCurrency(projectCost)}</span>
                </p>
              </div>

              <div className="space-y-4 my-auto py-2">
                {schemeData.map((s) => (
                  <div key={s.scheme} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900">{s.scheme}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        s.eligible ? 'bg-green-100 text-[#2E8B3E]' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${s.eligible ? 'bg-[#2E8B3E]' : 'bg-slate-400'}`}
                        style={{ width: `${Math.min(100, Math.max(5, (projectCost / s.max) * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                      <span>Min: {formatCompactCurrency(s.min)}</span>
                      <span>Max: {formatCompactCurrency(s.max)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Moratorium Impact Comparison */}
            <div className="sih-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                  {t('financial.moratorium_impact_title')}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {financial_plan.moratorium_period} months interest grace before principal amortization begins
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moratoriumComparisonData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="scenario" tick={{ fontSize: 11 }} />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => formatCompactCurrency(v)} 
                    />
                    <Tooltip 
                      formatter={(val: any) => [formatIndianCurrency(Number(val)), '']}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="principal" name="Loan Principal" fill="#1F4E79" />
                    <Bar dataKey="interest" name="Total Interest" fill="#F28C28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Full EMI Schedule Table */}
          <div className="sih-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('financial.schedule_title')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('financial.showing_quarters')} ({totalEmiCount} Quarters)
                </p>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-2 text-xs font-semibold no-print">
                <button
                  type="button"
                  disabled={emiPage === 1}
                  onClick={() => setEmiPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Prev
                </button>
                <span className="text-slate-600">
                  Page {emiPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={emiPage === totalPages}
                  onClick={() => setEmiPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1.5 rounded border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-3.5">{t('financial.quarter')}</th>
                    <th className="py-3 px-3.5 text-right">{t('financial.opening_balance')}</th>
                    <th className="py-3 px-3.5 text-right text-[#1F4E79] font-black">{t('financial.emi_payment')}</th>
                    <th className="py-3 px-3.5 text-right text-[#F28C28]">{t('financial.interest')}</th>
                    <th className="py-3 px-3.5 text-right">{t('financial.principal')}</th>
                    <th className="py-3 px-3.5 text-right">{t('financial.closing_balance')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentEmiSlice.map((row) => (
                    <tr key={row.quarter} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-slate-800">
                        Q{row.quarter}
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-600">
                        {formatIndianCurrency(row.opening_balance, true)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-extrabold text-[#1F4E79]">
                        {formatIndianCurrency(row.emi_payment, true)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-semibold text-[#F28C28]">
                        {formatIndianCurrency(row.interest, true)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-semibold text-[#2E8B3E]">
                        {formatIndianCurrency(row.principal, true)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-slate-900">
                        {formatIndianCurrency(row.closing_balance, true)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
