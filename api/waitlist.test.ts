import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createSheetRow,
  handleWaitlistRequest,
  validateSubmission,
  type SaveSubmission,
  type ValidatedSubmission,
} from './waitlist';

const customerBody = {
  type: 'customer',
  fullName: 'Ada Customer',
  whatsapp: '08012345678',
  email: 'ada@example.com',
  area: 'Ijebu Ode',
  contactConsent: true,
  student: 'Yes, at TASUED',
  searches: ['Breakfast', 'Dinner'],
  businessName: '',
  category: '',
  delivers: '',
  address: '',
  operatingModel: '',
  operatingLocations: [],
  businessDescription: '',
  otherCategory: '',
  foodCategories: ['Breakfast', 'Dinner'],
  fulfilmentOptions: [],
  socialMediaLink: '',
  additionalComments: '',
  source: 'website',
  website: '',
};

const vendorBody = {
  type: 'vendor',
  fullName: 'Bola Vendor',
  whatsapp: '+2348012345678',
  email: '',
  area: 'Ijagun (TASUED)',
  contactConsent: true,
  student: '',
  searches: [],
  businessName: 'Bola Kitchen',
  category: 'Local Bukas',
  delivers: 'Sometimes',
  address: 'Market Road',
  operatingModel: 'Both',
  operatingLocations: ['Ijagun (TASUED)'],
  businessDescription: 'Home-cooked meals.',
  otherCategory: '',
  foodCategories: ['Local Bukas'],
  fulfilmentOptions: ['Pickup', 'Delivery'],
  socialMediaLink: 'https://example.com/bola',
  additionalComments: 'Call in the afternoon.',
  source: 'website',
  website: '',
};

function responseMock() {
  const response = {
    code: 0,
    body: {} as Record<string, unknown>,
    headers: {} as Record<string, string>,
    status(code: number) {
      response.code = code;
      return response;
    },
    json(payload: Record<string, unknown>) {
      response.body = payload;
      return response;
    },
    setHeader(name: string, value: string) {
      response.headers[name] = value;
    },
  };
  return response;
}

function requestMock(body: unknown, ip: string) {
  return {
    method: 'POST',
    headers: { 'x-forwarded-for': ip },
    body,
  };
}

test('customer registrations validate and map to the customer sheet columns', () => {
  const submission = validateSubmission(customerBody);
  const row = createSheetRow(submission, 'CHOP-C-test-id', '2026-11-14T12:00:00.000Z');

  assert.equal(submission.type, 'customer');
  assert.equal(submission.student, 'Yes, at TASUED');
  assert.equal(row.length, 10);
  assert.equal(row[2], 'Ada');
  assert.equal(row[3], '08012345678');
  assert.equal(row[6], 'Breakfast, Dinner');
  assert.equal(row[7], 'Yes');
  assert.equal(row[8], '2026-11-14T12:00:00.000Z');
  assert.equal(row[9], 'Registered');
});

test('vendor applications validate and map to the vendor sheet columns', () => {
  const submission = validateSubmission(vendorBody);
  const row = createSheetRow(submission, 'CHOP-V-test-id', '2026-11-14T12:00:00.000Z');

  assert.equal(submission.type, 'vendor');
  assert.equal(row.length, 19);
  assert.equal(row[2], 'Bola Kitchen');
  assert.equal(row[3], 'Bola Vendor');
  assert.equal(row[8], 'Both');
  assert.equal(row[9], 'Ijagun (TASUED)');
  assert.equal(row[10], 'Home-cooked meals.');
  assert.equal(row[12], 'Pickup, Delivery');
  assert.equal(row[15], 'Yes');
  assert.equal(row[16], 'Pending review');
  assert.equal(row[17], '');
  assert.equal(row[18], '');
});

test('the API only reports success after the save handler succeeds', async () => {
  const saved: ValidatedSubmission[] = [];
  const save: SaveSubmission = async (submission) => {
    saved.push(submission);
    return { id: 'CHOP-C-test-id', duplicate: false };
  };
  const customerResponse = responseMock();
  await handleWaitlistRequest(requestMock(customerBody, '192.0.2.10'), customerResponse, save);

  assert.equal(customerResponse.code, 200);
  assert.equal(customerResponse.body.success, true);
  assert.equal(saved[0]?.type, 'customer');

  const vendorResponse = responseMock();
  await handleWaitlistRequest(requestMock(vendorBody, '192.0.2.11'), vendorResponse, save);
  assert.equal(vendorResponse.code, 200);
  assert.equal(saved[1]?.type, 'vendor');
});

test('the API rejects missing consent and formula-like text is escaped', async () => {
  const noConsent = { ...customerBody, contactConsent: false };
  const response = responseMock();
  let saveCalled = false;
  const save: SaveSubmission = async () => {
    saveCalled = true;
    return { id: 'unused', duplicate: false };
  };
  await handleWaitlistRequest(requestMock(noConsent, '192.0.2.12'), response, save);

  assert.equal(response.code, 400);
  assert.equal(saveCalled, false);

  const malicious = validateSubmission({ ...customerBody, fullName: '=IMPORTXML("x")' });
  const row = createSheetRow(malicious, 'CHOP-C-test-id', '2026-11-14T12:00:00.000Z');
  assert.equal(row[2], "'=IMPORTXML(\"x\")");
  assert.equal(row[3], '08012345678');
});
