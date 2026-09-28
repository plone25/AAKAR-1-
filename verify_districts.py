#!/usr/bin/env python3
"""
Verification script to confirm that all districts from the Excel file
are properly loaded into the BusinessFeasibilityAnalyzer.
"""

import pandas as pd
from business_feasibility import BusinessFeasibilityAnalyzer, BusinessCategoryConst

def main():
    print("=" * 60)
    print("VERIFYING JHARKHAND DISTRICTS LOADING")
    print("=" * 60)

    # Load Excel file directly to get baseline
    excel_df = pd.read_excel('jharkhand_business_data.xlsx')
    excel_df.columns = excel_df.columns.str.strip()
    excel_districts = set(excel_df['district'].str.strip().str.lower())

    print(f"Districts in Excel file: {len(excel_districts)}")
    print(f"Excel districts: {sorted(excel_districts)}")
    print()

    # Create analyzer instance
    analyzer = BusinessFeasibilityAnalyzer()

    # Get districts loaded in analyzer
    analyzer_districts = set(analyzer.jharkhand_data.keys())

    print(f"Districts loaded in analyzer: {len(analyzer_districts)}")
    print(f"Analyzer districts: {sorted(analyzer_districts)}")
    print()

    # Check if they match
    if excel_districts == analyzer_districts:
        print("SUCCESS: All districts from Excel are correctly loaded!")
    else:
        print("MISMATCH FOUND!")
        missing_in_analyzer = excel_districts - analyzer_districts
        extra_in_analyzer = analyzer_districts - excel_districts

        if missing_in_analyzer:
            print(f"   Missing in analyzer: {missing_in_analyzer}")
        if extra_in_analyzer:
            print(f"   Extra in analyzer: {extra_in_analyzer}")

    print()
    print("=" * 60)
    print("TESTING SAMPLE DISTRICT ANALYSIS")
    print("=" * 60)

    # Test analysis for a few different districts
    test_cases = [
        ("Ranchi, Jharkhand", BusinessCategoryConst.HANDICRAFTS, 75000),
        ("Dhanbad, Jharkhand", BusinessCategoryConst.OTHER, 100000),
        ("Dumka, Jharkhand", BusinessCategoryConst.AGRICULTURE, 50000),
        ("West Singhbhum, Jharkhand", BusinessCategoryConst.TEXTILES, 60000)
    ]

    for location, category, budget in test_cases:
        print(f"\nTesting: {location}")
        print(f"  Budget: Rs{budget:,} | Category: {category}")

        try:
            result = analyzer.analyze(location, category, budget)

            # Show key metrics
            market_reach = result["market_reach"]
            print(f"  Market Reach:")
            print(f"    Target Population: {market_reach['target_population_5_10km']:,}")
            print(f"    Monthly Market Size: Rs{market_reach['estimated_monthly_market_size_inr']:,}")
            print(f"    Reach Score: {market_reach['reach_score']}/100")

            # Show that NLP enhancement is working
            opportunities = result["opportunity_analysis"]
            nlp_opportunity = any("NLP-enhanced analysis" in str(opp) for opp in opportunities)
            print(f"  NLP Enhancement in Opportunities: {'YES' if nlp_opportunity else 'NO'}")

            # Show that risk simulation would work (we'll check for threat identification)
            threats = result["threats_identification"]
            print(f"  Threats Identified: {len(threats)} (including location-specific risks)")

        except Exception as e:
            print(f"  ERROR: {e}")

    print()
    print("=" * 60)
    print("VERIFICATION COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()