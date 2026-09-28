/**
 * Indian Number and Currency Formatting Utilities
 */

export function formatIndianCurrency(amount: number | null | undefined, includeDecimal = false): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formatted = '';
  if (includeDecimal) {
    formatted = absAmount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  } else {
    formatted = Math.round(absAmount).toLocaleString('en-IN');
  }

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatIndianNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return Math.round(num).toLocaleString('en-IN');
}

export function formatCompactCurrency(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (abs >= 10000000) {
    return `${isNegative ? '-' : ''}₹${(abs / 10000000).toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    return `${isNegative ? '-' : ''}₹${(abs / 100000).toFixed(2)} Lakh`;
  } else if (abs >= 1000) {
    return `${isNegative ? '-' : ''}₹${(abs / 1000).toFixed(1)}k`;
  }
  return formatIndianCurrency(amount);
}

export function formatPercent(value: number): string {
  if (isNaN(value)) return '0%';
  // If value is a decimal <= 1 (like 0.1 for 10%), multiply by 100
  const pct = value <= 1 && value > 0 ? value * 100 : value;
  return `${pct.toFixed(1)}%`;
}
