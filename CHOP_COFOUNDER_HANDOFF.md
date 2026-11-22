# CHOP — CO-FOUNDER TECHNICAL HANDOFF MANUAL
**For Incoming Technical Co-Founder & Backend Lead**  
**Project:** CHOP (Food Discovery & Ordering Platform — Ijebu Ode & Ijagun)  
**Date:** November 21, 2026  

---

## 1. Welcome & Immediate Context

You are stepping into a well-crafted frontend application with a completed design system, mobile-first responsive architecture, and verified business workflows.

The frontend is **90% complete in terms of UI, layout, interactions, and local state management**. However, it is running entirely on React Context and browser `localStorage`.

Your primary mission is to **turn this high-fidelity client into a secure, database-backed, production startup platform with real payments, real authentication, and real notifications.**

---

## 2. What Already Exists (DO NOT REBUILD)

Do NOT waste time rebuilding or refactoring the following:

1. **Brand Identity & Design System:**
   - Color tokens (`#141414`, `#F7F6F2`, `#C45B3A`, `#E6E2DA`, `#191919`, `#77736C`).
   - Fonts: `Outfit` for headings and `Plus Jakarta Sans` for body/UI.
   - Tailored specifically for small Android screens up to desktop.
2. **27-Second Signature Intro (`SketchingIntro.tsx`):**
   - Completed, verified SVG animation sequence with skip controls and reduced-motion bypass.
3. **Editorial Food Spotlight (`EditorialFoodSpotlight.tsx`):**
   - Completed editorial section celebrating 4 Nigerian and Ijebu dishes (*Jollof & Asun*, *Pounded Yam & Egusi*, *Shawarma*, *Grilled Fish*).
4. **Food Taxonomy (`CategoryFilter.tsx`):**
   - 11 customer-facing categories with responsive icon cards and honest empty states.
5. **Mobile Navigation (`MobileBottomNav.tsx` & `Header.tsx`):**
   - Safe-area aware bottom bar and desktop header with real-time cart indicator.
6. **Order Tracker Lifecycle Visualizer (`OrderTrackerModal.tsx`):**
   - 6-stage order status tracker already handles all state transitions.
7. **Vendor Recruitment UI (`VendorRecruitmentPage.tsx`):**
   - Form for all 9 vendor types with reference number generator and status tracker.
8. **Kitchen Workspace UI (`VendorWorkspace.tsx`):**
   - Tabs for Overview, Orders, Menu Management, Settlements, and Analytics.
9. **Admin Control Console UI (`AdminControlCenter.tsx`):**
   - Tabs for Overview, Applications, Approved Vendors, Orders, Waitlist, Service Areas, Complaints, Refunds, and Logs.

---

## 3. Where You Should Begin (First 48 Hours)

Follow this exact file reading order before writing a single line of code:

