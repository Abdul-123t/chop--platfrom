# CHOP — Engineering Architecture & Co-Founder Handoff

Welcome to the **CHOP** codebase. CHOP is a food discovery and ordering marketplace engineered specifically for **Ijebu Ode** and **Ijagun (TASUED)**, Ogun State, Nigeria.

This document serves as the architectural reference and engineering blueprint for the founding team and incoming engineers.

---

## 1. Core Product Philosophy & Reality

> **Critical Rule:** CHOP does NOT invent fake restaurants, fake reviews, fake delivery tracking, or synthetic inventory.

- The application is intentionally designed to feel **premium, complete, and engaging even before live restaurants are onboarded**.
- We use purposeful empty states, founding vendor recruitment flows, authentic category discovery, and launch updates waitlists.
- Only **approved and physically verified vendors** will appear in the public discovery grid.

---

## 2. Technology Stack

| Layer | Choice | Details |
|---|---|---|
| **Framework** | React 19 + TypeScript | Full type safety across models and state |
| **Bundler** | Vite 6 | Ultra-fast HMR and tree-shaking |
| **Styling** | Tailwind CSS v4 | Custom token palette, zero bloated CSS |
| **Icons** | Lucide React | Lightweight, consistent iconography |
| **Typography** | Google Fonts | `Outfit` (Headings) + `Plus Jakarta Sans` (Body & UI) |
| **Database** | PostgreSQL / Supabase | Comprehensive schema with Row Level Security (RLS) |
| **State Layer** | Context + LocalStorage Sync | Reactive, offline-ready, Supabase migration-ready |

---

## 3. Brand Design Tokens

All components adhere to the following token palette:

| Token | Hex | Usage |
|---|---|---|
| Primary Ink | `#141414` | Hero titles, dark badges, primary buttons |
| Warm Background | `#F7F6F2` | Page background, card backgrounds |
| Pure White | `#FFFFFF` | Elevated surfaces, input fields, modal bodies |
| Secondary Surface | `#F0EEE8` | Subtle button backgrounds, dividers, pills |
| Borders | `#E6E2DA` | Crisp, restrained borders across cards and forms |
| Primary Text | `#191919` | Readable body copy |
| Secondary Text | `#77736C` | Muted descriptions, helper text, timestamps |
| Restrained Accent | `#C45B3A` | Burnt sienna / terracotta for active tabs and highlights |

---

## 4. Codebase Directory Structure

```
chop-ijebu/
├── .env.example                 # Environment variables specification
├── index.html                   # HTML entry with preconnected Google Fonts
├── package.json                 # Dependencies & build scripts
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── HANDOFF.md                   # Co-founder architectural manual (this file)
├── README.md                    # Project overview & quick start
├── public/
│   └── chop-mark.svg            # Custom SVG favicon and brand motif
├── src/
│   ├── main.tsx                 # React DOM mount point with StoreProvider
│   ├── App.tsx                  # Root layout, router, modal aggregator
│   ├── index.css                # Tailwind imports, brand classes & SVG keyframes
│   ├── types/
│   │   └── index.ts             # Shared data interfaces across all 3 experiences
│   ├── lib/
│   │   ├── constants.ts         # Brand copy, food categories, service hubs (₦ fees)
│   │   └── store.tsx            # Central state management & persistence
│   └── components/
│       ├── intro/
│       │   └── SketchingIntro.tsx       # 1.5s delicate SVG plate sketching animation
│       ├── common/
│       │   ├── Header.tsx               # Responsive nav, location switcher, cart button
│       │   └── Footer.tsx               # Signature closing section with hub info
│       ├── marketplace/
│       │   ├── Hero.tsx                 # Hero section with instant food search & location
│       │   ├── CategoryFilter.tsx       # 8 curated food categories with icon pills
│       │   ├── MarketplaceEmptyState.tsx# Pre-launch empty state with waitlist hook
│       │   ├── WaitlistModal.tsx        # Launch updates modal (Ijebu Ode & Ijagun)
│       │   ├── CartDrawer.tsx           # Cart slide-over with landmark-based address form
│       │   ├── OrderTrackerModal.tsx    # 7-stage live lifecycle stepper
│       │   ├── CustomerAccountModal.tsx # Saved addresses & order history
│       │   └── StorefrontModal.tsx      # Dynamic storefront for approved kitchens
│       ├── vendor/
│       │   ├── VendorRecruitmentPage.tsx# "Your food deserves a bigger audience"
│       │   └── VendorWorkspace.tsx      # Orders, menu management, "Pause Store" toggle
│       ├── admin/
│       │   └── AdminControlCenter.tsx   # Applications approval, audit logs, service rules
│       └── how/
│           └── HowItWorksModal.tsx      # Dual-audience walkthrough
└── supabase/
    └── schema.sql               # PostgreSQL tables, RLS policies, audit logs
```

