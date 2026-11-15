import { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'node:http';
import process from 'node:process';
import { google, sheets_v4 } from 'googleapis';
import { CHOP_CONFIG, CUSTOMER_CRAVINGS, FOOD_CATEGORIES } from '../src/config';
import { AreaOption, DeliveryPreference, StudentOption, WaitlistPayload, WaitlistType } from '../src/types';

const CUSTOMER_TAB = 'Customer Waitlist';
const VENDOR_TAB = 'Vendor Applications';
const CUSTOMER_HEADERS = [
  'Registration ID',
  'Submission date and time',
  'First name',
  'WhatsApp number',
  'Email',
  'Launch location',
  'Preferred food categories',
  'Contact consent',
  'Consent timestamp',
  'Registration status',
];
const VENDOR_HEADERS = [
  'Application ID',
  'Submission date and time',
  'Business name',
  'Contact person',
  'WhatsApp number',
  'Email',
  'Business category',
  'Other category',
  'Operating model',
  'Operating locations',
  'Business description',
  'Food categories',
  'Fulfilment options',
  'Social media link',
  'Additional comments',
  'Contact consent',
  'Application status',
  'Admin notes',
  'Review date',
];
const MAX_BODY_BYTES = 16_384;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;

export interface ValidatedSubmission extends WaitlistPayload {}

export interface SaveResult {
  id: string;
  duplicate: boolean;
}

export type SaveSubmission = (submission: ValidatedSubmission) => Promise<SaveResult>;

interface ApiRequest {
  method?: string;
  headers: IncomingHttpHeaders;
  body?: unknown;
  socket?: IncomingMessage['socket'];
  on?: IncomingMessage['on'];
}

interface ApiResponse {
  status(code: number): ApiResponse;
  json(payload: Record<string, unknown>): ApiResponse;
  setHeader?(name: string, value: string): void;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getClientIp(req: ApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return ip?.trim() || req.socket?.remoteAddress || 'unknown';
}

function enforceRateLimit(ip: string): boolean {
  const now = Date.now();
  for (const [key, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(key);
  }

  const entry = rateLimits.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    if (rateLimits.size > 5000) {
      const oldest = rateLimits.keys().next().value;
      if (oldest) rateLimits.delete(oldest);
    }
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  entry.count += 1;
  return true;
}

function readString(
  body: Record<string, unknown>,
  key: string,
  maxLength: number,
  required = false
): string {
  const value = body[key];
  if (typeof value !== 'string') {
    if (!required && (value === undefined || value === null)) return '';
    throw new Error(`Invalid ${key}.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength || (required && trimmed.length === 0)) {
    throw new Error(`Invalid ${key}.`);
  }
  return trimmed;
}

function readStringArray(
  value: unknown,
  allowed: readonly string[],
  maxItems: number
): string[] {
  if (!Array.isArray(value) || value.length > maxItems) throw new Error('Invalid selection.');
  const result = value.map((item) => {
    if (typeof item !== 'string' || !allowed.includes(item)) {
      throw new Error('Invalid selection.');
    }
    return item;
  });
  return [...new Set(result)];
}

export function validateSubmission(body: unknown): ValidatedSubmission {
  if (!isRecord(body)) throw new Error('Invalid submission.');
  if (body.website !== undefined && body.website !== '' && body.website !== null) {
    throw new Error('Invalid submission.');
  }

  const type = body.type;
  if (type !== WaitlistType.Customer && type !== WaitlistType.Vendor) {
    throw new Error('Invalid submission type.');
  }

  const fullName = readString(body, 'fullName', 120, true);
  if (fullName.length < 2) throw new Error('Invalid full name.');
  const whatsapp = readString(body, 'whatsapp', 24, true);
  const phoneDigits = whatsapp.replace(/\D/g, '');
  if (!/^[+0-9().\-\s]{8,24}$/.test(whatsapp) || phoneDigits.length < 8 || phoneDigits.length > 15) {
    throw new Error('Invalid WhatsApp number.');
  }

  const email = readString(body, 'email', 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email.');
  }

  const area = body.area;
  if (
    typeof area !== 'string' ||
    !CHOP_CONFIG.areaOptions.includes(area as (typeof CHOP_CONFIG.areaOptions)[number])
  ) {
    throw new Error('Invalid launch location.');
  }
  if (body.contactConsent !== true) throw new Error('Contact consent is required.');

  const student = readString(body, 'student', 64);
  if (
    type === WaitlistType.Customer &&
    student !== '' &&
    !(['Yes, at TASUED', 'Yes, somewhere else', 'No'] as string[]).includes(student)
  ) {
    throw new Error('Invalid student selection.');
  }

  const searches = readStringArray(body.searches, CUSTOMER_CRAVINGS, 9);
  const businessName = readString(body, 'businessName', 160, type === WaitlistType.Vendor);
  const category = readString(body, 'category', 100);
  if (
    type === WaitlistType.Vendor &&
    !FOOD_CATEGORIES.some((foodCategory) => foodCategory.label === category)
  ) {
    throw new Error('Invalid business category.');
  }

  const delivers = readString(body, 'delivers', 16);
  if (
    type === WaitlistType.Vendor &&
    !Object.values(DeliveryPreference).includes(delivers as DeliveryPreference)
  ) {
    throw new Error('Invalid delivery selection.');
  }

  const operatingModel = readString(body, 'operatingModel', 60);
  if (
    operatingModel &&
    !['Physical location', 'Online', 'Both'].includes(operatingModel)
  ) {
    throw new Error('Invalid operating model.');
  }
  const operatingLocations = readStringArray(body.operatingLocations, CHOP_CONFIG.areaOptions, 4);
  const foodCategories = readStringArray(
    body.foodCategories,
    type === WaitlistType.Customer
      ? CUSTOMER_CRAVINGS
      : FOOD_CATEGORIES.map((foodCategory) => foodCategory.label),
    10
  );
  const fulfilmentOptions = readStringArray(body.fulfilmentOptions, ['Pickup', 'Delivery'], 2);
  if (type === WaitlistType.Vendor) {
    if (!foodCategories.includes(category)) throw new Error('Invalid food categories.');
    const expectedFulfilment =
      delivers === DeliveryPreference.No
        ? ['Pickup']
        : delivers === DeliveryPreference.Sometimes
          ? ['Pickup', 'Delivery']
          : ['Delivery'];
    if (
      expectedFulfilment.length !== fulfilmentOptions.length ||
      expectedFulfilment.some((option) => !fulfilmentOptions.includes(option))
    ) {
      throw new Error('Invalid fulfilment options.');
    }
  }
  const socialMediaLink = readString(body, 'socialMediaLink', 500);
  if (socialMediaLink) {
    let url: URL;
    try {
      url = new URL(socialMediaLink);
    } catch {
      throw new Error('Invalid social media link.');
    }
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid social media link.');
  }

  return {
    type,
    fullName,
    whatsapp,
    email,
    area: area as AreaOption,
    contactConsent: true,
    student:
      type === WaitlistType.Customer
        ? (student as StudentOption | '')
        : '',
    searches: type === WaitlistType.Customer ? searches : [],
    businessName: type === WaitlistType.Vendor ? businessName : '',
    category: type === WaitlistType.Vendor ? category : '',
    delivers: type === WaitlistType.Vendor ? (delivers as DeliveryPreference) : '',
    address: type === WaitlistType.Vendor ? readString(body, 'address', 500) : '',
    operatingModel: type === WaitlistType.Vendor ? operatingModel : '',
    operatingLocations:
      type === WaitlistType.Vendor
        ? operatingLocations.length > 0
          ? operatingLocations
          : [area as AreaOption]
        : [],
    businessDescription:
      type === WaitlistType.Vendor ? readString(body, 'businessDescription', 2000) : '',
    otherCategory: type === WaitlistType.Vendor ? readString(body, 'otherCategory', 100) : '',
    foodCategories: type === WaitlistType.Vendor ? foodCategories : searches,
    fulfilmentOptions: type === WaitlistType.Vendor ? fulfilmentOptions : [],
    socialMediaLink: type === WaitlistType.Vendor ? socialMediaLink : '',
    additionalComments:
      type === WaitlistType.Vendor ? readString(body, 'additionalComments', 2000) : '',
    source: 'website',
    website: '',
  };
}

function escapeSheetText(value: string): string {
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return /^[\s]*[=+\-@]/.test(cleaned) ? `'${cleaned}` : cleaned;
}

export function createSheetRow(
  submission: ValidatedSubmission,
  id: string,
  timestamp: string
): string[] {
  const consentTimestamp = submission.contactConsent ? timestamp : '';
  if (submission.type === WaitlistType.Customer) {
    return [
      id,
      timestamp,
      escapeSheetText(submission.fullName.split(/\s+/)[0] ?? ''),
      submission.whatsapp,
      escapeSheetText(submission.email),
      escapeSheetText(submission.area),
      escapeSheetText(submission.searches.join(', ')),
      'Yes',
      consentTimestamp,
      'Registered',
    ];
  }

  return [
    id,
    timestamp,
    escapeSheetText(submission.businessName),
    escapeSheetText(submission.fullName),
    submission.whatsapp,
    escapeSheetText(submission.email),
    escapeSheetText(submission.category),
    escapeSheetText(submission.otherCategory),
    escapeSheetText(submission.operatingModel),
    escapeSheetText(submission.operatingLocations.join(', ')),
    escapeSheetText(submission.businessDescription),
    escapeSheetText(submission.foodCategories.join(', ')),
    escapeSheetText(submission.fulfilmentOptions.join(', ')),
    escapeSheetText(submission.socialMediaLink),
    escapeSheetText(submission.additionalComments),
    'Yes',
    'Pending review',
    '',
    '',
  ];
}

function getSpreadsheetId(): string {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID?.trim();
  if (!spreadsheetId) throw new Error('Google Sheets is not configured.');
  return spreadsheetId;
}

function createSheetsClient(): sheets_v4.Sheets {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentialsJson) throw new Error('Google Sheets is not configured.');

  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(credentialsJson) as Record<string, unknown>;
  } catch {
    throw new Error('Google Sheets credentials are invalid.');
  }

  if (
    typeof credentials.client_email !== 'string' ||
    typeof credentials.private_key !== 'string'
  ) {
    throw new Error('Google Sheets credentials are invalid.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function ensureSheetHeaders(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  title: string,
  headers: string[]
): Promise<void> {
  let metadata = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties.title',
  });
  const titles = new Set(metadata.data.sheets?.map((sheet) => sheet.properties?.title) ?? []);

  if (!titles.has(title)) {
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title } } }],
        },
      });
    } catch (error) {
      metadata = await sheets.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets.properties.title',
      });
      if (!metadata.data.sheets?.some((sheet) => sheet.properties?.title === title)) {
        throw error;
      }
    }
  }

  const currentHeaders = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${title}'!A1:${String.fromCharCode(64 + headers.length)}1`,
  });
  const values = currentHeaders.data.values?.[0] ?? [];
  if (values.length === 0 || values.every((value) => value === '')) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${title}'!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });
    return;
  }

  if (headers.some((header, index) => values[index] !== header)) {
    throw new Error(`The "${title}" sheet headers do not match the required columns.`);
  }
}

