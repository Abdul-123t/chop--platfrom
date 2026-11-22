# CHOP — Good food, closer to you.
### Premium Food Discovery & Ordering Marketplace for Ijebu Ode & Ijagun, Ogun State, Nigeria

**CHOP** is a food marketplace connecting customers, students, and residents with authentic restaurants, bukka kitchens, street-food heroes, grills, shawarma spots, and pastry businesses across **Ijebu Ode** and **Ijagun**.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

Open `http://localhost:5173` to experience the application.

---

## Key Features

1. **Short Hand-Drawn Sketching Intro:** 1.5-second lightweight SVG signature animation with skip capability and `prefers-reduced-motion` compliance.
2. **Official Service Areas Only:** Strictly serves **Ijebu Ode** and **Ijagun (TASUED)**.
3. **Zero Fake Inventory Integrity:** Intentional pre-launch empty states and authentic founding vendor applications. No synthetic restaurants or reviews.
4. **Three Connected Workspaces:**
   - **Customer Marketplace:** Instant search, 8 curated categories, landmark-based checkout, real-time 7-stage order tracking.
   - **Vendor Workspace:** Order queue, item customizations, price setting in Naira (₦), and "Pause Store" toggle.
   - **Admin Control Centre:** Passkey gated (`2026`), vendor application review, approved vendor directory, and audit logs.
5. **Backend Ready:** Full PostgreSQL schema with Row Level Security policies located in `supabase/schema.sql`.

For detailed architecture and co-founder development roadmap, see [HANDOFF.md](file:///Users/abdul-jnr/Desktop/chop-ijebu/HANDOFF.md).
