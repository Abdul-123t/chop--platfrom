# CHOP — ENGINEERING TEST & VERIFICATION REPORT
**Audit Date:** November 21, 2026  
**Application Target:** CHOP (Ijebu Ode & Ijagun, Ogun State, Nigeria)  
**Test Environment:** Node.js v22.13.5 / macOS / Vite 6.2.0 / React 19  

---

## 1. Automated Build & Compilation Verification

### A. TypeScript Type Check
```bash
npx tsc -b
```
- **Exit Code:** `0` (Success)
- **Errors Reported:** `0`
- **Warnings Reported:** `0`
- **Result:** Strict type safety verified across all domain models in `src/types/index.ts`, state hooks in `src/lib/store.tsx`, and all UI components.

### B. Vite Production Bundle
```bash
npx vite build
```
- **Exit Code:** `0` (Success)
- **Modules Transformed:** 2,161 modules
- **Build Duration:** 14.59s – 19.64s
- **Output Artifacts:**
  - `dist/index.html`: `1.41 kB` (gzip: `0.74 kB`)
  - `dist/assets/index.css`: `57.38 kB` (gzip: `10.24 kB`)
  - `dist/assets/index.js`: `484.87 kB` (gzip: `122.31 kB`)
- **Status:** PASS

---

## 2. Interactive Feature Verification Table

The following verification represents actual interactive testing across the component flows:

| Flow / Feature | Test Description | Expected Behavior | Actual Outcome | Status |
|---|---|---|---|---|
| **27-Second Signature Intro** | Page first load without `sessionStorage` flag | Plays 27s SVG stroke sequence through 8 phases | Plays smoothly; center line $\rightarrow$ bowl $\rightarrow$ steam $\rightarrow$ food sketches $\rightarrow$ wordmark $\rightarrow$ tagline $\rightarrow$ homepage reveal | **Complete & Verified** |
| **Intro Skip Button** | Click "Skip" during animation | Immediately dismisses overlay with 700ms fade | Smoothly reveals homepage; sets `chop_intro_seen_v1` in `sessionStorage` | **Complete & Verified** |
| **Intro Reduced Motion** | Browser prefers-reduced-motion active | Bypasses 27s sequence | Displays 1.5s accessible greeting before revealing homepage | **Complete & Verified** |
| **Intro Replayability** | Click "Replay Intro" in dev controls or footer | Clears session flag and restarts animation | Restarts 27-second sequence from 00:00 without page reload | **Complete & Verified** |
| **Hub Switching** | Switch between "Ijebu Ode" and "Ijagun" in Hero | Updates active hub & filters | Updates `selectedLocation` in store & `localStorage`; delivery fees adjust (₦600 vs ₦450) | **Complete & Verified** |
| **Food Category Filter** | Click any of the 11 categories | Filters active kitchens or displays honest empty state | Correctly displays *"Something delicious is waiting to be discovered"* with *"Become a CHOP Vendor"* CTA | **Complete & Verified** |
| **Editorial Food Stories** | View and interact with stories | Educational storytelling; no cart addition | Displays 4 authentic stories with photography; clicking action scrolls to `#food-categories` | **Complete & Verified** |
| **Vendor Application Submission** | Fill form on `/for-vendors` | Validates inputs, generates ref number, saves to store | Generates `CHP-APP-XXXXXX` reference number; displays success card; saves to `localStorage` | **Complete (Local Storage)** |
| **Vendor Application Status Query** | Search status by `CHP-APP-XXXXXX` | Returns current application state | Displays business name, hub, and status badge (*pending*, *approved*, etc.) | **Complete (Local Storage)** |
| **Admin Vendor Approval Flow** | Admin approves application | Creates approved vendor with `isActivated: false` | Application status changes to `approved`; vendor profile created; logged in audit trail | **Complete (Local Storage)** |
| **Vendor Storefront Activation** | Vendor adds dish $\ge 1$ and clicks "Go Live" | Storefront becomes active | `isActivated` switches to `true`; vendor now appears in customer marketplace | **Complete (Local Storage)** |
| **Customer Order Placement** | Add item to cart and checkout | Deducts stock, creates order, clears cart, opens tracker | Order placed with unique `CHP-XXXXXX` number; active order tracking opens | **Simulated Payment** |
| **Order Status Progression** | Vendor advances order in Kitchen Workspace | Customer order tracker updates | Order advances through *Accepted* $\rightarrow$ *Preparing* $\rightarrow$ *Ready* $\rightarrow$ *Dispatched* $\rightarrow$ *Completed* | **Complete (Same Browser Session)** |
| **Service Area Fee Adjustment** | Admin edits fee in Admin Console | Cart and checkout reflect updated fee | Edited delivery fee (e.g. ₦700) persists and immediately applies to cart calculations | **Complete (Local Storage)** |
| **Dispute & Refund Logging** | Admin issues refund on order | Records refund, calculates total, logs audit entry | Record added to refund table; audit log created; GMV updated | **Complete (Local Storage)** |

