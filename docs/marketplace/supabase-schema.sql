-- ====================================================================
-- CHOP — Premium Food Discovery & Ordering Marketplace Database Schema
-- Designed specifically for Ijebu Ode and Ijagun, Ogun State, Nigeria
-- PostgreSQL / Supabase with Row Level Security (RLS) & Audit Trails
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE location_area AS ENUM ('ijebu-ode', 'ijagun');
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected', 'needs_info');
CREATE TYPE fulfillment_type AS ENUM ('delivery', 'pickup', 'both');
CREATE TYPE order_status AS ENUM (
  'pending_acceptance',
  'accepted',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'completed',
  'cancelled'
);
CREATE TYPE payment_status AS ENUM ('pending', 'verified', 'unpaid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('paystack', 'flutterwave', 'cash_on_delivery');

-- 3. PROFILES TABLE (Supabase auth.users mirror)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SERVICE AREAS TABLE (STRICTLY Ijebu Ode & Ijagun)
CREATE TABLE service_areas (
  id location_area PRIMARY KEY,
  name TEXT NOT NULL,
  badge TEXT NOT NULL,
  description TEXT NOT NULL,
  delivery_base_fee INTEGER NOT NULL DEFAULT 500, -- In Nigerian Naira (₦)
  is_active BOOLEAN NOT NULL DEFAULT true,
  hub_highlights TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed strict service locations
INSERT INTO service_areas (id, name, badge, description, delivery_base_fee, hub_highlights)
VALUES
  ('ijebu-ode', 'Ijebu Ode', 'General Service Area', 'Serving residences, businesses, and communities across Ijebu Ode.', 600, ARRAY['Ijebu Ode General Service Area']),
  ('ijagun', 'Ijagun', 'TASUED & Surrounding Area', 'Serving students, staff, hostels, and communities across Ijagun.', 450, ARRAY['Ijagun & TASUED Communities'])
ON CONFLICT (id) DO NOTHING;

-- 5. VENDOR APPLICATIONS (Founding kitchen onboarding)
CREATE TABLE vendor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  business_category TEXT NOT NULL,
  location_area location_area NOT NULL,
  specific_address TEXT NOT NULL,
  landmark TEXT NOT NULL,
  description TEXT,
  food_categories TEXT[] NOT NULL DEFAULT '{}',
  fulfillment_options fulfillment_type NOT NULL DEFAULT 'both',
  opening_hours TEXT NOT NULL DEFAULT '8:00 AM - 9:00 PM',
  status application_status NOT NULL DEFAULT 'pending',
  admin_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. VENDORS (Only approved vendors published!)
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES vendor_applications(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  cover_url TEXT,
  description TEXT NOT NULL,
  location_area location_area NOT NULL REFERENCES service_areas(id),
  address TEXT NOT NULL,
  landmark TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_open BOOLEAN NOT NULL DEFAULT true,
  is_paused BOOLEAN NOT NULL DEFAULT false, -- Vendor Pause Store feature
  opening_hours TEXT NOT NULL DEFAULT '8:00 AM - 9:00 PM',
  preparation_minutes INTEGER NOT NULL DEFAULT 25,
  delivery_available BOOLEAN NOT NULL DEFAULT true,
  pickup_available BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 0.0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. FOOD CATEGORIES
CREATE TABLE food_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  icon_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- 8. MENU ITEMS
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  category_slug TEXT REFERENCES food_categories(slug) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Stored in Nigerian Naira ₦
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  preparation_minutes INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. MENU ITEM OPTIONS & CUSTOMIZATIONS
CREATE TABLE menu_item_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., 'Protein Choice', 'Spice Level'
  is_required BOOLEAN NOT NULL DEFAULT false,
  max_selections INTEGER NOT NULL DEFAULT 1,
  choices JSONB NOT NULL DEFAULT '[]'::jsonb -- [{ name: "Beef", price_delta: 0 }, { name: "Turkey", price_delta: 1200 }]
);

-- 10. CUSTOMER ADDRESSES
CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Hostel / Room',
  location_area location_area NOT NULL,
  street TEXT NOT NULL,
  hostel_or_building TEXT,
  landmark TEXT NOT NULL,
  directions TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
  location_area location_area NOT NULL,
  fulfillment_type fulfillment_type NOT NULL,
  delivery_details JSONB, -- { street, hostel_or_building, landmark, directions, recipient_name, recipient_phone }
  items JSONB NOT NULL, -- Snapshot of cart items with verified prices & options
  subtotal INTEGER NOT NULL, -- Server validated in Naira ₦
  delivery_fee INTEGER NOT NULL, -- Server validated in Naira ₦
  total INTEGER NOT NULL, -- Server validated in Naira ₦
  status order_status NOT NULL DEFAULT 'pending_acceptance',
  rejection_reason TEXT,
  payment_method payment_method NOT NULL DEFAULT 'cash_on_delivery',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. LAUNCH WAITLIST
CREATE TABLE launch_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location_area location_area NOT NULL,
  interest_type TEXT NOT NULL DEFAULT 'food_lover',
  favourite_food_wishlist TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. ADMIN AUDIT LOGS
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can view active service areas & food categories
CREATE POLICY "Public read active service areas" ON service_areas FOR SELECT USING (is_active = true);
CREATE POLICY "Public read food categories" ON food_categories FOR SELECT USING (true);

-- Public can view approved and open vendors (honors is_paused in UI)
CREATE POLICY "Public read approved vendors" ON vendors FOR SELECT USING (is_verified = true);
CREATE POLICY "Public read available menu items" ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public read menu item options" ON menu_item_options FOR SELECT USING (true);

-- Vendor application submission is open to public applicants
CREATE POLICY "Public insert vendor applications" ON vendor_applications FOR INSERT WITH CHECK (true);

-- Waitlist registration is open to public
CREATE POLICY "Public insert waitlist" ON launch_waitlist FOR INSERT WITH CHECK (true);

-- Customer orders: Customers can read and create their own orders
CREATE POLICY "Customers read own orders" ON orders FOR SELECT USING (
  customer_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin'
);
CREATE POLICY "Customers insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Vendors can view and manage orders sent to their vendor_id
CREATE POLICY "Vendors manage own orders" ON orders FOR ALL USING (
  vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()) OR auth.jwt() ->> 'role' = 'admin'
);

-- Admin has full access to all tables
CREATE POLICY "Admins full access" ON admin_audit_logs FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
