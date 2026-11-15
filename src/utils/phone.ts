export const COUNTRY_CODES = [
  { code: '+234', label: 'NG (+234)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+1', label: 'US (+1)' },
  { code: '+233', label: 'GH (+233)' },
] as const;

/**
 * Normalizes Nigerian and international phone inputs into E.164 format.
 * Handles 080..., 081..., 070..., 090..., 091..., 80..., 234..., and +234...
 */
export function normalizeWhatsAppNumber(rawInput: string, countryCode: string): string {
  const cleaned = rawInput.replace(/[\s\-().]/g, '').trim();
  if (!cleaned) return '';

  if (countryCode === '+234') {
    let digits = cleaned.replace(/^\+/, '');
    if (digits.startsWith('234') && digits.length >= 13) {
      digits = digits.slice(3);
    }
    if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    return `+234${digits}`;
  }

  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  const digitsOnly = cleaned.replace(/^0+/, '');
  return `${countryCode}${digitsOnly}`;
}

/**
 * Validates Nigerian mobile prefixes (070, 080, 081, 090, 091, etc.) or general international lengths.
 */
export function validateWhatsAppNumber(rawInput: string, countryCode: string): string | null {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return 'Add your WhatsApp number so we can reach you.';
  }

  const normalized = normalizeWhatsAppNumber(trimmed, countryCode);

  if (countryCode === '+234') {
    const localDigits = normalized.replace('+234', '');
    if (!/^\d{10}$/.test(localDigits)) {
      return 'Enter a valid 10 or 11-digit Nigerian WhatsApp number.';
    }
    if (!/^[789][01]\d{8}$/.test(localDigits)) {
      return 'Check the prefix — Nigerian numbers usually start with 080, 081, 070, 090 or 091.';
    }
    return null;
  }

  if (!/^\+\d{8,15}$/.test(normalized)) {
    return 'Enter a valid WhatsApp number.';
  }

  return null;
}
