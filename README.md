# AAKAR: AI-powered Advisory & Knowledge for Aspirational Rural-enterprises
### Smart India Hackathon 2026 • Problem Statement ID: SIH26091
**Theme:** Agriculture, Food Tech & Rural Development | **Category:** Software | **Team:** CryptuS

AAKAR is an AI-driven hyper-local business advisory and smart financial structuring platform tailored for rural micro-entrepreneurs across Jharkhand. It bridges critical data and financial literacy gaps by combining hyper-local socio-economic market research with automated government loan routing and repayment scheduling.

---

## Architecture Overview

```
SIH/
├── api.py                    # Thin FastAPI backend wrapper (CORS enabled)
├── main.py                   # Business advisory coordinator & CLI entry
├── business_feasibility.py   # Hyper-local feasibility module (Jharkhand 24-district data + NLP)
├── financial_calculator.py   # Financial engine, loan routing & EMI schedules
├── business_data.xlsx        # Jharkhand district socio-economic baseline dataset
├── frontend/                 # Modern Next.js (App Router) + Tailwind CSS + Recharts UI
│   ├── src/app/              # Next.js App Router (page.tsx, layout.tsx, globals.css)
│   ├── src/components/       # Header, LandingHero, InputForm, ReportDashboard, Footer
│   ├── src/locales/          # i18n dictionaries (en.json, hi.json)
│   ├── src/context/          # LanguageContext (EN / हिन्दी switch)
│   ├── src/utils/            # Indian currency formatters & certified sample fallback
│   └── src/types/            # Strong TypeScript interfaces
```

---

## Key Features

1. **Hyper-Local Business Feasibility Intelligence**:
   - **Market Reach Analysis**: Estimates target population within 5–10 km, monthly market size in ₹, addressable penetration %, and composite Reach Score (0–100).
   - **Opportunity & Risk Insights**: Tailored unserved niches and local risk factors (seasonality, raw materials, logistics).
   - **2x2 SWOT Matrix**: Location-specific Strengths, Weaknesses, Opportunities, and Threats for Jharkhand.
   - **Competitor Landscape**: Direct competitors, indirect players, and new entrants.
   - **Benchmark Pricing Table**: Suggested local selling prices based on purchasing power.
   - **Risk Simulation**: Best-case, expected-case, and worst-case cash flow stress test with cash survival buffers.

2. **Smart Financial Intelligence & Scheme Routing**:
   - **Project Cost & Loan Structuring**: Automatic 10% margin equity and 90% loan calculation.
   - **Automated Scheme Selection**:
     - *Micro Finance Scheme*: Projects up to ₹1,40,000 (6.5% interest, 3-year tenure, 3-month moratorium).
     - *Term Loan Scheme*: Projects > ₹1,40,000 up to ₹50,00,000 (8% interest, 7-year tenure, 6-month moratorium).
   - **Repayment Schedules**: Full quarterly EMI amortization schedules factoring in compounding during moratorium.
   - **Visual Analytics**: Loan Amortization trajectory, Interest vs Principal breakdown, Scheme limits comparison, and Moratorium impact analysis.

3. **SIH Design & User Experience**:
   - Palette: Navy `#1F4E79`, Saffron `#F28C28`, Positive Green `#2E8B3E`, and subtle Indian tricolor header accent.
   - **Multilingual Support**: Real-time English & हिन्दी toggle.
   - **Indian Numeral Formatting**: Standard Lakhs/Crores display (`₹7,50,000`).
   - **Export Capabilities**: Clean print stylesheet for instant PDF export and raw JSON export.

---

## How to Run

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup (FastAPI)

1. Open a terminal in the root project directory:
   ```bash
   cd SIH
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   pip install uvicorn pandas openpyxl nltk fastapi pydantic
   ```

3. Download required NLTK tokenizers (one-time setup):
   ```bash
   python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab'); nltk.download('averaged_perceptron_tagger'); nltk.download('averaged_perceptron_tagger_eng')"
   ```

4. Launch the FastAPI server:
   ```bash
   uvicorn api:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend will be live at `http://127.0.0.1:8000` (Interactive docs available at `http://127.0.0.1:8000/docs`).

### 3. Frontend Setup (Next.js)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## API Endpoints

- **`GET /api/health`**: Health check and metadata verification.
- **`GET /api/districts`**: Returns the list of 24 Jharkhand districts extracted from `jharkhand_business_data.xlsx`.
- **`GET /api/categories`**: Returns the 8 supported enterprise categories from `BusinessCategoryConst`.
- **`POST /api/report`**:
  - Request body:
    ```json
    {
      "location": "Ramgarh",
      "margin": 100000,
      "category": "Handicrafts"
    }
    ```
  - Returns the full feasibility report and complete 26-quarter EMI schedule matching `generate_comprehensive_report()`.

---

## Hackathon Team Information
- **Team:** CryptuS
- **Project:** AAKAR (AI-powered Advisory & Knowledge for Aspirational Rural-enterprises)
- **Problem Statement:** SIH26091
- **Target Beneficiaries:** Rural micro-entrepreneurs, self-help groups (SHGs), and grassroots enterprises.