### Day 1: System Comprehension
1. **[src/types/index.ts](file:///Users/abdul-jnr/Desktop/chop-ijebu/src/types/index.ts):** Read every interface. This is the single source of truth for the entire domain model (Customer, Vendor, MenuItem, Order, Complaint, Refund, Settlement).
2. **[src/lib/constants.ts](file:///Users/abdul-jnr/Desktop/chop-ijebu/src/lib/constants.ts):** Review `SERVICE_LOCATIONS` (Ijebu Ode ₦600, Ijagun ₦450), `FOOD_CATEGORIES`, and `VENDOR_TYPES`.
3. **[src/lib/store.tsx](file:///Users/abdul-jnr/Desktop/chop-ijebu/src/lib/store.tsx):** Review how `StoreContext` handles state. Notice how every mutation currently saves to `LOCAL_STORAGE_KEYS`.
4. **[supabase/schema.sql](file:///Users/abdul-jnr/Desktop/chop-ijebu/supabase/schema.sql):** Compare the SQL tables with `src/types/index.ts` to identify the schema gaps noted below.

### Day 2: Environment Setup
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Apply the updated SQL schema (see Section 4).
3. Create `.env` from `.env.example` with valid credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
   ```
4. Install `@supabase/supabase-js`:
   ```bash
   npm install @supabase/supabase-js
   ```

---

## 4. Features & Modules Owned by the Second Co-Founder

You will own the **Backend, Security, Payments, and Integrations** track:

### Ownership Area 1: Supabase Database Migration & Integration
- **Owner:** Second Co-Founder
- **Task:** Connect `src/lib/store.tsx` to Supabase PostgreSQL instead of `localStorage`.
- **Target Schema Updates to add to `supabase/schema.sql`:**
  ```sql
  -- 1. Add missing columns to vendor_applications
  ALTER TABLE vendor_applications ADD COLUMN reference_number TEXT UNIQUE;

  -- 2. Add missing columns to vendors
  ALTER TABLE vendors ADD COLUMN is_activated BOOLEAN NOT NULL DEFAULT false;
  ALTER TABLE vendors ADD COLUMN commission_rate NUMERIC(4,2) NOT NULL DEFAULT 0.10;
  ALTER TABLE vendors ADD COLUMN bank_details JSONB;

  -- 3. Create complaints table
  CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
  );

  -- 4. Create refund_records table
  CREATE TABLE refund_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    processed_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    processed_at TIMESTAMPTZ
  );

  -- 5. Create vendor_settlements table
  CREATE TABLE vendor_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    period TEXT NOT NULL,
    gross_sales INTEGER NOT NULL,
    commission_deducted INTEGER NOT NULL,
    net_payout INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payout_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    settled_at TIMESTAMPTZ
  );

  -- 6. Update vendors public read policy
  DROP POLICY IF EXISTS "Public read approved vendors" ON vendors;
  CREATE POLICY "Public read approved vendors" ON vendors
    FOR SELECT USING (is_verified = true AND is_activated = true);
  ```

### Ownership Area 2: Real Customer & Vendor Authentication
- **Current State:** Mock JWT in `localStorage` without cryptographic verification.
- **Your Responsibility:**
  - Replace mock auth in `src/lib/store.tsx` with Supabase Auth:
    - Customer Sign-Up: `supabase.auth.signUp()` with metadata (`full_name`, `phone`, `role: 'customer'`).
    - Customer Sign-In: `supabase.auth.signInWithPassword()`.
    - Phone OTP Authentication: Implement SMS verification for Nigerian phone numbers (`+234...`).
  - **Build Vendor Authentication:** Create a dedicated vendor login modal/route linking `auth.users.id` $\rightarrow$ `vendors.user_id`. Only authorized vendor owners can view their kitchen workspace.
  - **Secure Admin Authentication:** Admin role must be verified via Supabase JWT claim (`auth.jwt() ->> 'role' = 'admin'`), **NOT** client-side passkey `2026`.

### Ownership Area 3: Paystack Payment Gateway Integration
- **Current State:** Selecting Paystack marks the order as paid immediately.
- **Your Responsibility:**
  - Add Paystack Inline JS SDK or Paystack Popup React:
    ```bash
    npm install react-paystack
    ```
  - In `CartDrawer.tsx`, initialize Paystack popup on checkout click.
  - On payment success, store the `paystack_reference` in the order.
  - Deploy a Supabase Edge Function (`/functions/paystack-webhook`) to verify payment signatures and set `payment_status = 'verified'`.
  - Orders must remain `payment_status = 'pending'` until verified by the webhook.

### Ownership Area 4: Order Realtime Subscriptions
- **Current State:** Orders are updated only in the local browser tab.
- **Your Responsibility:**
  - Enable Supabase Realtime on `orders` table.
  - In `VendorWorkspace.tsx`, subscribe to `INSERT` events on `orders` matching `vendor_id`:
    ```ts
    supabase.channel('vendor-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders', filter: `vendor_id=eq.${vendor.id}` }, payload => {
        // Play notification sound & add to queue
      })
      .subscribe();
    ```
  - In `OrderTrackerModal.tsx`, subscribe to `UPDATE` events on the active order so customers see their meal status change live when the kitchen clicks "Accepted" or "Dispatched".

### Ownership Area 5: Cart Multi-Vendor Integrity
- **Current State:** If items from Vendor A and Vendor B are added, the order is credited to Vendor A only.
- **Your Responsibility:**
  - Update `addToCart` in `store.tsx`: If cart already contains items from Vendor A and the user adds from Vendor B, show a confirmation modal:
    *"Your cart contains items from [Vendor A]. Would you like to clear your cart and start a new order with [Vendor B]?"*

---

## 5. Technical Boundaries & Contracts

To ensure neither co-founder breaks the other's work:

1. **Keep Component Signatures Stable:** Do not alter the props of `CartDrawer`, `StorefrontModal`, `Header`, or `VendorWorkspace`. Modify only the internal store hooks or handlers.
2. **Never Fabricate Data in Production:** Keep `DEV_FIXTURES` strictly in `src/lib/testFixtures.ts`. The public marketplace must always default to empty arrays (`[]`) when no approved vendors exist.
3. **Maintain Ijebu Scope:** Geographic validation must strictly reject any delivery address outside `ijebu-ode` or `ijagun`.
4. **Preserve Design System:** Use only existing Tailwind classes and brand tokens. Never introduce raw hex colors outside the palette.
