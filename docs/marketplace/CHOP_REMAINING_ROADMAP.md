# CHOP — PRIORITISED DEVELOPMENT ROADMAP
**Marketplace:** CHOP (Ijebu Ode & Ijagun, Ogun State, Nigeria)  
**Document Purpose:** Engineering Task Backlog & Staged Execution Plan  
**Target Architecture:** Multi-sided marketplace (Customer, Kitchen Vendor, Operations Admin, Dispatch Rider)  

---

## Stage A — Must Finish Before Real Vendor Onboarding
*Goal: Ensure vendor onboarding, legal business data capture, and administrative verification are cryptographically secure and persisted in PostgreSQL.*

### Task A.1: Supabase PostgreSQL Provisioning & Schema Migration
- **Description:** Provision a live Supabase production project, execute the complete SQL migration including missing tables (`complaints`, `refund_records`, `vendor_settlements`), and configure Row Level Security.
- **Priority:** P0 (Blocker)
- **Dependencies:** None
- **Relevant Files:** `supabase/schema.sql`, `.env.example`, `.env`
- **Recommended Owner:** Second Co-Founder (Backend Lead)
- **Completion Criteria:** PostgreSQL instance reachable; all 14 tables created with correct foreign keys, check constraints, and RLS policies active.

### Task A.2: Supabase JS SDK Integration in Store
- **Description:** Install `@supabase/supabase-js`, initialize the typed Supabase client in `src/lib/supabase.ts`, and replace `localStorage` writes with PostgreSQL inserts and queries in `src/lib/store.tsx`.
- **Priority:** P0 (Blocker)
- **Dependencies:** Task A.1
- **Relevant Files:** `package.json`, `src/lib/supabase.ts`, `src/lib/store.tsx`
- **Recommended Owner:** Second Co-Founder (Backend Lead)
- **Completion Criteria:** Vendor applications submitted on the frontend appear immediately in the Supabase `vendor_applications` table with status `pending`.

### Task A.3: Secure Cryptographic Admin Authentication
- **Description:** Eliminate the client-side `2026` / `password.length >= 6` bypass in `AdminControlCenter.tsx`. Implement real Supabase admin auth with an email/password login verified against an `admin` role in `profiles.role` or `auth.users.app_metadata`.
- **Priority:** P0 (Security Blocker)
- **Dependencies:** Task A.1, Task A.2
- **Relevant Files:** `src/components/admin/AdminControlCenter.tsx`, `src/lib/store.tsx`
- **Recommended Owner:** Second Co-Founder (Backend Lead)
- **Completion Criteria:** Admin Console returns a 403 / access denied error unless the user possesses an authenticated Supabase JWT with `role: 'admin'`.

### Task A.4: Vendor Media Storage (Logos, Kitchen Photos & Inspection Docs)
- **Description:** Create Supabase Storage buckets (`vendor-assets`, `menu-photos`, `verification-docs`) with appropriate RLS policies. Add file upload inputs to `VendorRecruitmentPage.tsx` and `VendorWorkspace.tsx`.
- **Priority:** P1
- **Dependencies:** Task A.1
- **Relevant Files:** `src/components/vendor/VendorRecruitmentPage.tsx`, `src/components/vendor/VendorWorkspace.tsx`
- **Recommended Owner:** Second Co-Founder
- **Completion Criteria:** Vendor applicants can upload their CAC certificate, kitchen photo, and brand logo, generating permanent CDN URLs saved to the vendor record.

### Task A.5: Secure Vendor Authentication & Storefront Ownership
- **Description:** Create a vendor login flow where an approved vendor owner signs in with their email/phone and password, binding their session to their specific `vendor_id`. Disallow access to the kitchen workspace for unauthorized users.
- **Priority:** P0 (Security Blocker)
- **Dependencies:** Task A.1, Task A.2
- **Relevant Files:** `src/components/vendor/VendorWorkspace.tsx`, `src/components/marketplace/AuthModal.tsx`
- **Recommended Owner:** Second Co-Founder
- **Completion Criteria:** A vendor can only see, manage, and edit their own menus, orders, and bank details.

---

## Stage B — Must Finish Before Public Ordering Launch
*Goal: Implement real payment gateway processing, transactional email/SMS notifications, multi-vendor cart validation, and local rider fulfillment coordination.*

### Task B.1: Paystack Payment Gateway & Webhook Integration
- **Description:** Integrate Paystack Inline JS for Nigerian card, bank transfer, and USSD payments. Create a serverless Supabase Edge Function (`/functions/paystack-webhook`) to cryptographically verify HMAC-SHA512 webhook signatures from Paystack and update order payment status.
- **Priority:** P0 (Blocker for Real Transactions)
- **Dependencies:** Task A.1, Task A.2
- **Relevant Files:** `src/components/marketplace/CartDrawer.tsx`, `supabase/functions/paystack-webhook/index.ts`
- **Recommended Owner:** Second Co-Founder (Backend Lead)
- **Completion Criteria:** Customer is charged in Naira (₦); orders remain `payment_status: 'pending'` until the webhook fires and confirms the charge; invalid or canceled payments abort the order.

