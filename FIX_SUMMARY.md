# Fix Summary: Financial Calculator Scheme Limits

## Issue Identified
In the original `financial_calculator.py`, the Term Loan Scheme had incorrect maximum limits:
- `max_loan_amount`: ₹45,000 (should be ₹45,00,000)
- `max_project_cost`: ₹5,00,000 (should be ₹50,00,000)

This caused a ValueError when users entered margin capital of ₹1,00,000 or higher, as the resulting project cost (margin × 10) would exceed the incorrect maximum limit of ₹5,00,000.

## Example of Failure
- User Input: Margin Capital = ₹1,00,000
- Calculated Project Cost: ₹1,00,000 × 10 = ₹10,00,000
- Incorrect Max Limit: ₹5,00,000
- Result: ValueError - "Project cost ₹10,00,000.00 exceeds maximum eligible amount of ₹5,00,000.00 for term loans"

## Fix Applied
Updated the Term Loan Scheme details in `financial_calculator.py`:

### Before (Incorrect):
```python
LoanScheme.TERM_LOAN: SchemeDetails(
    name="Term Loan Scheme",
    interest_rate=8.0,
    tenure_years=7,
    moratorium_months=6,
    max_loan_amount=45000,  # ❌ ₹45,000 (WRONG)
    min_project_cost=140000, # ₹1.40 lakh
    max_project_cost=500000  # ❌ ₹5,00,000 (WRONG)
)
```

### After (Correct):
```python
LoanScheme.TERM_LOAN: SchemeDetails(
    name="Term Loan Scheme",
    interest_rate=8.0,
    tenure_years=7,
    moratorium_months=6,
    max_loan_amount=4500000,  # ✅ ₹45,00,000 (FIXED)
    min_project_cost=140000,  # ₹1.40 lakh
    max_project_cost=5000000  # ✅ ₹50,00,000 (FIXED)
)
```

## Verification Results
After the fix, the same user input now works correctly:
- User Input: Margin Capital = ₹1,00,000
- Calculated Project Cost: ₹10,00,000
- Correct Max Limit: ₹50,00,000
- Result: Successfully selects Term Loan Scheme
- Loan Amount Eligible: ₹9,00,000 (90% of project cost)
- Interest Rate: 8.0% per annum
- Tenure: 7 years
- Moratorium Period: 6 months

## Impact
This fix ensures that:
1. Users with margin capital between ₹14,000 and ₹5,00,000 can now access the Term Loan Scheme
2. The application correctly handles the full range of project costs as specified in the government guidelines
3. Rural micro-entrepreneurs in Jharkhand (and elsewhere) can now get accurate financial planning for larger projects
4. The solution now properly reflects the actual government scheme limits:
   - Micro Finance Scheme: Projects up to ₹1.40 lakh
   - Term Loan Scheme: Projects from ₹1.40 lakh to ₹50.00 lakh

The fix was minimal and targeted, changing only the incorrect numerical values while preserving all other functionality.