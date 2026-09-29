#!/usr/bin/env python3
"""
FastAPI Backend Wrapper for AAKAR
AI-powered Advisory & Knowledge for Aspirational Rural-enterprises
Smart India Hackathon 2026 (PS SIH26091)
"""

import os
from typing import List, Dict, Any, Optional
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Import existing backend modules without modifying them
from main import BusinessAdvisoryAssistant, UserInput
from business_feasibility import BusinessCategoryConst

app = FastAPI(
    title="AAKAR Advisory API",
    description="AI-powered Advisory & Knowledge for Aspirational Rural-enterprises (SIH 2026 - PS SIH26091)",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development and demonstration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReportRequest(BaseModel):
    location: str = Field(..., min_length=1, description="Geographic location (District, Block, or Village)")
    margin: float = Field(..., gt=0, le=500000, description="Available margin capital in INR (₹1 to ₹5,00,000)")
    category: str = Field(..., min_length=1, description="Proposed business category")

def load_districts_from_excel() -> List[str]:
    """Load unique sorted district list from Excel data with fallback."""
    possible_files = ['jharkhand_business_data.xlsx', 'business_data.xlsx']
    for file_path in possible_files:
        if os.path.exists(file_path):
            try:
                df = pd.read_excel(file_path)
                df.columns = df.columns.str.strip()
                if 'district' in df.columns:
                    districts = sorted([str(d).strip() for d in df['district'].dropna().unique() if str(d).strip()])
                    if districts:
                        return districts
            except Exception as e:
                print(f"Error loading {file_path}: {e}")
    # Default 24 districts of Jharkhand fallback
    return [
        "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka",
        "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla",
        "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar",
        "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi",
        "Sahibganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum"
    ]

# Preload districts and categories
DISTRICTS = load_districts_from_excel()

CATEGORIES = [
    BusinessCategoryConst.DAIRY,
    BusinessCategoryConst.RETAIL,
    BusinessCategoryConst.TEXTILES,
    BusinessCategoryConst.AGRICULTURE,
    BusinessCategoryConst.FOOD_PROCESSING,
    BusinessCategoryConst.HANDICRAFTS,
    BusinessCategoryConst.SERVICES,
    BusinessCategoryConst.OTHER
]

# Persistent assistant instance
assistant = BusinessAdvisoryAssistant()

@app.get("/")
def root():
    """Root endpoint."""
    return {
        "service": "AAKAR API",
        "docs": "/docs",
        "health": "/health",
        "status": "healthy"
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "AAKAR API",
        "version": "1.0.0",
        "project": "Smart India Hackathon 2026 - PS SIH26091",
        "team": "CryptuS"
    }

@app.get("/api/districts")
def get_districts() -> List[str]:
    """Get list of Jharkhand districts from Excel dataset."""
    return DISTRICTS

@app.get("/api/categories")
def get_categories() -> List[str]:
    """Get list of supported business categories."""
    return CATEGORIES

@app.post("/api/report")
def generate_report(payload: ReportRequest) -> Dict[str, Any]:
    """
    Generate comprehensive business advisory and financial report.
    Returns the same structure as generate_comprehensive_report(),
    with the FULL EMI schedule (not the [:4] preview slice).
    """
    location = payload.location.strip()
    if not location:
        raise HTTPException(status_code=400, detail="Location cannot be empty.")

    margin = float(payload.margin)
    if margin <= 0:
        raise HTTPException(status_code=400, detail="Margin capital must be greater than 0.")
    if margin > 500000:
        raise HTTPException(
            status_code=400,
            detail="Margin capital cannot exceed ₹5,00,000 (which corresponds to ₹50,00,000 maximum project cost)."
        )

    # Standardize category matching (case-insensitive)
    selected_category = None
    for cat in CATEGORIES:
        if cat.lower() == payload.category.strip().lower():
            selected_category = cat
            break
    
    if not selected_category:
        # Fallback to provided category or OTHER
        selected_category = payload.category.strip()

    user_input = UserInput(
        geographic_location=location,
        available_margin_capital=margin,
        proposed_business_category=selected_category
    )

    try:
        feasibility_report = assistant.run_feasibility_analysis(user_input)
        financial_plan = assistant.run_financial_calculation(user_input)
        
        # Build comprehensive report matching exact schema but with full emi_schedule
        report = {
            "user_input": {
                "geographic_location": user_input.geographic_location,
                "available_margin_capital": user_input.available_margin_capital,
                "proposed_business_category": user_input.proposed_business_category
            },
            "feasibility_report": {
                "market_reach": feasibility_report.get("market_reach", {}),
                "opportunity_analysis": feasibility_report.get("opportunity_analysis", []),
                "swot_analysis": feasibility_report.get("swot_analysis", {}),
                "threats_identification": feasibility_report.get("threats_identification", []),
                "competitor_mapping": feasibility_report.get("competitor_mapping", {}),
                "product_market_value": feasibility_report.get("product_market_value", {}),
                "risk_simulation": feasibility_report.get("risk_simulation", {})
            },
            "financial_plan": {
                "project_cost": financial_plan.project_cost,
                "loan_amount": financial_plan.loan_amount,
                "margin_money": financial_plan.margin_money,
                "loan_scheme": {
                    "name": financial_plan.loan_scheme.name,
                    "interest_rate": financial_plan.loan_scheme.interest_rate,
                    "tenure_years": financial_plan.loan_scheme.tenure_years,
                    "moratorium_months": financial_plan.loan_scheme.moratorium_months
                },
                "emi_schedule": financial_plan.emi_schedule,  # FULL schedule
                "moratorium_period": financial_plan.moratorium_period,
                "total_interest": financial_plan.total_interest,
                "total_repayment": financial_plan.total_repayment
            }
        }
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
