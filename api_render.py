#!/usr/bin/env python3
"""
FastAPI Backend for AAKAR — Render-Ready Version
AI-powered Advisory & Knowledge for Aspirational Rural-enterprises
Smart India Hackathon 2026 (PS SIH26091)

Changes from original api.py:
  - Added /health endpoint (required by Render health checks)
  - Added lifespan startup handler for safe NLTK/spaCy init
  - Uses PORT env variable (Render sets this automatically)
  - Added graceful error handling for missing data files
"""

import os
import sys
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ── Lifespan: runs once on startup ──────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Download NLTK data on startup if not already present (needed on Render)."""
    try:
        import nltk
        for corpus in ["punkt", "punkt_tab", "stopwords", "wordnet", "averaged_perceptron_tagger"]:
            nltk.download(corpus, quiet=True)
        print("[AAKAR] NLTK corpora ready.")
    except Exception as e:
        print(f"[AAKAR] Warning: NLTK download skipped — {e}")

    # Import heavy modules after NLTK is ready
    try:
        from main import BusinessAdvisoryAssistant, UserInput
        from business_feasibility import BusinessCategoryConst
        app.state.assistant = BusinessAdvisoryAssistant()
        app.state.categories = [c.value for c in BusinessCategoryConst]
        app.state.districts = _load_districts()
        print("[AAKAR] Backend modules loaded successfully.")
    except Exception as e:
        print(f"[AAKAR] Error loading backend modules: {e}", file=sys.stderr)
        app.state.assistant = None
        app.state.categories = []
        app.state.districts = _fallback_districts()

    yield  # ← server is running here

    print("[AAKAR] Shutting down.")


# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AAKAR Advisory API",
    description=(
        "AI-powered Advisory & Knowledge for Aspirational Rural-enterprises\n"
        "Smart India Hackathon 2026 — PS SIH26091"
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS (allow all origins for hackathon / demo purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ──────────────────────────────────────────────────────────────────
def _load_districts() -> List[str]:
    """Load district list from Excel; falls back to hard-coded Jharkhand list."""
    for fname in ["jharkhand_business_data.xlsx", "business_data.xlsx"]:
        if os.path.exists(fname):
            try:
                df = pd.read_excel(fname)
                df.columns = df.columns.str.strip()
                if "district" in df.columns:
                    districts = sorted(
                        str(d).strip()
                        for d in df["district"].dropna().unique()
                        if str(d).strip()
                    )
                    if districts:
                        return districts
            except Exception as exc:
                print(f"[AAKAR] Could not read {fname}: {exc}")
    return _fallback_districts()


def _fallback_districts() -> List[str]:
    return [
        "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka",
        "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla",
        "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar",
        "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi",
        "Sahibganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum",
    ]


# ── Schemas ──────────────────────────────────────────────────────────────────
class ReportRequest(BaseModel):
    location: str = Field(
        ..., min_length=1,
        description="Geographic location (District / Block / Village in Jharkhand)"
    )
    margin: float = Field(
        ..., gt=0, le=500_000,
        description="Available margin capital in INR (₹1 to ₹5,00,000)"
    )
    category: str = Field(
        ..., min_length=1,
        description="Proposed business category (e.g. 'Agriculture', 'Food Processing')"
    )


class HealthResponse(BaseModel):
    status: str
    backend_loaded: bool
    version: str


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """
    Health check endpoint — used by Render to verify the service is alive.
    Returns 200 OK when the server is running.
    """
    return HealthResponse(
        status="ok",
        backend_loaded=app.state.assistant is not None,
        version="1.0.0",
    )


@app.get("/", tags=["System"])
async def root():
    """Root endpoint with API overview."""
    return {
        "name": "AAKAR Advisory API",
        "description": "AI-powered Advisory & Knowledge for Aspirational Rural-enterprises",
        "hackathon": "Smart India Hackathon 2026 — PS SIH26091",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/districts", tags=["Reference Data"])
async def get_districts():
    """Return the list of supported Jharkhand districts."""
    return {"districts": app.state.districts}


@app.get("/categories", tags=["Reference Data"])
async def get_categories():
    """Return the list of supported business categories."""
    return {"categories": app.state.categories}


@app.post("/report", tags=["Advisory"])
async def generate_report(req: ReportRequest):
    """
    Generate a full business feasibility + financial advisory report.

    - **location**: District/block/village name in Jharkhand
    - **margin**: Available startup capital in INR
    - **category**: Type of business (see /categories for valid values)
    """
    if app.state.assistant is None:
        raise HTTPException(
            status_code=503,
            detail="Backend advisory engine is not available. Please try again shortly.",
        )

    try:
        from main import UserInput
        user_input = UserInput(
            geographic_location=req.location,
            available_margin_capital=req.margin,
            proposed_business_category=req.category,
        )
        report = app.state.assistant.run_full_analysis(user_input)
        return {"success": True, "report": report}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(exc)}",
        )


@app.get("/report/sample", tags=["Advisory"])
async def sample_report():
    """
    Generate a sample report using default values — useful for testing the deployment.
    Location: Ranchi | Margin: ₹50,000 | Category: Food Processing
    """
    return await generate_report(
        ReportRequest(location="Ranchi", margin=50000, category="Food Processing")
    )
