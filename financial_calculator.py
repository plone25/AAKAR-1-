"""
Smart Financial Calculator & Scheme Router Module

This module handles financial calculations including loan eligibility,
EMI calculations, and scheme selection based on government guidelines.
"""

from dataclasses import dataclass
from typing import List, Dict, Optional
from enum import Enum


class LoanScheme(Enum):
    MICRO_FINANCE = "Micro Finance Scheme"
    TERM_LOAN = "Term Loan Scheme"


@dataclass
class SchemeDetails:
    """Data class to hold loan scheme details"""
    name: str
    interest_rate: float  # Annual interest rate in percentage
    tenure_years: int     # Repayment tenure in years
    moratorium_months: int # Moratorium period in months
    max_loan_amount: float # Maximum loan amount eligible under this scheme
    min_project_cost: float # Minimum project cost for this scheme
    max_project_cost: float # Maximum project cost for this scheme


class FinancialCalculator:
    """Handles financial calculations and scheme routing"""

    def __init__(self):
        # Initialize scheme details based on government guidelines
        self.schemes = {
            LoanScheme.MICRO_FINANCE: SchemeDetails(
                name="Micro Finance Scheme",
                interest_rate=6.5,
                tenure_years=3,
                moratorium_months=3,
                max_loan_amount=125000,  # ₹1.25 lakh
                min_project_cost=0,
                max_project_cost=140000  # ₹1.40 lakh
            ),
            LoanScheme.TERM_LOAN: SchemeDetails(
                name="Term Loan Scheme",
                interest_rate=8.0,
                tenure_years=7,
                moratorium_months=6,
                max_loan_amount=4500000,  # ₹45 lakh
                min_project_cost=140000,  # ₹1.40 lakh
                max_project_cost=5000000  # ₹50.00 lakh
            )
        }

    def determine_loan_scheme(self, project_cost: float) -> SchemeDetails:
        """
        Automatically selects the appropriate loan scheme based on project cost

        Args:
            project_cost: Total project cost in INR

        Returns:
            SchemeDetails object for the appropriate scheme

        Raises:
            ValueError: If project cost is outside eligible range
        """
        if project_cost < 0:
            raise ValueError("Project cost cannot be negative")

        # Check Micro Finance Scheme eligibility
        micro_scheme = self.schemes[LoanScheme.MICRO_FINANCE]
        if micro_scheme.min_project_cost <= project_cost <= micro_scheme.max_project_cost:
            return micro_scheme

        # Check Term Loan Scheme eligibility
        term_scheme = self.schemes[LoanScheme.TERM_LOAN]
        if term_scheme.min_project_cost <= project_cost <= term_scheme.max_project_cost:
            return term_scheme

        # If outside both ranges
        if project_cost < micro_scheme.min_project_cost:
            raise ValueError(
                f"Project cost ₹{project_cost:,.2f} is below minimum eligible amount "
                f"of ₹{micro_scheme.min_project_cost:,.2f} for any scheme"
            )
        else:
            raise ValueError(
                f"Project cost ₹{project_cost:,.2f} exceeds maximum eligible amount "
                f"of ₹{term_scheme.max_project_cost:,.2f} for term loans"
            )

    def calculate_emi_schedule(self, loan_amount: float, interest_rate: float,
                             tenure_years: int, moratorium_months: int) -> List[Dict]:
        """
        Calculate EMI schedule with moratorium period

        Args:
            loan_amount: Loan amount in INR
            interest_rate: Annual interest rate in percentage
            tenure_years: Loan tenure in years
            moratorium_months: Moratorium period in months

        Returns:
            List of dictionaries containing quarterly EMI details
        """
        if loan_amount <= 0:
            return []

        # Convert annual interest rate to monthly and quarterly
        monthly_rate = interest_rate / 100 / 12
        quarterly_rate = (1 + monthly_rate) ** 3 - 1  # Effective quarterly rate

        # Total number of quarters (excluding moratorium)
        total_months = tenure_years * 12
        repayment_months = total_months - moratorium_months
        total_quarters = repayment_months // 3

        if total_quarters <= 0:
            # Handle edge case where repayment period is less than a quarter
            total_quarters = 1

        # Calculate quarterly EMI using formula for uneven cash flows
        # During moratorium: interest accrues but no principal payment
        # After moratorium: regular EMI payments

        # Calculate amount due after moratorium (compound interest)
        amount_after_moratorium = loan_amount * (1 + monthly_rate) ** moratorium_months

        # Calculate quarterly EMI for repayment period
        if quarterly_rate > 0:
            quarterly_emi = amount_after_moratorium * (
                quarterly_rate * (1 + quarterly_rate) ** total_quarters
            ) / ((1 + quarterly_rate) ** total_quarters - 1)
        else:
            # Zero interest rate case
            quarterly_emi = amount_after_moratorium / total_quarters

        # Generate schedule
        schedule = []
        opening_balance = amount_after_moratorium

        for quarter in range(1, total_quarters + 1):
            interest_payment = opening_balance * quarterly_rate
            principal_payment = quarterly_emi - interest_payment
            closing_balance = opening_balance - principal_payment

            # Ensure we don't go negative due to rounding
            if closing_balance < 0:
                principal_payment = opening_balance
                interest_payment = quarterly_emi - principal_payment
                closing_balance = 0

            schedule.append({
                "quarter": quarter,
                "opening_balance": round(opening_balance, 2),
                "emi_payment": round(quarterly_emi, 2),
                "interest": round(interest_payment, 2),
                "principal": round(principal_payment, 2),
                "closing_balance": round(max(closing_balance, 0), 2)
            })

            opening_balance = closing_balance

        return schedule

    def calculate_total_financials(self, loan_amount: float, interest_rate: float,
                                 tenure_years: int, moratorium_months: int) -> Dict[str, float]:
        """
        Calculate total interest and repayment amounts

        Args:
            loan_amount: Loan amount in INR
            interest_rate: Annual interest rate in percentage
            tenure_years: Loan tenure in years
            moratorium_months: Moratorium period in months

        Returns:
            Dictionary with total interest and total repayment
        """
        if loan_amount <= 0:
            return {"total_interest": 0.0, "total_repayment": 0.0}

        emi_schedule = self.calculate_emi_schedule(
            loan_amount, interest_rate, tenure_years, moratorium_months
        )

        total_interest = sum(payment["interest"] for payment in emi_schedule)
        total_repayment = loan_amount + total_interest

        return {
            "total_interest": round(total_interest, 2),
            "total_repayment": round(total_repayment, 2)
        }

    def get_scheme_info(self, scheme: LoanScheme) -> SchemeDetails:
        """
        Get details for a specific loan scheme

        Args:
            scheme: LoanScheme enum value

        Returns:
            SchemeDetails object
        """
        return self.schemes[scheme]

    def is_project_eligible(self, project_cost: float) -> bool:
        """
        Check if a project cost is eligible for any loan scheme

        Args:
            project_cost: Total project cost in INR

        Returns:
            True if eligible, False otherwise
        """
        micro_scheme = self.schemes[LoanScheme.MICRO_FINANCE]
        term_scheme = self.schemes[LoanScheme.TERM_LOAN]

        return (
            (micro_scheme.min_project_cost <= project_cost <= micro_scheme.max_project_cost) or
            (term_scheme.min_project_cost <= project_cost <= term_scheme.max_project_cost)
        )

    def get_eligible_schemes(self, project_cost: float) -> List[LoanScheme]:
        """
        Get list of eligible schemes for a given project cost

        Args:
            project_cost: Total project cost in INR

        Returns:
            List of eligible LoanScheme enum values
        """
        eligible = []

        micro_scheme = self.schemes[LoanScheme.MICRO_FINANCE]
        term_scheme = self.schemes[LoanScheme.TERM_LOAN]

        if micro_scheme.min_project_cost <= project_cost <= micro_scheme.max_project_cost:
            eligible.append(LoanScheme.MICRO_FINANCE)

        if term_scheme.min_project_cost <= project_cost <= term_scheme.max_project_cost:
            eligible.append(LoanScheme.TERM_LOAN)

        return eligible

    def plot_loan_amortization(self, emi_schedule: List[Dict]) -> Optional[object]:
        """
        Create a line chart showing loan amortization over time

        Args:
            emi_schedule: List of EMI schedule dictionaries

        Returns:
            matplotlib figure object or None if matplotlib not available
        """
        try:
            import matplotlib.pyplot as plt

            quarters = [emi['quarter'] for emi in emi_schedule]
            opening_balances = [emi['opening_balance'] for emi in emi_schedule]
            closing_balances = [emi['closing_balance'] for emi in emi_schedule]

            fig, ax = plt.subplots(figsize=(10, 6))

            ax.plot(quarters, opening_balances, label='Opening Balance', marker='o', linewidth=2)
            ax.plot(quarters, closing_balances, label='Closing Balance', marker='s', linewidth=2)

            ax.set_xlabel('Quarter')
            ax.set_ylabel('Amount (₹)')
            ax.set_title('Loan Amortization: Opening vs Closing Balance', pad=30)
            ax.legend()
            ax.grid(True, alpha=0.3)
            ax.ticklabel_format(style='plain', axis='y')

            plt.tight_layout()
            return fig
        except ImportError:
            return None

    def plot_emi_breakdown(self, emi_schedule: List[Dict]) -> Optional[object]:
        """
        Create a stacked bar chart showing EMI breakdown (Interest vs Principal)

        Args:
            emi_schedule: List of EMI schedule dictionaries

        Returns:
            matplotlib figure object or None if matplotlib not available
        """
        try:
            import matplotlib.pyplot as plt
            import numpy as np

            quarters = [emi['quarter'] for emi in emi_schedule]
            interest_payments = [emi['interest'] for emi in emi_schedule]
            principal_payments = [emi['principal'] for emi in emi_schedule]

            fig, ax = plt.subplots(figsize=(10, 6))

            width = 0.6
            p1 = ax.bar(quarters, interest_payments, width, label='Interest', color='lightcoral')
            p2 = ax.bar(quarters, principal_payments, width, bottom=interest_payments,
                       label='Principal', color='lightblue')

            ax.set_xlabel('Quarter')
            ax.set_ylabel('Amount (₹)')
            ax.set_title('EMI Breakdown: Interest vs Principal Payment', pad=30)
            ax.legend()
            ax.grid(True, alpha=0.3, axis='y')
            ax.ticklabel_format(style='plain', axis='y')

            plt.tight_layout()
            return fig
        except ImportError:
            return None

    def plot_scheme_comparison(self, project_cost: float) -> Optional[object]:
        """
        Create a comparison chart showing eligibility for different loan schemes

        Args:
            project_cost: Total project cost in INR

        Returns:
            matplotlib figure object or None if matplotlib not available
        """
        try:
            import matplotlib.pyplot as plt
            import numpy as np

            micro_scheme = self.schemes[LoanScheme.MICRO_FINANCE]
            term_scheme = self.schemes[LoanScheme.TERM_LOAN]

            # Determine eligibility
            micro_eligible = micro_scheme.min_project_cost <= project_cost <= micro_scheme.max_project_cost
            term_eligible = term_scheme.min_project_cost <= project_cost <= term_scheme.max_project_cost

            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

            # Plot 1: Scheme eligibility
            schemes = ['Micro Finance', 'Term Loan']
            eligible = [micro_eligible, term_eligible]
            colors = ['green' if e else 'red' for e in eligible]

            bars1 = ax1.bar(schemes, [1 if e else 0 for e in eligible], color=colors, alpha=0.7)
            ax1.set_ylabel('Eligible (1=Yes, 0=No)')
            ax1.set_title('Loan Scheme Eligibility', pad=30)
            ax1.set_ylim(0, 1.5)

            # Add text labels
            for i, (scheme, is_eligible) in enumerate(zip(schemes, eligible)):
                status = "ELIGIBLE" if is_eligible else "NOT ELIGIBLE"
                ax1.text(i, 0.5, status, ha='center', va='center',
                        fontweight='bold', color='white')

            # Plot 2: Scheme limits comparison
            limits = ['Min Project Cost', 'Max Project Cost']
            micro_limits = [micro_scheme.min_project_cost, micro_scheme.max_project_cost]
            term_limits = [term_scheme.min_project_cost, term_scheme.max_project_cost]

            x = np.arange(len(limits))
            width = 0.35

            bars2 = ax2.bar(x - width/2, micro_limits, width, label='Micro Finance',
                           color='skyblue', alpha=0.8)
            bars3 = ax2.bar(x + width/2, term_limits, width, label='Term Loan',
                           color='lightcoral', alpha=0.8)

            # Add project cost line
            ax2.axhline(y=project_cost, color='green', linestyle='--', linewidth=2,
                       label=f'Project Cost: ₹{project_cost:,.0f}')

            ax2.set_xlabel('Limit Type')
            ax2.set_ylabel('Amount (₹)')
            ax2.set_title('Loan Scheme Limits vs Project Cost', pad=30)
            ax2.set_xticks(x)
            ax2.set_xticklabels(limits)
            ax2.legend()
            ax2.ticklabel_format(style='plain', axis='y')

            plt.tight_layout()
            return fig
        except ImportError:
            return None

    def plot_moratorium_impact(self, loan_amount: float, interest_rate: float,
                             tenure_years: int, moratorium_months: int) -> Optional[object]:
        """
        Create a chart showing the impact of moratorium period on total repayment

        Args:
            loan_amount: Loan amount in INR
            interest_rate: Annual interest rate in percentage
            tenure_years: Loan tenure in years
            moratorium_months: Moratorium period in months

        Returns:
            matplotlib figure object or None if matplotlib not available
        """
        try:
            import matplotlib.pyplot as plt
            import numpy as np

            # Calculate with moratorium
            monthly_rate = interest_rate / 100 / 12
            amount_after_moratorium = loan_amount * (1 + monthly_rate) ** moratorium_months

            # Calculate quarterly EMI for repayment period (with moratorium)
            quarters_with_moratorium = (tenure_years * 12 - moratorium_months) // 3
            if quarters_with_moratorium > 0:
                quarterly_rate = (1 + monthly_rate) ** 3 - 1
                quarterly_emi_with_mor = amount_after_moratorium * (
                    quarterly_rate * (1 + quarterly_rate) ** quarters_with_moratorium
                ) / ((1 + quarterly_rate) ** quarters_with_moratorium - 1)
                total_repayment_with_mor = quarterly_emi_with_mor * quarters_with_moratorium * 3
                total_interest_with_mor = total_repayment_with_mor - loan_amount
            else:
                total_repayment_with_mor = loan_amount
                total_interest_with_mor = 0

            # Calculate without moratorium (for comparison)
            quarters_without_moratorium = tenure_years * 12 // 3  # quarters in tenure years
            if quarters_without_moratorium > 0:
                quarterly_rate = (1 + monthly_rate) ** 3 - 1
                quarterly_emi_without_mor = loan_amount * (
                    quarterly_rate * (1 + quarterly_rate) ** quarters_without_moratorium
                ) / ((1 + quarterly_rate) ** quarters_without_moratorium - 1)
                total_repayment_without_mor = quarterly_emi_without_mor * quarters_without_moratorium * 3
                total_interest_without_mor = total_repayment_without_mor - loan_amount
            else:
                total_repayment_without_mor = loan_amount
                total_interest_without_mor = 0

            # Create comparison chart
            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

            # Plot 1: Total repayment comparison
            scenarios = ['With Moratorium', 'Without Moratorium']
            total_repayments = [total_repayment_with_mor, total_repayment_without_mor]
            colors = ['lightcoral', 'lightblue']

            bars1 = ax1.bar(scenarios, [r/100000 for r in total_repayments],
                           color=colors, alpha=0.8, edgecolor='black')
            ax1.set_ylabel('Total Repayment (₹ in lakhs)')
            ax1.set_title('Total Repayment: Impact of Moratorium', pad=30)
            ax1.bar_label(bars1, fmt='₹%.1f L')

            # Plot 2: Interest component comparison
            total_interests = [total_interest_with_mor, total_interest_without_mor]

            bars2 = ax2.bar(scenarios, [i/100000 for i in total_interests],
                           color=colors, alpha=0.8, edgecolor='black')
            ax2.set_ylabel('Total Interest (₹ in lakhs)')
            ax2.set_title('Total Interest: Impact of Moratorium', pad=30)
            ax2.bar_label(bars2, fmt='₹%.1f L')

            plt.tight_layout()
            return fig
        except ImportError:
            return None