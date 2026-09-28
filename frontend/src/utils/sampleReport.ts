import { ComprehensiveReport } from '../types';

export const SAMPLE_RAMGARH_REPORT: ComprehensiveReport = {
  "user_input": {
    "geographic_location": "Ramgarh",
    "available_margin_capital": 100000.0,
    "proposed_business_category": "Handicrafts"
  },
  "feasibility_report": {
    "market_reach": {
      "target_population_5_10km": 29515,
      "estimated_monthly_market_size_inr": 150525319,
      "market_penetration_potential": 0.1,
      "reach_score": 66.6
    },
    "opportunity_analysis": [
      "Custom artwork for local festivals and weddings",
      "Training center for traditional craft techniques",
      "Online marketplace connecting artisans with urban buyers",
      "Craft kits for tourists and cultural enthusiasts",
      "Scalable operations with potential for regional expansion"
    ],
    "swot_analysis": {
      "Strengths": [
        "Initial investment of Rs1,000,000 allows for proper setup",
        "Government support available through various schemes"
      ],
      "Weaknesses": [
        "Limited financial buffer for unexpected expenses",
        "Dependence on local economic conditions"
      ],
      "Opportunities": [
        "Attractive profit margins allow for reinvestment and growth",
        "Relatively simple supply chain reduces operational complexity",
        "Government subsidies and support for micro-enterprises",
        "Potential to diversify into related products/services"
      ],
      "Threats": [
        "High seasonality requires careful inventory and cash flow management",
        "Competition from established players in the region",
        "Economic downturns could reduce disposable income",
        "Changes in government policies or subsidy programs"
      ]
    },
    "threats_identification": [
      "Seasonal demand fluctuations affecting revenue stability",
      "Dependency on single buyers or major customers",
      "Changing consumer preferences and buying habits",
      "Supply chain bottlenecks during peak seasons or adverse weather",
      "Transportation and logistics challenges in remote areas"
    ],
    "competitor_mapping": {
      "Direct competitors": 8,
      "Indirect competitors": 6,
      "Potential substitutes": 3,
      "New entrants (last year)": 2
    },
    "product_market_value": {
      "Small handicraft item": 173.85,
      "Medium artwork": 575.19,
      "Large decorative piece": 1249.39
    },
    "risk_simulation": {
      "best_case": {
        "monthly_income": 209625.0,
        "monthly_expenses": 117797.8,
        "net_profit": 91827.2,
        "survival_months": 18
      },
      "expected_case": {
        "monthly_income": 167700.0,
        "monthly_expenses": 109072.0,
        "net_profit": 58628.0,
        "survival_months": 15
      },
      "worst_case": {
        "monthly_income": 75465.0,
        "monthly_expenses": 106670.0,
        "net_profit": -31205.0,
        "survival_months": 3
      }
    }
  },
  "financial_plan": {
    "project_cost": 1000000.0,
    "loan_amount": 900000.0,
    "margin_money": 100000.0,
    "loan_scheme": {
      "name": "Term Loan Scheme",
      "interest_rate": 8.0,
      "tenure_years": 7,
      "moratorium_months": 6
    },
    "emi_schedule": [
      { "quarter": 1, "opening_balance": 936605.36, "emi_payment": 46624.16, "interest": 18857.27, "principal": 27766.9, "closing_balance": 908838.46 },
      { "quarter": 2, "opening_balance": 908838.46, "emi_payment": 46624.16, "interest": 18298.22, "principal": 28325.95, "closing_balance": 880512.51 },
      { "quarter": 3, "opening_balance": 880512.51, "emi_payment": 46624.16, "interest": 17727.91, "principal": 28896.25, "closing_balance": 851616.26 },
      { "quarter": 4, "opening_balance": 851616.26, "emi_payment": 46624.16, "interest": 17146.13, "principal": 29478.04, "closing_balance": 822138.22 },
      { "quarter": 5, "opening_balance": 822138.22, "emi_payment": 46624.16, "interest": 16552.66, "principal": 30071.50, "closing_balance": 792066.72 },
      { "quarter": 6, "opening_balance": 792066.72, "emi_payment": 46624.16, "interest": 15947.28, "principal": 30676.88, "closing_balance": 761389.84 },
      { "quarter": 7, "opening_balance": 761389.84, "emi_payment": 46624.16, "interest": 15329.77, "principal": 31294.39, "closing_balance": 730095.45 },
      { "quarter": 8, "opening_balance": 730095.45, "emi_payment": 46624.16, "interest": 14699.89, "principal": 31924.27, "closing_balance": 698171.18 },
      { "quarter": 9, "opening_balance": 698171.18, "emi_payment": 46624.16, "interest": 14057.39, "principal": 32566.77, "closing_balance": 665604.41 },
      { "quarter": 10, "opening_balance": 665604.41, "emi_payment": 46624.16, "interest": 13402.04, "principal": 33222.12, "closing_balance": 632382.29 },
      { "quarter": 11, "opening_balance": 632382.29, "emi_payment": 46624.16, "interest": 12733.56, "principal": 33890.60, "closing_balance": 598491.69 },
      { "quarter": 12, "opening_balance": 598491.69, "emi_payment": 46624.16, "interest": 12051.68, "principal": 34572.48, "closing_balance": 563919.21 },
      { "quarter": 13, "opening_balance": 563919.21, "emi_payment": 46624.16, "interest": 11356.12, "principal": 35268.04, "closing_balance": 528651.17 },
      { "quarter": 14, "opening_balance": 528651.17, "emi_payment": 46624.16, "interest": 10646.60, "principal": 35977.56, "closing_balance": 492673.61 },
      { "quarter": 15, "opening_balance": 492673.61, "emi_payment": 46624.16, "interest": 9922.84, "principal": 36701.32, "closing_balance": 455972.29 },
      { "quarter": 16, "opening_balance": 455972.29, "emi_payment": 46624.16, "interest": 9184.54, "principal": 37439.62, "closing_balance": 418532.67 },
      { "quarter": 17, "opening_balance": 418532.67, "emi_payment": 46624.16, "interest": 8431.42, "principal": 38192.74, "closing_balance": 380339.93 },
      { "quarter": 18, "opening_balance": 380339.93, "emi_payment": 46624.16, "interest": 7663.18, "principal": 38960.98, "closing_balance": 341378.95 },
      { "quarter": 19, "opening_balance": 341378.95, "emi_payment": 46624.16, "interest": 6879.52, "principal": 39744.64, "closing_balance": 301634.31 },
      { "quarter": 20, "opening_balance": 301634.31, "emi_payment": 46624.16, "interest": 6080.14, "principal": 40544.02, "closing_balance": 261090.29 },
      { "quarter": 21, "opening_balance": 261090.29, "emi_payment": 46624.16, "interest": 5264.73, "principal": 41359.43, "closing_balance": 219730.86 },
      { "quarter": 22, "opening_balance": 219730.86, "emi_payment": 46624.16, "interest": 4433.00, "principal": 42191.16, "closing_balance": 177539.70 },
      { "quarter": 23, "opening_balance": 177539.70, "emi_payment": 46624.16, "interest": 3584.62, "principal": 43039.54, "closing_balance": 134500.16 },
      { "quarter": 24, "opening_balance": 134500.16, "emi_payment": 46624.16, "interest": 2719.29, "principal": 43904.87, "closing_balance": 90595.29 },
      { "quarter": 25, "opening_balance": 90595.29, "emi_payment": 46624.16, "interest": 1836.68, "principal": 44787.48, "closing_balance": 45807.81 },
      { "quarter": 26, "opening_balance": 45807.81, "emi_payment": 46624.16, "interest": 936.48, "principal": 45687.68, "closing_balance": 0.0 }
    ],
    "moratorium_period": 6,
    "total_interest": 275622.93,
    "total_repayment": 1175622.93
  }
};