### Task B.2: Single-Vendor Cart Enforcement
- **Description:** Prevent customers from checking out with items from multiple kitchens simultaneously. If a customer adds an item from Vendor B while having items from Vendor A, display a prompt asking to clear cart.
- **Priority:** P1
- **Dependencies:** None
- **Relevant Files:** `src/lib/store.tsx`, `src/components/marketplace/StorefrontModal.tsx`
- **Recommended Owner:** First Co-Founder (Frontend Lead)
- **Completion Criteria:** Cart items always belong to exactly one vendor; subtotal, delivery fee, and kitchen dispatch are 100% accurate.

### Task B.3: Realtime Kitchen Order Notifications & Sound Alerts
- **Description:** Connect `VendorWorkspace.tsx` to Supabase Realtime WebSocket channel for `INSERT` on `orders`. When a new order arrives, trigger an audible kitchen alert chime and badge update.
- **Priority:** P0 (Operational Requirement)
- **Dependencies:** Task A.2, Task B.1
- **Relevant Files:** `src/components/vendor/VendorWorkspace.tsx`, `public/sounds/`
- **Recommended Owner:** Second Co-Founder
- **Completion Criteria:** A newly placed customer order appears on the vendor's active screen in $< 1$ second accompanied by an audible notification.

### Task B.4: Realtime Customer Order Tracking
- **Description:** Subscribe `OrderTrackerModal.tsx` to Supabase Realtime for the active order ID so status changes by the kitchen (*Accepted* $\rightarrow$ *Cooking* $\rightarrow$ *Rider Dispatched*) reflect live without manual page refresh.
- **Priority:** P1
- **Dependencies:** Task A.2, Task B.3
- **Relevant Files:** `src/components/marketplace/OrderTrackerModal.tsx`
- **Recommended Owner:** First Co-Founder
- **Completion Criteria:** Customer sees their meal status update dynamically on mobile screen as the kitchen advances the order.

### Task B.5: SMS & WhatsApp Dispatch Alerts (Termii / Twilio)
- **Description:** Integrate Termii API to send Nigerian SMS notifications to the customer upon order confirmation and dispatch (*e.g., "Your order from Mama Ronke is on its way to TASUED New Road Hostels"*).
- **Priority:** P1
- **Dependencies:** Task B.1
- **Relevant Files:** `supabase/functions/send-sms/index.ts`
- **Recommended Owner:** Second Co-Founder
- **Completion Criteria:** Automated SMS delivered to Nigerian phone numbers (`080...`, `090...`) upon order dispatch.

### Task B.6: Rider Dispatch Coordination Module
- **Description:** Build a lightweight dispatcher view or WhatsApp dispatch integration for local bike riders in Ijebu Ode and Ijagun with pickup landmark, delivery landmark, and recipient phone.
- **Priority:** P1
- **Dependencies:** Task B.1
- **Relevant Files:** `src/components/admin/AdminControlCenter.tsx`
- **Recommended Owner:** Second Co-Founder
- **Completion Criteria:** Dispatcher can assign a verified local bike rider to an order marked `ready_for_pickup`.

---

## Stage C — Post-Launch Improvements & Scaling
*Goal: Platform growth, repeat ordering loops, vendor settlements automation, and customer loyalty.*

### Task C.1: Automated Weekly Vendor Payouts (Paystack Transfers)
- **Description:** Build automated Sunday settlement calculation deducting 10% marketplace commission and initiating automated batch transfers to vendor NUBAN bank accounts via Paystack Transfers API.
- **Priority:** P2
- **Dependencies:** Stage B
- **Relevant Files:** `supabase/functions/vendor-settlement/index.ts`, `src/components/vendor/VendorWorkspace.tsx`
- **Recommended Owner:** Second Co-Founder

### Task C.2: Student Meal Plans & Campus Group Orders (Ijagun Hub)
- **Description:** Specialized group cart feature for TASUED student hostels allowing roommates to bundle meals into a single delivery fee.
- **Priority:** P3
- **Dependencies:** Stage B
- **Relevant Files:** `src/components/marketplace/CartDrawer.tsx`
- **Recommended Owner:** First Co-Founder

### Task C.3: Automated Customer Review & Vendor Rating Loop
- **Description:** 2 hours post-delivery, prompt the customer for food quality and delivery speed ratings. Calculate and display rolling ratings on verified storefronts.
- **Priority:** P2
- **Dependencies:** Stage B
- **Relevant Files:** `src/components/marketplace/StorefrontModal.tsx`, `src/types/index.ts`
- **Recommended Owner:** First Co-Founder

### Task C.4: Offline PWA & Service Worker Caching
- **Description:** Add PWA manifest and service worker caching for unreliable Nigerian 3G/4G cellular connections in Ijagun and peripheral Ijebu quarters.
- **Priority:** P2
- **Dependencies:** Stage B
- **Relevant Files:** `vite.config.ts`, `public/manifest.json`
- **Recommended Owner:** First Co-Founder
