#!/usr/bin/env python3
"""
AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant
for Rural Micro-Entrepreneurs

Main application entry point that integrates both modules:
1. Hyper-Local Business Feasibility Report
2. Smart Financial Calculator & Scheme Router
"""

import json
import os
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict

# Import our modules (we'll create these next)
from business_feasibility import BusinessFeasibilityAnalyzer, BusinessCategoryConst
from financial_calculator import FinancialCalculator, LoanScheme


@dataclass
class UserInput:
    """Data class to hold user input"""
    geographic_location: str  # Village/Block/District
    available_margin_capital: float  # In INR
    proposed_business_category: str  # Using string for business category


@dataclass
class FinancialPlan:
    """Data class to hold the financial plan results"""
    project_cost: float
    loan_amount: float
    margin_money: float
    loan_scheme: object  # LoanScheme object
    emi_schedule: List[Dict]
    moratorium_period: int
    total_interest: float
    total_repayment: float


class BusinessAdvisoryAssistant:
    """Main application class that coordinates both modules"""

    def __init__(self):
        self.feasibility_analyzer = BusinessFeasibilityAnalyzer()
        self.financial_calculator = FinancialCalculator()

    def run_feasibility_analysis(self, user_input: UserInput) -> Dict:
        """
        Run the hyper-local business feasibility analysis

        Args:
            user_input: User's geographic location, available margin, and business category

        Returns:
            Dictionary containing feasibility analysis results
        """
        return self.feasibility_analyzer.analyze(
            location=user_input.geographic_location,
            business_category=user_input.proposed_business_category,
            budget=user_input.available_margin_capital * 10  # Total project cost estimate
        )

    def run_financial_calculation(self, user_input: UserInput) -> FinancialPlan:
        """
        Run the smart financial calculator and scheme router

        Args:
            user_input: User's geographic location, available margin, and business category

        Returns:
            FinancialPlan object containing financial structuring details
        """
        # Calculate total project cost (margin is 10% of total)
        project_cost = user_input.available_margin_capital / 0.10
        loan_amount = project_cost - user_input.available_margin_capital

        # Determine appropriate loan scheme
        loan_scheme = self.financial_calculator.determine_loan_scheme(project_cost)

        # Calculate EMI schedule and other financial details
        emi_schedule = self.financial_calculator.calculate_emi_schedule(
            loan_amount=loan_amount,
            interest_rate=loan_scheme.interest_rate,
            tenure_years=loan_scheme.tenure_years,
            moratorium_months=loan_scheme.moratorium_months
        )

        # Calculate total interest and repayment
        total_interest = sum(emi['interest'] for emi in emi_schedule)
        total_repayment = loan_amount + total_interest

        return FinancialPlan(
            project_cost=project_cost,
            loan_amount=loan_amount,
            margin_money=user_input.available_margin_capital,
            loan_scheme=loan_scheme,
            emi_schedule=emi_schedule,
            moratorium_period=loan_scheme.moratorium_months,
            total_interest=total_interest,
            total_repayment=total_repayment
        )

    def generate_comprehensive_report(self, user_input: UserInput) -> Dict:
        """
        Generate a comprehensive report combining both modules

        Args:
            user_input: User's geographic location, available margin, and business category

        Returns:
            Dictionary containing both feasibility report and financial plan
        """
        feasibility_report = self.run_feasibility_analysis(user_input)
        financial_plan = self.run_financial_calculation(user_input)

        return {
            "user_input": {
                "geographic_location": user_input.geographic_location,
                "available_margin_capital": user_input.available_margin_capital,
                "proposed_business_category": user_input.proposed_business_category
            },
            "feasibility_report": {
                "market_reach": feasibility_report["market_reach"],
                "opportunity_analysis": feasibility_report["opportunity_analysis"],
                "swot_analysis": feasibility_report["swot_analysis"],
                "threats_identification": feasibility_report["threats_identification"],
                "competitor_mapping": feasibility_report["competitor_mapping"],
                "product_market_value": feasibility_report["product_market_value"]
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
                "emi_schedule": financial_plan.emi_schedule[:4],  # Show first 4 quarters as sample
                "moratorium_period": financial_plan.moratorium_period,
                "total_interest": financial_plan.total_interest,
                "total_repayment": financial_plan.total_repayment
            }
        }


def main():
    """Main function to run the interactive application"""
    print("=" * 60)
    print("AI-Driven Hyper-Local Business Advisory Assistant")
    print("For Rural Micro-Entrepreneurs")
    print("=" * 60)
    print()

    # Get user input
    print("Please provide the following information:")
    print()

    geographic_location = input("Geographic Location (Village/Block/District): ").strip()

    while True:
        try:
            margin_input = input("Available Margin Capital (in INR, e.g., 100000): ").strip()
            available_margin_capital = float(margin_input)
            if available_margin_capital <= 0:
                print("Please enter a positive amount.")
                continue
            break
        except ValueError:
            print("Please enter a valid number.")

    print("\nProposed Business Category:")
    categories = [
        BusinessCategoryConst.DAIRY,
        BusinessCategoryConst.RETAIL,
        BusinessCategoryConst.TEXTILES,
        BusinessCategoryConst.AGRICULTURE,
        BusinessCategoryConst.FOOD_PROCESSING,
        BusinessCategoryConst.HANDICRAFTS,
        BusinessCategoryConst.SERVICES,
        BusinessCategoryConst.OTHER
    ]

    for i, category in enumerate(categories, 1):
        print(f"{i}. {category}")

    while True:
        try:
            choice = int(input("Select business category (1-8): ").strip())
            if 1 <= choice <= 8:
                proposed_business_category = categories[choice - 1]
                break
            else:
                print("Please select a number between 1 and 8.")
        except ValueError:
            print("Please enter a valid number.")

    # Create user input object
    user_input = UserInput(
        geographic_location=geographic_location,
        available_margin_capital=available_margin_capital,
        proposed_business_category=proposed_business_category
    )

    print("\n" + "=" * 60)
    print("ANALYZING YOUR BUSINESS PROPOSAL...")
    print("=" * 60)

    # Initialize the assistant
    assistant = BusinessAdvisoryAssistant()

    # Generate comprehensive report
    report = assistant.generate_comprehensive_report(user_input)

    # Display results
    display_feasibility_report(report["feasibility_report"])
    print()
    # Ask user if they want to see visualizations
    show_viz = input("\nWould you like to see financial visualizations? (y/n): ").strip().lower()
    display_financial_plan(report["financial_plan"], show_plots=(show_viz in ['y', 'yes']))

    # Ask if user wants to save the report
    save_choice = input("\nWould you like to save this report to a file? (y/n): ").strip().lower()
    if save_choice in ['y', 'yes']:
        filename = f"business_report_{geographic_location.replace(' ', '_')}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"Report saved to {filename}")

    print()
    input("Press Enter to exit...")  # Prevent window from closing when double-clicked


