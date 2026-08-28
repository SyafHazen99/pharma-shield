/**
 * Universal Healthcare Number & Decimal Normalizer Utility
 * RSIA Melinda Audit Standard - Prevents miscalculations caused by Indonesian comma (,) vs English dot (.) inputs
 */

/**
 * Normalizes any string or number input into a clean JavaScript Number.
 * Handles both Indonesian format "12.500,50" -> 12500.50 and standard formats.
 */
export function normalizeDecimal(value, defaultValue = 0) {
  if (value === null || value === undefined || value === '') return defaultValue;
  if (typeof value === 'number') return isNaN(value) ? defaultValue : value;

  let str = String(value).trim();

  // If format contains comma as decimal separator (e.g. "12.500,50" or "4.000,44")
  if (str.includes(',') && str.includes('.')) {
    // Remove thousands dots, replace decimal comma with dot
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (str.includes(',')) {
    // Single comma: replace with dot (e.g. "12500,50" -> "12500.50")
    str = str.replace(',', '.');
  }

  const num = parseFloat(str);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Normalizes stock unit count (integer, non-negative).
 */
export function normalizeStockUnits(value) {
  const num = normalizeDecimal(value, 0);
  return Math.max(0, Math.round(num));
}

/**
 * Normalizes currency amount to 2 decimal precision (e.g., Rp 12500.50).
 */
export function normalizeCurrency(value) {
  const num = normalizeDecimal(value, 0);
  return Math.max(0, Math.round(num * 100) / 100);
}

/**
 * Formats currency display into Indonesian Rupiah (e.g., "Rp 12.500").
 */
export function formatRupiah(amount) {
  const normalized = normalizeCurrency(amount);
  return `Rp ${normalized.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
