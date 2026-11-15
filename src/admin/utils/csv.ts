import type { Subscriber } from '../types';

const COLUMNS: Array<[string, (subscriber: Subscriber) => string]> = [
  ['ID', (s) => s.id],
  ['Type', (s) => s.type],
  ['Name', (s) => s.name],
  ['Business', (s) => s.businessName],
  ['Email', (s) => s.email],
  ['WhatsApp', (s) => s.whatsapp],
  ['Area', (s) => s.area],
  ['Interests', (s) => s.interests.join(', ')],
  ['Status', (s) => s.status],
  ['Subscribed', (s) => (s.subscribed ? 'Yes' : 'No')],
  ['Joined', (s) => s.joinedAt],
];

function escapeCsv(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(subscribers: Subscriber[]): string {
  const header = COLUMNS.map(([label]) => label).join(',');
  const rows = subscribers.map((subscriber) => COLUMNS.map(([, read]) => escapeCsv(read(subscriber))).join(','));
  return [header, ...rows].join('\r\n');
}

export function downloadCsv(subscribers: Subscriber[], filename: string): void {
  const blob = new Blob([`﻿${toCsv(subscribers)}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
