#!/usr/bin/env python3
"""
Demo script for the Business Advisory Assistant
Shows sample output without requiring interactive input
Localized for Jharkhand with up-to-date data
"""

from main import BusinessAdvisoryAssistant, UserInput, display_feasibility_report, display_financial_plan
from business_feasibility import BusinessCategoryConst
import json

def run_demo():
    """Run a demo with sample inputs for Jharkhand"""
    print("=" * 60)
    print("AI-Driven Hyper-Local Business Advisory Assistant")
    print("For Rural Micro-Entrepreneurs - Jharkhand Localized DEMO")
    print("=" * 60)
    print()

    # Sample user input for Jharkand
    user_input = UserInput(
        geographic_location="Ranchi, Jharkhand",
        available_margin_capital=75000.0,  # Rs 75,000 margin (project cost will be Rs 7,50,000)
        proposed_business_category=BusinessCategoryConst.HANDICRAFTS
    )

    print("Sample Input (Jharkhand Focus):")
    print(f"  Geographic Location: {user_input.geographic_location}")
    print(f"  Available Margin Capital: Rs{user_input.available_margin_capital:,.2f}")
    print(f"  Proposed Business Category: {user_input.proposed_business_category}")
    print()

    print("=" * 60)
    print("ANALYZING YOUR BUSINESS PROPOSAL...")
    print("=" * 60)

    # Initialize the assistant
    assistant = BusinessAdvisoryAssistant()

    # Generate comprehensive report
    report = assistant.generate_comprehensive_report(user_input)

    # Display results
    display_feasibility_report(report["feasibility_report"])
    print()
    # In demo mode, automatically show visualizations
    display_financial_plan(report["financial_plan"], show_plots=True)

    # Show that we could save the report
    print()
    print("Demo completed! In the interactive version, you would be asked")
    print("if you want to save this report to a file.")
    print()
    try:
        input("Press Enter to exit...")  # Prevent window from closing when double-clicked
    except EOFError:
        # Handle case when running in non-interactive environment
        pass

if __name__ == "__main__":
    run_demo()