function phoneDuplicateKey(value: unknown): string {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length === 13) return digits.slice(3);
  if (digits.startsWith('0') && digits.length === 11) return digits.slice(1);
  return digits;
}

async function appendToGoogleSheet(submission: ValidatedSubmission): Promise<SaveResult> {
  const spreadsheetId = getSpreadsheetId();
  const sheets = createSheetsClient();
  await ensureSheetHeaders(sheets, spreadsheetId, CUSTOMER_TAB, CUSTOMER_HEADERS);
  await ensureSheetHeaders(sheets, spreadsheetId, VENDOR_TAB, VENDOR_HEADERS);

  const customer = submission.type === WaitlistType.Customer;
  const tab = customer ? CUSTOMER_TAB : VENDOR_TAB;
  const headers = customer ? CUSTOMER_HEADERS : VENDOR_HEADERS;
  const phoneColumn = customer ? 'D' : 'E';
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${tab}'!${phoneColumn}2:${phoneColumn}`,
  });
  const phoneKey = phoneDuplicateKey(submission.whatsapp);
  const duplicate = (existing.data.values ?? []).some(
    (row) => phoneDuplicateKey(row[0]) === phoneKey
  );
  if (duplicate) {
    return { id: '', duplicate: true };
  }

  const id = `${customer ? 'CHOP-C' : 'CHOP-V'}-${randomUUID()}`;
  const timestamp = new Date().toISOString();
  const row = createSheetRow(submission, id, timestamp);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${tab}'!A:${String.fromCharCode(64 + headers.length)}`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });

  return { id, duplicate: false };
}

