export interface UserInputData {
  geographic_location: string;
  available_margin_capital: number;
  proposed_business_category: string;
}

export interface MarketReach {
  target_population_5_10km: number;
  estimated_monthly_market_size_inr: number;
  market_penetration_potential: number;
  reach_score: number;
}

export interface SwotAnalysis {
  Strengths: string[];
  Weaknesses: string[];
  Opportunities: string[];
  Threats: string[];
}

export interface CompetitorMapping {
  [key: string]: number;
}

export interface ProductMarketValue {
  [product: string]: number;
}

export interface RiskScenario {
  monthly_income: number;
  monthly_expenses: number;
  net_profit: number;
  survival_months: number;
}

export interface RiskSimulation {
  best_case?: RiskScenario;
  expected_case?: RiskScenario;
  worst_case?: RiskScenario;
}

export interface FeasibilityReport {
  market_reach: MarketReach;
  opportunity_analysis: string[];
  swot_analysis: SwotAnalysis;
  threats_identification: string[];
  competitor_mapping: CompetitorMapping;
  product_market_value: ProductMarketValue;
  risk_simulation?: RiskSimulation;
}

export interface LoanSchemeInfo {
  name: string;
  interest_rate: number;
  tenure_years: number;
  moratorium_months: number;
}

export interface EMIQuarter {
  quarter: number;
  opening_balance: number;
  emi_payment: number;
  interest: number;
  principal: number;
  closing_balance: number;
}

export interface FinancialPlan {
  project_cost: number;
  loan_amount: number;
  margin_money: number;
  loan_scheme: LoanSchemeInfo;
  emi_schedule: EMIQuarter[];
  moratorium_period: number;
  total_interest: number;
  total_repayment: number;
}

export interface ComprehensiveReport {
  user_input: UserInputData;
  feasibility_report: FeasibilityReport;
  financial_plan: FinancialPlan;
}
