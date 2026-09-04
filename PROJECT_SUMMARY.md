# AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant
## Project Summary (Jharkhand Localized)

This project implements an AI-powered solution designed to help rural micro-entrepreneurs make informed business decisions by providing hyper-local business feasibility analysis and smart financial planning. The solution is specifically localized for Jharkhand with up-to-date (2024-2026) socio-economic data.

### Problem Addressed
Rural micro-entrepreneurs often struggle with:
- Lack of data-driven market research specific to their geographical location
- Poor financial literacy regarding loan structuring and repayment schedules
- Difficulty determining business viability and financial eligibility for government schemes
- High business failure rates due to uninformed decisions

### Solution Overview
The application consists of two core modules:

#### Module 1: Hyper-Local Business Feasibility Report (Jharkhand Focus)
Generates a localized business strategy including:
- **Market Reach**: Estimates consumer base within 5-10 km radius using Jharkhand-specific population density and income data
- **Opportunity Analysis**: Identifies unserved/underserved niches in the local Jharkhand economy (e.g., tribal handicrafts, organic farming, mineral-based industries)
- **SWOT Analysis**: Tailored Strengths, Weaknesses, Opportunities, and Threats reflecting Jharkhand's socio-economic landscape
- **Threats Identification**: Pinpoints local risks specific to Jharkhand (supply chain challenges in forested areas, seasonal rainfall variability, Naxal-affected zones, etc.)
- **Competitor Mapping**: Estimates density of similar businesses in Jharkhand's districts (Ranchi, Jamshedpur, Dhanbad, etc.)
- **Product Market Value**: Suggests optimal pricing strategies based on Jharkhand's regional purchasing power and consumption patterns

#### Module 2: Smart Financial Calculator & Scheme Router
Provides automated financial planning:
- **Financial Structuring**: Calculates total project cost (Available Margin / 10%) and loan eligibility (90% of project cost)
- **Scheme Auto-Selection**: Routes users to appropriate government loan scheme:
  - *Micro Finance Scheme*: For projects ≤ ₹1.40 lakh (6.5% interest, 3-year tenure, 3-month moratorium)
  - *Term Loan Scheme*: For projects > ₹1.40 lakh and ≤ ₹50.00 lakh (8% interest, 7-year tenure, 6-month moratorium)
- **EMI & Moratorium Generator**: Creates quarterly repayment schedules factoring in moratorium periods

### Technical Implementation

#### Files Created:
1. `main.py` - Main application with interactive CLI interface
2. `business_feasibility.py` - Hyper-local business analysis module (Jharkhand-localized with district-specific data)
3. `financial_calculator.py` - Financial calculations and scheme routing module
4. `demo.py` - Demonstration script showing Jharkhand-focused sample output
5. `simple_test.py` - Unit tests for individual modules
6. `test_assistant.py` - Integration tests
7. `requirements.txt` - Python dependencies
8. `README.md` - Project documentation
9. `PROJECT_SUMMARY.md` - This summary file

#### Key Features:
- **Jharkhand-Specific Hyper-local Analysis**: Uses geographic location to provide customized insights based on district-level data (population density, income, literacy, market access)
- **Multi-business Category Support**: Dairy, Retail, Textiles, Agriculture, Food Processing, Handicrafts, Services, Other
- **Government Scheme Compliance**: Follows exact specifications from Ministry of Social Justice and Empowerment
- **Interactive & Demo Modes**: Can be run interactively or as a demonstration
- **Error Handling**: Validates inputs and handles edge cases appropriately
- **Save Reports**: Option to save generated reports as JSON files

### How to Use
1. Install dependencies: `pip install -r requirements.txt`
2. Run interactive version: `python main.py`
3. Run Jharkhand-localized demo version: `python demo.py`
4. Run tests: `python simple_test.py` or `python test_assistant.py`

### Sample Output (Jharkhand Focus)
The demo shows analysis for a handicrafts business in Ranchi, Jharkhand with ₹75,000 margin capital:
- **Project Cost**: ₹7,50,000 (eligible for Term Loan Scheme)
- **Loan Amount**: ₹6,75,000 at 8% interest over 7 years with 6-month moratorium
- **Quarterly EMI**: ~₹26,787 starting after moratorium period
- **Total Interest Payable**: ₹2,75,622.93
- **Total Repayment**: ₹9,50,622.93

The analysis includes Jharkhand-specific insights:
- Market Reach: Estimates based on Ranchi's urban population density (~550/km²) and higher average income (₹18,000/month)
- Opportunities: Highlights Jharkhand's rich tribal handicraft traditions, training centers, and e-commerce export potential
- SWOT: Notes strengths like improving literacy and government support via Jharkhand State Livelihood Promotion Society; weaknesses like infrastructure gaps in interior districts; threats including Naxal-affected areas and water scarcity
- Competitor Mapping: Reflects Ranchi's competitive market for handicrafts
- Product Market Value: Suggests pricing for handicraft items based on Jharkhand's purchasing power and market access

### Impact
This tool empowers rural entrepreneurs in Jharkhand by:
1. Reducing business failure rates through data-backed decisions tailored to local realities
2. Eliminating financial confusion with clear loan eligibility and repayment schedules
3. Promoting financially sound entrepreneurship at the grassroots level
4. Democratizing access to institutional-grade business consulting with Jharkhand-specific insights

The solution addresses the critical need for localized, intelligent business advisory services that can help marginalized communities in Jharkhand leverage government schemes effectively for sustainable income generation, particularly in sectors like handicrafts, agriculture, and food processing where the state has comparative advantages.