---

## 3. What Could NOT Be Tested (Environment Limits & Unbuilt Modules)

| Feature | Reason It Cannot Be Tested |
|---|---|
| **Real Database Persistence** | Supabase backend instance is not provisioned or connected; all testing currently runs on `localStorage`. |
| **Real Payment Processing** | Paystack/Flutterwave API keys and client SDK are not integrated; actual debit card processing cannot occur. |
| **Cross-Device Realtime Sync** | Without a WebSocket server or Supabase Realtime channel, an order placed on a phone does NOT appear on a vendor's laptop. |
| **SMS/WhatsApp Notifications** | Termii/Twilio API is not integrated; physical SMS messages cannot be dispatched. |
| **Real User Authentication** | Passwords are not hashed or verified against `auth.users`; sessions are mock strings in `localStorage`. |

---

## 4. Verification of Zero Fake Data Integrity

A comprehensive code search was conducted across all source files to verify that no synthetic data leaks into the public customer marketplace:

1. **`approvedVendors` Initial State:** Confirmed to initialize as an empty array (`[]`) from `localStorage.getItem('chop_approved_vendors_v1')`. When no vendors are approved, zero vendors appear.
2. **`DEV_FIXTURES` Isolation:** Confirmed that `DEV_FIXTURES` in `src/lib/testFixtures.ts` is never imported or referenced in runtime application code (`src/App.tsx`, `src/lib/store.tsx`, `src/main.tsx`).
3. **Editorial Food Stories:** Stored in `EDITORIAL_STORIES` (`src/lib/constants.ts`) and rendered exclusively inside `EditorialFoodSpotlight.tsx`. They have no prices, no vendor IDs, and cannot be added to the customer cart or checkout.
4. **Geographic Boundaries:** Location options are strictly locked to `ijebu-ode` and `ijagun`. No external cities or imaginary delivery zones exist.

---

## 5. Security & Technical Debt Audit Findings

1. **Critical Vulnerability — Insecure Admin Gate:**
   - Location: `src/components/admin/AdminControlCenter.tsx` lines 85–91.
   - Code: `if (adminPasskey === '2026' || adminPasskey.toLowerCase() === 'admin' || adminPasskey.length >= 6)`
   - Risk: Anyone entering any 6-character string obtains full administrative control.
   - Remediation: Remove passkey logic and enforce Supabase RLS JWT `role: 'admin'` check.
2. **Critical Vulnerability — Unauthenticated Vendor Workspace:**
   - Location: `src/components/vendor/VendorWorkspace.tsx` lines 42–45.
   - Code: `const activeVendor = approvedVendors.find(v => v.id === selectedVendorId) || approvedVendors[0] || null;`
   - Risk: Any visitor switching to the vendor workspace can view, modify, or pause any approved vendor's kitchen without entering credentials.
   - Remediation: Implement vendor authentication and bind session user ID to `vendors.user_id`.
3. **High Defect — Payment Bypass in Cart Checkout:**
   - Location: `src/lib/store.tsx` line 843.
   - Code: `paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'unpaid' : 'verified'`
   - Risk: Any customer selecting Paystack or Flutterwave bypasses actual card payment and creates an order marked as `verified`.
   - Remediation: Require verified Paystack transaction reference from backend webhook before setting `payment_status = 'verified'`.
4. **Medium Defect — Multi-Vendor Cart Collision:**
   - Location: `src/lib/store.tsx` lines 819–820.
   - Code: `const vendorId = cart[0].vendorId;`
   - Risk: If a customer adds items from two different vendors, the order is dispatched exclusively to the first vendor.
   - Remediation: Restrict cart to a single vendor at a time.