---

## 5. The Three Connected Experiences

### A. Customer Marketplace
- **Location Selector:** Strictly toggles between **Ijebu Ode** and **Ijagun**. Delivery fees are automatically verified (₦600 for Ijebu Ode, ₦450 for Ijagun).
- **Landmark-Centric Delivery Form:** Nigerian local delivery relies on recognisable landmarks (e.g. Bovas, TASUED Express Gate, Harmony Villa Hostel). The checkout form captures both street address and landmarks.
- **Dynamic Storefront:** When a vendor is approved in Admin, their storefront immediately appears in the marketplace without code changes.

### B. Vendor Workspace
- **Zero-Fake Analytics:** Revenue and order counters show actual zero states with explanatory copy until real orders arrive.
- **Store Availability ("Pause Store"):** Allows kitchen operators to pause incoming orders without unpublishing their digital presence.
- **Menu Management:** Allows vendors to add dishes, set prices in Nigerian Naira (₦), configure protein/side options, and toggle stock availability.

### C. Admin Control Centre
- **Access Gate:** Passkey authentication (`2026`).
- **Application Review:** Review founding kitchen applications, approve with one click, request additional information, or reject with custom feedback.
- **Audit Logs:** Every status change, approval, or order placement generates an immutable audit record.

---

## 6. Database Implementation Status (`supabase/schema.sql`)

The schema is production-ready for deployment to Supabase or standard PostgreSQL:
1. `profiles`: Links to `auth.users` with `role` enum (`customer`, `vendor`, `admin`).
2. `service_areas`: Seeded with strictly `ijebu-ode` and `ijagun`.
3. `vendor_applications`: Manages incoming applications with `application_status`.
4. `vendors`: Published kitchens with verification badge and `is_paused` flag.
5. `menu_items` & `menu_item_options`: Supports portion and protein customizations.
6. `orders`: Full snapshot of items, landmark delivery details, and `order_status`.
7. `launch_waitlist`: Stores subscriber information, location, and food wishlists.
8. `admin_audit_logs`: Records all administrative actions.
9. **Row Level Security:** Complete RLS policies separating customer, vendor, and public permissions.

---

## 7. Next Steps for Co-Founder (Phase 2 & Phase 3 Checklist)

- [ ] **Supabase Linking:** Run `supabase init` or paste `supabase/schema.sql` into the Supabase SQL Editor.
- [ ] **Supabase Client Setup:** Install `@supabase/supabase-js` and replace localStorage helpers in `src/lib/store.tsx` with direct Supabase table subscriptions.
- [ ] **Paystack / Flutterwave Webhook:** Set up Supabase Edge Functions (`/functions/paystack-webhook`) to verify transactions server-side before updating `payment_status`.
- [ ] **SMS / WhatsApp Alerts:** Connect Termii or Twilio to dispatch order updates to vendors and customers via SMS/WhatsApp.
- [ ] **Physical Onboarding:** Visit confirmed bukka and grill businesses in Ijebu Ode (Mobalufon, Folagbade) and Ijagun (TASUED Gate, New Road) to onboard the first 10 founding kitchens.