async function getRequestBody(req: ApiRequest): Promise<unknown> {
  if (req.body !== undefined) return req.body;
  if (!req.on) return undefined;

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on?.('data', (chunk: Buffer | string) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body is too large.'));
        return;
      }
      chunks.push(buffer);
    });
    req.on?.('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
    req.on?.('error', reject);
  });
}

export async function handleWaitlistRequest(
  req: ApiRequest,
  res: ApiResponse,
  saveSubmission: SaveSubmission = appendToGoogleSheet
): Promise<void> {
  res.setHeader?.('Cache-Control', 'no-store');
  res.setHeader?.('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader?.('Allow', 'POST');
    res.status(405).json({ success: false, message: 'Use POST to submit the waitlist form.' });
    return;
  }

  if (!enforceRateLimit(getClientIp(req))) {
    res.status(429).json({
      success: false,
      message: 'Too many attempts. Please wait a few minutes and try again.',
    });
    return;
  }

  try {
    const body = await getRequestBody(req);
    if (Buffer.byteLength(JSON.stringify(body ?? null), 'utf8') > MAX_BODY_BYTES) {
      res.status(413).json({ success: false, message: 'Submission is too large.' });
      return;
    }
    const submission = validateSubmission(body);
    const result = await saveSubmission(submission);
    res.status(200).json({ success: true, id: result.id, duplicate: result.duplicate });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Waitlist submission failed.';
    const isValidationError =
      message.startsWith('Invalid ') || message === 'Contact consent is required.';
    const status = isValidationError ? 400 : message === 'Request body is too large.' ? 413 : 503;

    if (status === 503) {
      console.error('[waitlist] Unable to save submission to Google Sheets.', message);
    }
    res.status(status).json({
      success: false,
      message:
        status === 400
          ? 'Please review your details and contact consent, then try again.'
          : status === 413
            ? 'Submission is too large.'
            : 'Waitlist registration is temporarily unavailable. Please try again shortly.',
    });
  }
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse & ApiResponse
): Promise<void> {
  await handleWaitlistRequest(req, res);
}
