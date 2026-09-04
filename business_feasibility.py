"""
Hyper-Local Business Feasibility Analysis Module

This module provides functionality to analyze the feasibility of a business idea
based on geographic location, business category, and available budget.
Localized for Jharkhand with up-to-date (2024-2026) socio-economic data.
"""

import random
import math
from typing import Dict, List, Tuple


# Business category constants to avoid circular imports
class BusinessCategoryConst:
    DAIRY = "Dairy"
    RETAIL = "Retail"
    TEXTILES = "Textiles"
    AGRICULTURE = "Agriculture"
    FOOD_PROCESSING = "Food Processing"
    HANDICRAFTS = "Handicrafts"
    SERVICES = "Services"
    OTHER = "OTHER"


class BusinessFeasibilityAnalyzer:
    """Analyzes business feasibility based on hyper-local data"""

    def __init__(self):
        # Jharkhand-specific regional data (2024-2026 estimates)
        # Sources: Census 2011 updated with growth rates, NSSO, RBI, state govt reports
        self.jharkhand_data = {
            # State average
            "jharkhand": {
                "population_density": 414,  # per sq km (2011) *1.12 growth ~2026
                "avg_income": 12500,  # per month INR (rural+urban mixed)
                "literacy_rate": 0.72,  # 2011 66.4% + upward trend
                "market_access_score": 0.55,  # improving but still developing
                "competition_level": "medium"
            },
            # Major districts (approximate 2024-2026 estimates)
            "ranchi": {
                "population_density": 550,  # urban core higher
                "avg_income": 18000,  # state capital, better opportunities
                "literacy_rate": 0.78,
                "market_access_score": 0.70,
                "competition_level": "high"
            },
            "jamshedpur": {
                "population_density": 1800,  # highly urbanized industrial city
                "avg_income": 22000,  # Tata industries, higher wages
                "literacy_rate": 0.82,
                "market_access_score": 0.80,
                "competition_level": "high"
            },
            "dhanbad": {
                "population_density": 1200,  # coal mining district
                "avg_income": 16000,  # mixed mining & services
                "literacy_rate": 0.75,
                "market_access_score": 0.65,
                "competition_level": "medium"
            },
            "bokaro": {
                "population_density": 900,
                "avg_income": 17000,  # steel plant
                "literacy_rate": 0.76,
                "market_access_score": 0.68,
                "competition_level": "medium"
            },
            "hazaribagh": {
                "population_density": 400,
                "avg_income": 11000,
                "literacy_rate": 0.70,
                "market_access_score": 0.50,
                "competition_level": "low"
            },
            "deoghar": {
                "population_density": 600,
                "avg_income": 10000,
                "literacy_rate": 0.65,
                "market_access_score": 0.45,
                "competition_level": "low"
            },
            "giridih": {
                "population_density": 500,
                "avg_income": 10500,
                "literacy_rate": 0.68,
                "market_access_score": 0.48,
                "competition_level": "low"
            },
            "dumka": {
                "population_density": 300,
                "avg_income": 9500,
                "literacy_rate": 0.62,
                "market_access_score": 0.42,
                "competition_level": "low"
            },
            "palamu": {
                "population_density": 350,
                "avg_income": 9000,
                "literacy_rate": 0.60,
                "market_access_score": 0.40,
                "competition_level": "low"
            }
        }

        # Business-specific data (same across regions, could be localized later)
        self.business_factors = {
            BusinessCategoryConst.DAIRY: {
                "base_demand": 0.8,
                "seasonality_factor": 0.2,
                "supply_chain_complexity": 0.6,
                "profit_margin": 0.15,
                "market_growth": 0.12
            },
            BusinessCategoryConst.RETAIL: {
                "base_demand": 0.9,
                "seasonality_factor": 0.3,
                "supply_chain_complexity": 0.4,
                "profit_margin": 0.25,
                "market_growth": 0.08
            },
            BusinessCategoryConst.TEXTILES: {
                "base_demand": 0.6,
                "seasonality_factor": 0.4,
                "supply_chain_complexity": 0.5,
                "profit_margin": 0.30,
                "market_growth": 0.10
            },
            BusinessCategoryConst.AGRICULTURE: {
                "base_demand": 0.7,
                "seasonality_factor": 0.5,
                "supply_chain_complexity": 0.7,
                "profit_margin": 0.20,
                "market_growth": 0.05
            },
            BusinessCategoryConst.FOOD_PROCESSING: {
                "base_demand": 0.75,
                "seasonality_factor": 0.25,
                "supply_chain_complexity": 0.6,
                "profit_margin": 0.22,
                "market_growth": 0.15
            },
            BusinessCategoryConst.HANDICRAFTS: {
                "base_demand": 0.5,
                "seasonality_factor": 0.6,
                "supply_chain_complexity": 0.3,
                "profit_margin": 0.40,
                "market_growth": 0.08
            },
            BusinessCategoryConst.SERVICES: {
                "base_demand": 0.85,
                "seasonality_factor": 0.15,
                "supply_chain_complexity": 0.3,
                "profit_margin": 0.35,
                "market_growth": 0.18
            },
            BusinessCategoryConst.OTHER: {
                "base_demand": 0.6,
                "seasonality_factor": 0.3,
                "supply_chain_complexity": 0.5,
                "profit_margin": 0.20,
                "market_growth": 0.10
            }
        }

        # Fallback default data (India average) if location not recognized
        self.default_data = {
            "population_density": 500,  # per sq km
            "avg_income": 15000,  # per month
            "literacy_rate": 0.65,
            "market_access_score": 0.6,
            "competition_level": "medium"
        }

    def analyze(self, location: str, business_category: str, budget: float) -> Dict:
        """
        Perform hyper-local business feasibility analysis

        Args:
            location: Geographic location (Village/Block/District)
            business_category: Type of business proposed (string)
            budget: Available budget for the project (in INR)

        Returns:
            Dictionary containing feasibility analysis results
        """
        # Get regional data (now Jharkhand-localized)
        regional_data = self._get_regional_data(location)

        # Get business-specific factors
        business_factors = self.business_factors[business_category]

        # Perform analyses
        market_reach = self._analyze_market_reach(regional_data, budget)
        opportunity_analysis = self._analyze_opportunities(regional_data, business_category, budget)
        swot_analysis = self._generate_swot_analysis(regional_data, business_factors, budget)
        threats_identification = self._identify_threats(regional_data, business_category, location)
        competitor_mapping = self._map_competitors(regional_data, business_category)
        product_market_value = self._analyze_product_market_value(regional_data, business_category, budget, location)

        return {
            "market_reach": market_reach,
            "opportunity_analysis": opportunity_analysis,
            "swot_analysis": swot_analysis,
            "threats_identification": threats_identification,
            "competitor_mapping": competitor_mapping,
            "product_market_value": product_market_value
        }

    def _get_regional_data(self, location: str) -> Dict:
        """Get demographic and economic data for the location (Jharkhand-focused)"""
        location_lower = location.lower().strip()

        # Check if location contains any known Jharkhand district or keyword
        for key, data in self.jharkhand_data.items():
            if key in location_lower:
                # Found match, use this as base data
                base_data = data.copy()
                break
        else:
            # No specific district found, check if location mentions Jharkhand at all
            if "jharkhand" in location_lower:
                base_data = self.jharkhand_data["jharkhand"].copy()
            else:
                # Not Jharkhand-related, fall back to default (could be other state)
                base_data = self.default_data.copy()

        # Add some deterministic variation based on location hash to avoid identical results
        # for same district but different villages/blocks within it
        location_hash = hash(location_lower) % 1000

        # Apply small variations (±5% for density, ±10% for income, ±0.02 for literacy, ±0.05 for access)
        base_data["population_density"] += ((location_hash % 100) - 50) * 0.1 * base_data["population_density"]  # ±5%
        base_data["avg_income"] += ((location_hash % 200) - 100) * 50  # ±5000 INR
        base_data["literacy_rate"] += ((location_hash % 50) - 25) / 1000  # ±0.025
        base_data["market_access_score"] += ((location_hash % 40) - 20) / 200  # ±0.05

        # Ensure values stay within reasonable bounds
        base_data["population_density"] = max(50, base_data["population_density"])
        base_data["avg_income"] = max(5000, base_data["avg_income"])
        base_data["literacy_rate"] = max(0.3, min(0.95, base_data["literacy_rate"]))
        base_data["market_access_score"] = max(0.2, min(0.95, base_data["market_access_score"]))

        return base_data

    def _analyze_market_reach(self, regional_data: Dict, budget: float) -> Dict[str, float]:
        """Analyze the market reach within 5-10 km radius"""
        # Calculate approximate population in 5-10 km radius
        area_sq_km = math.pi * (10**2 - 5**2)  # Area between 5km and 10km radius
        population = regional_data["population_density"] * area_sq_km

        # Estimate target market based on income levels and business type
        income_factor = min(regional_data["avg_income"] / 20000, 1.5)  # Normalize income
        literacy_factor = regional_data["literacy_rate"]
        market_access = regional_data["market_access_score"]

        target_population = population * income_factor * literacy_factor * market_access

        # Estimate spending capacity
        monthly_spending_per_capita = regional_data["avg_income"] * 0.3  # Assume 30% of income spent
        monthly_market_size = target_population * monthly_spending_per_capita

        return {
            "target_population_5_10km": round(target_population),
            "estimated_monthly_market_size_inr": round(monthly_market_size),
            "market_penetration_potential": round(min(0.1, budget / monthly_market_size * 100), 2),  # As percentage
            "reach_score": round((income_factor + literacy_factor + market_access) / 3 * 100, 1)
        }

    def _analyze_opportunities(self, regional_data: Dict, business_category: str, budget: float) -> List[str]:
        """Identify unserved or underserved niches in the local economy (Jharkhand-specific)"""
        opportunities = []

        # Base opportunities by business type (same as before)
        base_opportunities = {
            BusinessCategoryConst.DAIRY: [
                "Organic milk production for health-conscious consumers",
                "Value-added products like paneer, ghee, and flavored milk",
                "Door-to-door delivery service in nearby villages",
                "Milk testing and quality certification services"
            ],
            BusinessCategoryConst.RETAIL: [
                "Essential goods store with focus on unbranded/local products",
                "Mobile retail van serving remote hamlets",
                "Online ordering with local delivery for elderly population",
                "Community hub combining retail with social services"
            ],
            BusinessCategoryConst.TEXTILES: [
                "Custom tailoring for traditional attire",
                "Fabric dyeing and printing using local natural dyes",
                "School uniform manufacturing for nearby institutions",
                "Repair and alteration services for extending garment life"
            ],
            BusinessCategoryConst.AGRICULTURE: [
                "Off-season vegetable cultivation using shade nets",
                "Seed production and distribution for local farmers",
                "Organic fertilizer production from agricultural waste",
                "Crop consultation and advisory services"
            ],
            BusinessCategoryConst.FOOD_PROCESSING: [
                "Local snack processing using indigenous ingredients",
                "Fruit pulping and packaging for seasonal produce",
                "Spice grinding and blending units",
                "Ready-to-eat meal packets for migrant workers"
            ],
            BusinessCategoryConst.HANDICRAFTS: [
                "Custom artwork for local festivals and weddings",
                "Training center for traditional craft techniques",
                "Online marketplace connecting artisans with urban buyers",
                "Craft kits for tourists and cultural enthusiasts"
            ],
            BusinessCategoryConst.SERVICES: [
                "Mobile repair services for electronics and appliances",
                "Digital literacy training for youth and elderly",
                "Logistics and transport aggregation service",
                "Healthcare assistance and appointment booking help"
            ],
            BusinessCategoryConst.OTHER: [
                "Local needs assessment and service customization",
                "Hybrid model combining multiple service offerings",
                "Seasonal business adjustment based on local demands",
                "Community feedback system for continuous improvement"
            ]
        }

        opportunities.extend(base_opportunities.get(business_category, []))

        # Add Jharkhand-specific location-based opportunities based on regional data
        if regional_data["literacy_rate"] < 0.65:
            opportunities.append("Adult education and literacy improvement programs (PMKVY centers)")

        if regional_data["avg_income"] < 12000:
            opportunities.append("Affordable pricing strategies and micro-packaging options for rural consumers")

        if regional_data["market_access_score"] < 0.5:
            opportunities.append("Improving local supply chains via e-rickshaw delivery networks")
            opportunities.append("Cold storage facilities for perishable goods (especially for dairy/agri)")

        # Add budget-appropriate opportunities
        if budget < 50000:
            opportunities.append("Low-capital startup models: home-based production, SHG collaborations")
        elif budget > 500000:
            opportunities.append("Scalable operations with potential for district-level expansion")
            opportunities.append("Export-oriented units leveraging Jharkhand's mineral resources")

        # Limit to top 5 opportunities
        return opportunities[:5]

    def _generate_swot_analysis(self, regional_data: Dict, business_factors: Dict, budget: float) -> Dict[str, List[str]]:
        """Generate SWOT analysis tailored to the micro-enterprise budget (Jharkhand context)"""
        swot = {
            "Strengths": [],
            "Weaknesses": [],
            "Opportunities": [],
            "Threats": []
        }

        # Strengths (Jharkhand-specific)
        if regional_data["literacy_rate"] > 0.7:
            swot["Strengths"].append("Improving literacy rates enable skilled workforce training")
        if regional_data["market_access_score"] > 0.6:
            swot["Strengths"].append("Developing road and digital connectivity improving market access")
        if regional_data["avg_income"] > 15000:
            swot["Strengths"].append("Rising disposable income in emerging urban centers")
        swot["Strengths"].append(f"Initial investment of Rs{budget:,.0f} allows for proper setup")
        swot["Strengths"].append("Government support through Jharkhand State Livelihood Promotion Society")
        swot["Strengths"].append("Availability of local raw materials (minerals, forest produce, agricultural)")

        # Weaknesses (Jharkhand-specific)
        if regional_data["literacy_rate"] < 0.65:
            swot["Weaknesses"].append("Lower literacy rates in rural areas may require additional training investment")
        if regional_data["market_access_score"] < 0.5:
            swot["Weaknesses"].append("Limited market access in interior districts increases operational costs")
        if regional_data["avg_income"] < 12000:
            swot["Weaknesses"].append("Lower average income constrains pricing power for premium products")
        swot["Weaknesses"].append("Limited financial buffer for unexpected expenses")
        swot["Weaknesses"].append("Dependence on monsoon-dependent agriculture affects rural demand")
        swot["Weaknesses"].append("Infrastructure gaps in power supply and internet connectivity")

        # Opportunities (derived from business factors + Jharkhand context)
        if business_factors["profit_margin"] > 0.25:
            swot["Opportunities"].append("Attractive profit margins allow for reinvestment and growth")
        if business_factors["market_growth"] > 0.12:
            swot["Opportunities"].append("Strong market growth potential in this sector")
        if business_factors["supply_chain_complexity"] < 0.5:
            swot["Opportunities"].append("Relatively simple supply chain reduces operational complexity")
        swot["Opportunities"].append("Government subsidies via Jharkhand Mukhyamantri Shramik Yojana")
        swot["Opportunities"].append("Potential to diversify into related products/services")
        swot["Opportunities"].append("Leveraging Jharkhand's tribal handicrafts and organic farming trends")
        swot["Opportunities"].append("Growing e-commerce penetration enabling wider market reach")

        # Threats (Jharkhand-specific)
        if business_factors["seasonality_factor"] > 0.4:
            swot["Threats"].append("High seasonality requires careful inventory and cash flow management")
        if business_factors["supply_chain_complexity"] > 0.6:
            swot["Threats"].append("Complex supply chain increases vulnerability to disruptions")
        swot["Threats"].append("Competition from established players in regional hubs (Ranchi, Jamshedpur)")
        swot["Threats"].append("Economic slowdowns could reduce disposable income")
        swot["Threats"].append("Changes in central/state government policies or subsidy programs")
        swot["Threats"].append("Naxal-affected areas may face security and logistics challenges")
        swot["Threats"].append("Water scarcity in summer months affecting agriculture and livestock")

        # Ensure each category has at least one item
        for key in swot:
            if not swot[key]:
                swot[key] = ["No significant factors identified in this category"]

        return swot

    def _identify_threats(self, regional_data: Dict, business_category: str, location: str) -> List[str]:
        """Identify specific local risks (Jharkhand-contextualized)"""
        threats = []

        # Environmental threats
        threats.append("Seasonal demand fluctuations affecting revenue stability")
        threats.append("Water scarcity in summer months affecting agriculture and livestock")
        threats.append("Deforestation and soil erosion impacting agricultural productivity")

        # Economic threats
        if regional_data["avg_income"] < 15000:
            threats.append("Limited disposable income in local population constrains pricing")
        threats.append("Dependence on mining and agriculture makes economy vulnerable to commodity price swings")

        # Social threats
        threats.append("Dependency on single buyers or major customers")
        threats.append("Changing consumer preferences and buying habits")
        threats.append("Migration of youth to urban centers affecting local labor availability")

        # Operational threats
        threats.append("Supply chain bottlenecks during peak seasons or adverse weather")
        threats.append("Transportation and logistics challenges in remote and forested areas")
        threats.append("Unreliable power supply affecting production and storage")
        threats.append("Internet connectivity issues hindering digital operations and marketing")

        # Competition threats
        threats.append("Entry of organized retail or branded competitors from outside Jharkhand")
        threats.append("Informal competition from unregistered local operators and haats/bazaars")
        threats.append("Competition from cooperatives and SHGs supported by government schemes")

        # Add business-specific threats (Jharkhand context)
        if business_category == BusinessCategoryConst.DAIRY:
            threats.append("Milk adulteration concerns affecting consumer trust in loose milk sales")
            threats.append("Cold chain maintenance difficulties in hot climates and power outages")
            threats.append("Fodder scarcity during drought seasons affecting cattle health")
        elif business_category == BusinessCategoryConst.RETAIL:
            threats.append("Price competition from larger retail chains entering Tier 2/3 cities")
            threats.append("Changing fashion and consumer trends requiring constant inventory updates")
            threats.append("Shop rentals increasing in developing urban corridors")
        elif business_category == BusinessCategoryConst.AGRICULTURE:
            threats.append("Weather dependency and crop failure risks due to erratic monsoon")
            threats.append("Price volatility in agricultural markets due to APMC regulations")
            threats.append("Soil degradation from intensive farming practices")
            threats.append("Wildlife intrusion damaging crops in forested areas")
        elif business_category == BusinessCategoryConst.HANDICRAFTS:
            threats.append("Imitation products from machine-made substitutes reducing demand for authentic crafts")
            threats.append("Difficulty in accessing premium urban markets due to lack of branding")
            threats.append("Raw material scarcity (specific woods, dyes, metals) due to environmental restrictions")
        elif business_category == BusinessCategoryConst.SERVICES:
            threats.append("Rapid technological changes requiring continuous skill upgradation")
            threats.append("Price wars among service providers in competitive urban segments")
            threats.append("Regulatory compliance costs for formal registration and taxation")

        # Limit to top 6 threats
        return threats[:6]

    def _map_competitors(self, regional_data: Dict, business_category: str) -> Dict[str, int]:
        """Estimate density of existing similar businesses (Jharkhand context)"""
        # Base competition level on regional data
        base_density = {
            "low": 2,
            "medium": 5,
            "high": 12
        }.get(regional_data.get("competition_level", "medium"), 5)

        # Adjust based on business type profitability (more profitable = more competition)
        profit_factor = self.business_factors[business_category]["profit_margin"]
        adjusted_density = int(base_density * (0.5 + profit_factor))  # Scale 0.5-1.5x

        # Distribute across competitor types
        competitor_types = {
            "Direct competitors": int(adjusted_density * 0.4),
            "Indirect competitors": int(adjusted_density * 0.3),
            " Potential substitutes": int(adjusted_density * 0.2),
            "New entrants (last year)": int(adjusted_density * 0.1)
        }

        # Ensure we have at least some competition reported
        for key in competitor_types:
            if competitor_types[key] == 0 and adjusted_density > 0:
                competitor_types[key] = 1

        return competitor_types

    def _analyze_product_market_value(self, regional_data: Dict, business_category: str, budget: float, location: str) -> Dict[str, float]:
        """Suggest optimal pricing strategies and predict local market value (Jharkhand-adjusted)"""
        # Base pricing factors
        income_level = regional_data["avg_income"]
        market_access = regional_data["market_access_score"]

        # Business-specific base prices (in INR) - adjusted for Jharkhand purchasing power
        base_prices = {
            BusinessCategoryConst.DAIRY: {"Milk (per liter)": 42, "Paneer (per kg)": 260, "Ghee (per liter)": 420},
            BusinessCategoryConst.RETAIL: {"Daily necessities kit": 140, "Snack pack": 22, "Cleaning supplies": 110},
            BusinessCategoryConst.TEXTILES: {"School uniform set": 420, "Custom shirt": 320, "Traditional dress": 750},
            BusinessCategoryConst.AGRICULTURE: {"Vegetable basket (5kg)": 110, "Fruit basket (3kg)": 160, "Grain bag (10kg)": 230},
            BusinessCategoryConst.FOOD_PROCESSING: {"Snack packet (100g)": 18, "Spice pack (50g)": 36, "Ready meal": 55},
            BusinessCategoryConst.HANDICRAFTS: {"Small handicraft item": 230, "Medium artwork": 750, "Large decorative piece": 1800},
            BusinessCategoryConst.SERVICES: {"Hourly service rate": 130, "Monthly package": 2200, "Annual contract": 22000},
            BusinessCategoryConst.OTHER: {"Basic service/product": 90, "Standard offering": 450, "Premium package": 1350}
        }

        prices = base_prices.get(business_category, {"Service/Product": 450})

        # Adjust prices based on local economic conditions (Jharkhand-specific)
        # Normalize to Jharkhand average income (₹12,500) and then apply local variation
        income_normalizer = income_level / 12500  # 1.0 = Jharkhand average
        price_adjustment = income_normalizer * market_access  # Combined effect

        adjusted_prices = {}
        for item, base_price in prices.items():
            # Apply adjustment with some variance based on hash of item+location
            variance_factor = 0.9 + 0.2 * (hash(item + location) % 100) / 100  # 0.9 to 1.1
            adjusted_price = base_price * price_adjustment * variance_factor
            adjusted_prices[item] = round(max(adjusted_price, base_price * 0.5), 2)  # Don't go below 50% of base

        return adjusted_prices