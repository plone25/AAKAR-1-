#!/usr/bin/env python3
"""
Edge case tests for NLP functionality
"""

from business_feasibility import BusinessFeasibilityAnalyzer, BusinessCategoryConst

def test_edge_cases():
    """Test edge cases for NLP functionality"""
    print("Testing NLP Edge Cases...")
    analyzer = BusinessFeasibilityAnalyzer()

    # Test empty string
    empty_keywords = analyzer._get_keywords_from_text("")
    print(f"  Empty string: {empty_keywords}")

    # Test None (should be handled by isinstance check)
    try:
        none_keywords = analyzer._get_keywords_from_text(None)
        print(f"  None input: {none_keywords}")
    except Exception as e:
        print(f"  None input caused exception: {e}")

    # Test numbers and special characters
    special_keywords = analyzer._get_keywords_from_text("123 @#$%^&*()")
    print(f"  Special chars: {special_keywords}")

    # Test single word
    single_keywords = analyzer._get_keywords_from_text("Hello")
    print(f"  Single word: {single_keywords}")

    # Test location with no recognizable nouns (unlikely but possible)
    weird_keywords = analyzer._get_keywords_from_text("the and of")
    print(f"  Stop words: {weird_keywords}")

    print()

def test_full_analysis_with_edge_locations():
    """Test full analysis with various location formats"""
    print("Testing Full Analysis with Different Locations...")
    analyzer = BusinessFeasibilityAnalyzer()

    test_cases = [
        ("", BusinessCategoryConst.HANDICRAFTS, 50000),  # Empty location
        ("   ", BusinessCategoryConst.RETAIL, 75000),    # Whitespace only
        ("12345", BusinessCategoryConst.AGRICULTURE, 100000),  # Numbers only
    ]

    for location, category, budget in test_cases:
        try:
            result = analyzer.analyze(location, category, budget)
            print(f"  Location: '{location}' -> Analysis completed successfully")
            # Show that NLP enhancements are present in SWOT
            opp_nlp = any("NLP-enhanced analysis" in str(opp) for opp in result["swot_analysis"]["Opportunities"])
            threat_nlp = any("NLP-enhanced monitoring" in str(threat) for threat in result["swot_analysis"]["Threats"])
            print(f"    NLP Opportunity enhancement: {opp_nlp}")
            print(f"    NLP Threat enhancement: {threat_nlp}")
        except Exception as e:
            print(f"  Location: '{location}' -> Error: {e}")

    print()

if __name__ == "__main__":
    print("=" * 60)
    print("NLP EDGE CASE TESTING")
    print("=" * 60)
    print()

    test_edge_cases()
    test_full_analysis_with_edge_locations()

    print("Edge case testing completed!")