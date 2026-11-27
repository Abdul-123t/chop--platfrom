export function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234')) return digits;
  if (digits.startsWith('0') && digits.length === 11) return `234${digits.slice(1)}`;
  if (digits.length === 10) return `234${digits}`;
  return digits;
}

export function whatsappLink(phone: string, message?: string): string {
  const base = `https://wa.me/${whatsappNumber(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
