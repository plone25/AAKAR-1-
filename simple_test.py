"""
Simple test script to demonstrate the Business Advisory Assistant functionality
"""

from main import BusinessAdvisoryAssistant, UserInput
from business_feasibility import BusinessFeasibilityAnalyzer, BusinessCategoryConst
from financial_calculator import FinancialCalculator, LoanScheme

def test_business_feasibility():
    """Test the business feasibility analyzer"""
    print("Testing Business Feasibility Analyzer...")
    analyzer = BusinessFeasibilityAnalyzer()

    # Test with sample data
    result = analyzer.analyze(
        location="Sample Village, District XYZ",
        business_category=BusinessCategoryConst.DAIRY,
        budget=100000  # Rs 1 lakh budget
    )

    print("Feasibility analysis completed")
    print("Market reach:", result['market_reach'])
    print("Number of opportunities identified:", len(result['opportunity_analysis']))
    print("SWOT categories:", list(result['swot_analysis'].keys()))
    print()

def test_financial_calculator():
    """Test the financial calculator"""
    print("Testing Financial Calculator...")
    calculator = FinancialCalculator()

    # Test scheme selection
    test_costs = [50000, 100000, 200000, 500000]

    for cost in test_costs:
        try:
            scheme = calculator.determine_loan_scheme(cost)
            print("Project cost Rs{:,} -> {}".format(cost, scheme.name))
        except ValueError as e:
            print("Project cost Rs{:,} -> Not eligible: {}".format(cost, e))

    # Test EMI calculation
    print("\nSample EMI calculation:")
    emi_schedule = calculator.calculate_emi_schedule(
        loan_amount=90000,
        interest_rate=6.5,
        tenure_years=3,
        moratorium_months=3
    )

    if emi_schedule:
        print("First quarter EMI: Rs{:,.2f}".format(emi_schedule[0]['emi_payment']))
        print("Total quarters:", len(emi_schedule))

    print()

def test_integration():
    """Test the integrated assistant"""
    print("Testing Integrated Assistant...")
    assistant = BusinessAdvisoryAssistant()

    # Create sample user input
    user_input = UserInput(
        geographic_location="Test Village, Sample District",
        available_margin_capital=50000,  # Rs 50,000 margin
        proposed_business_category=BusinessCategoryConst.RETAIL
    )

    # Test feasibility analysis
    feasibility_report = assistant.run_feasibility_analysis(user_input)
    print("Feasibility analysis completed")

    # Test financial calculation
    financial_plan = assistant.run_financial_calculation(user_input)
    print("Financial calculation completed")
    print("Project cost: Rs{:,}".format(financial_plan.project_cost))
    print("Loan amount: Rs{:,}".format(financial_plan.loan_amount))
    print("Selected scheme: {}".format(financial_plan.loan_scheme.name))
    print()

def main():
    """Run all tests"""
    print("=" * 50)
    print("BUSINESS ADVISORY ASSISTANT - MODULE TESTS")
    print("=" * 50)
    print()

    try:
        test_business_feasibility()
        test_financial_calculator()
        test_integration()

        print("=" * 50)
        print("ALL TESTS COMPLETED SUCCESSFULLY!")
        print("=" * 50)

    except Exception as e:
        print("TEST FAILED WITH ERROR:", str(e))
        raise

if __name__ == "__main__":
    main()