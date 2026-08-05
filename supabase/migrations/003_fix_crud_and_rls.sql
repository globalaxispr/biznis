-- ============================================================
-- Migration 003: Fix CRUD & RLS
-- Applied: 2026-08-05
-- Reason: All tables were missing (migrations 001 & 002 were
--         never applied to the Supabase project). Additionally,
--         the suppliers table was missing columns used in TypeScript
--         types (whatsapp, city, country, total_purchases,
--         last_purchase_at) and store_settings was missing columns
--         (city, country, nif, tax_rate, receipt_message, printer_name).
-- ============================================================

-- NOTE: This migration is a record of what was applied manually.
--       All steps below have already been executed on the project.

-- 1. Created ENUM: user_role ('admin', 'manager', 'employee')

-- 2. Created tables (in dependency order):
--    profiles, audit_logs, categories, suppliers (extended),
--    customers, products, cash_registers, cash_movements,
--    sales, sale_items, inventory_movements, store_settings (extended)

-- 3. Enabled RLS on all tables

-- 4. Created RLS Policies:
--    - profiles: SELECT (own), SELECT (admins), INSERT (admins), INSERT (service_role)
--    - audit_logs: SELECT (admins), INSERT (authenticated = user_id)
--    - All ERP tables: FOR ALL TO authenticated USING (true) WITH CHECK (true)

-- 5. Created functions & triggers:
--    - update_updated_at_column() → triggers on profiles, products
--    - handle_new_user() → trigger on auth.users to auto-create profile

-- 6. Created profiles for 3 existing auth.users with role 'admin'

-- 7. Inserted default store_settings row (id=1)
