#!/usr/bin/env python3
"""
Simple test to verify NLP functionality in BusinessFeasibilityAnalyzer
"""

from business_feasibility import BusinessFeasibilityAnalyzer, BusinessCategoryConst

def test_nlp_keyword_extraction():
    """Test the NLP keyword extraction functionality"""
    print("Testing NLP Keyword Extraction...")
    analyzer = BusinessFeasibilityAnalyzer()

    # Test various location inputs
    test_locations = [
        "Ranchi, Jharkhand",
        "Near the Subarnarekha River",
        "Close to Birsa Munda Airport",
        "In the tribal belt of Khunti district",
        "By the Kanke Dam area"
    ]

    for location in test_locations:
        keywords = analyzer._get_keywords_from_text(location)
        print(f"  Location: '{location}' -> Keywords: {keywords}")

    print()

def test_opportunity_enhancement():
    """Test that NLP enhances opportunity analysis"""
    print("Testing Opportunity Analysis Enhancement...")
    analyzer = BusinessFeasibilityAnalyzer()

    # Test with a location that should yield specific keywords
    location = "Near Hundru Falls in Ranchi"
    business_category = BusinessCategoryConst.HANDICRAFTS
    budget = 75000.0

    # Call the full analyze method to trigger NLP enhancement
    result = analyzer.analyze(location, business_category, budget)

    print(f"  Location: {location}")
    print(f"  Business: {business_category}")
    print(f"  Budget: Rs{budget:,.2f}")
    print("  Opportunities from full analysis:")
    for i, opp in enumerate(result["opportunity_analysis"], 1):
        print(f"    {i}. {opp}")
    print()

def test_swot_enhancement():
    """Test that NLP enhances SWOT analysis"""
    print("Testing SWOT Analysis Enhancement...")
    analyzer = BusinessFeasibilityAnalyzer()

    location = "Near Hundru Falls in Ranchi"
    business_category = BusinessCategoryConst.HANDICRAFTS
    budget = 75000.0

    # Call the full analyze method to trigger NLP enhancement
    result = analyzer.analyze(location, business_category, budget)

    print(f"  Location: {location}")
    print(f"  Business: {business_category}")
    print(f"  Budget: Rs{budget:,.2f}")
    print("  SWOT Opportunities (last 2 should be NLP-related):")
    for i, opp in enumerate(result["swot_analysis"]["Opportunities"][-2:], len(result["swot_analysis"]["Opportunities"])-1):
        print(f"    {i+1}. {opp}")
    print("  SWOT Threats (last 2 should be NLP-related):")
    for i, threat in enumerate(result["swot_analysis"]["Threats"][-2:], len(result["swot_analysis"]["Threats"])-1):
        print(f"    {i+1}. {threat}")
    print()

if __name__ == "__main__":
    print("=" * 60)
    print("NLP FUNCTIONALITY TEST")
    print("=" * 60)
    print()

    test_nlp_keyword_extraction()
    test_opportunity_enhancement()
    test_swot_enhancement()

    print("NLP test completed successfully!")