def display_feasibility_report(report: Dict):
    """Display the feasibility report in a user-friendly format"""
    print("\n[HYPER-LOCAL BUSINESS FEASIBILITY REPORT]")
    print("-" * 50)

    print("\n[MARKET REACH]")
    for key, value in report["market_reach"].items():
        print(f"  - {key}: {value}")

    print("\n[OPPORTUNITY ANALYSIS]")
    for i, opportunity in enumerate(report["opportunity_analysis"], 1):
        print(f"  {i}. {opportunity}")

    print("\n[SWOT ANALYSIS]")
    for category, items in report["swot_analysis"].items():
        print(f"  {category.upper()}:")
        for item in items:
            print(f"    - {item}")

    print("\n[THREATS IDENTIFICATION]")
    for i, threat in enumerate(report["threats_identification"], 1):
        print(f"  {i}. {threat}")

    print("\n[COMPETITOR MAPPING]")
    for competitor_type, count in report["competitor_mapping"].items():
        print(f"  - {competitor_type}: {count} businesses")

    print("\n[PRODUCT MARKET VALUE]")
    for product, value in report["product_market_value"].items():
        print(f"  - {product}: Rs{value:,.2f}")


def display_financial_plan(plan: Dict, show_plots: bool = False):
    """Display the financial plan in a user-friendly format with optional plots"""
    print("\n[SMART FINANCIAL CALCULATOR & SCHEME ROUTER]")
    print("-" * 50)

    print("\n[FINANCIAL STRUCTURING]")
    print(f"  - Available Margin Capital: Rs{plan['margin_money']:,.2f}")
    print(f"  - Total Project Cost: Rs{plan['project_cost']:,.2f}")
    print(f"  - Loan Amount Eligible: Rs{plan['loan_amount']:,.2f}")

    scheme = plan["loan_scheme"]
    print(f"\n[LOAN SCHEME SELECTED: {scheme['name']}]")
    print(f"  - Interest Rate: {scheme['interest_rate']}% per annum")
    print(f"  - Tenure: {scheme['tenure_years']} years")
    print(f"  - Moratorium Period: {scheme['moratorium_months']} months")

    print(f"\n[FINANCIAL SUMMARY]")
    print(f"  - Total Interest Payable: Rs{plan['total_interest']:,.2f}")
    print(f"  - Total Repayment Amount: Rs{plan['total_repayment']:,.2f}")

    print(f"\n[SAMPLE EMI SCHEDULE (First {len(plan['emi_schedule'])} Quarters)]")
    print("  Quarter | Opening Balance | EMI Payment | Interest | Principal | Closing Balance")
    print("  --------|-----------------|-------------|----------|-----------|----------------")
    for emi in plan["emi_schedule"]:
        print(f"  {emi['quarter']:>7} | Rs{emi['opening_balance']:>13,.0f} | Rs{emi['emi_payment']:>11,.0f} | Rs{emi['interest']:>8,.0f} | Rs{emi['principal']:>9,.0f} | Rs{emi['closing_balance']:>14,.0f}")

    # Show plots if requested
    if show_plots:
        try:
            from financial_calculator import FinancialCalculator
            import matplotlib.pyplot as plt

            calculator = FinancialCalculator()

            # Show scheme comparison
            fig1 = calculator.plot_scheme_comparison(plan['project_cost'])
            if fig1:
                fig1.suptitle('Loan Scheme Eligibility Analysis', fontsize=14, fontweight='bold')
                plt.show()

            # Show amortization chart
            fig2 = calculator.plot_loan_amortization(plan['emi_schedule'])
            if fig2:
                fig2.suptitle('Loan Amortization Schedule', fontsize=14, fontweight='bold')
                plt.show()

            # Show EMI breakdown
            fig3 = calculator.plot_emi_breakdown(plan['emi_schedule'])
            if fig3:
                fig3.suptitle('EMI Payment Breakdown: Interest vs Principal', fontsize=14, fontweight='bold')
                plt.show()

            # Show moratorium impact
            scheme_obj = plan["loan_scheme"]
            fig4 = calculator.plot_moratorium_impact(
                plan['loan_amount'],
                scheme_obj['interest_rate'],
                scheme_obj['tenure_years'],
                scheme_obj['moratorium_months']
            )
            if fig4:
                fig4.suptitle('Impact of Moratorium Period on Repayment', fontsize=14, fontweight='bold')
                plt.show()

        except ImportError:
            print("\n[Note: Install matplotlib for visualizations: pip install matplotlib]")
        except Exception as e:
            print(f"\n[Warning: Could not generate plots: {str(e)}]")


if __name__ == "__main__":
    main()