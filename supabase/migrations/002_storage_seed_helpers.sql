-- =============================================
-- ERP RRI - Storage, Seed Data & Helpers
-- =============================================

-- =============================================
-- 1. STORAGE BUCKETS (via Supabase Dashboard or API)
-- =============================================
-- Note: Create these buckets in Supabase Dashboard > Storage
-- 
-- Bucket 1: public-assets (Public)
--   - Purpose: Product images
--   - Permissions: Public read
-- 
-- Bucket 2: private-docs (Private)  
--   - Purpose: RFQ files, Contracts, GRN documents
--   - Permissions: Authenticated users only

-- =============================================
-- 2. STORAGE POLICIES
-- =============================================

-- Product images (public bucket)
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'public-assets');

CREATE POLICY "Authenticated can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'public-assets');

CREATE POLICY "Authenticated can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'public-assets');

-- Private documents
CREATE POLICY "Authenticated can view private docs"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'private-docs');

CREATE POLICY "Authenticated can upload private docs"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'private-docs');

-- =============================================
-- 3. SEED DATA: Global Settings
-- =============================================
INSERT INTO global_settings (key, value) VALUES
    ('company_name', 'Radio Republik Indonesia (Kantor Pusat)'),
    ('company_address', 'Jl. Medan Merdeka Barat No. 4-5, Gambir, Jakarta Pusat, DKI Jakarta 10110'),
    ('company_phone', '+62 21 3844545'),
    ('company_email', 'info@rri.co.id'),
    ('ppn_rate', '11'),
    ('default_currency', 'IDR')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =============================================
-- 4. SEED DATA: Categories
-- =============================================
INSERT INTO categories (name, type) VALUES
    ('Material Konstruksi', 'product'),
    ('Besi Beton', 'product'),
    ('Aksesoris', 'product'),
    ('Finishing', 'product'),
    ('Alat Kantor', 'supplier'),
    ('Perangkat IT', 'supplier'),
    ('Layanan Media', 'supplier'),
    ('Logistik', 'supplier')
ON CONFLICT DO NOTHING;

-- =============================================
-- 5. SEED DATA: Internal PICs
-- =============================================
INSERT INTO internal_pics (name, position, email, phone) VALUES
    ('Arya Satria', 'Direktur Operasional', 'arya.satria@rri.co.id', '+62 812-3456-7890'),
    ('Budi Pratama', 'Kepala Divisi Pengadaan', 'budi.pratama@rri.co.id', '+62 811-9988-7766'),
    ('Dewi Anjani', 'Manager Keuangan', 'dewi.anjani@rri.co.id', '+62 813-2233-4455'),
    ('Rian Kusuma', 'Legal Officer', 'rian.kusuma@rri.co.id', '+62 856-7788-1122')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    position = EXCLUDED.position,
    phone = EXCLUDED.phone;

-- =============================================
-- 6. HELPER: Initialize Transaction Sequences
-- =============================================
INSERT INTO transaction_sequences (year, month, type, last_sequence) VALUES
    (2026, 1, 'SPH', 0),
    (2026, 1, 'SO', 0),
    (2026, 1, 'SJ', 0),
    (2026, 1, 'INV', 0),
    (2026, 1, 'KWT', 0),
    (2026, 2, 'SPH', 0),
    (2026, 2, 'SO', 0),
    (2026, 2, 'SJ', 0),
    (2026, 2, 'INV', 0),
    (2026, 2, 'KWT', 0),
    (2026, 3, 'SPH', 0),
    (2026, 3, 'SO', 0),
    (2026, 3, 'SJ', 0),
    (2026, 3, 'INV', 0),
    (2026, 3, 'KWT', 0)
ON CONFLICT DO NOTHING;

-- =============================================
-- 7. SAMPLE DATA: Products
-- =============================================
INSERT INTO products (sku, name, brand, category_id, selling_price, unit, current_stock, min_stock_limit, status) 
SELECT 
    'RRI-MTL-001',
    'Steel Beam H-200',
    'IndoSteel',
    c.id,
    2500000,
    'PCS',
    150,
    20,
    'active'
FROM categories c WHERE c.name = 'Material Konstruksi'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, brand, category_id, selling_price, unit, current_stock, min_stock_limit, status) 
SELECT 
    'RRI-MTL-012',
    'Reinforcement Bar 12mm',
    'KS',
    c.id,
    85000,
    'BUNDLE',
    45,
    10,
    'active'
FROM categories c WHERE c.name = 'Besi Beton'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (sku, name, brand, category_id, selling_price, unit, current_stock, min_stock_limit, status) 
SELECT 
    'RRI-ACC-221',
    'Concrete Spacer 50mm',
    'Prima',
    c.id,
    15000,
    'BAG',
    500,
    100,
    'active'
FROM categories c WHERE c.name = 'Aksesoris'
ON CONFLICT (sku) DO NOTHING;

-- =============================================
-- 8. FUNCTION: Reset Monthly Sequences (for cron)
-- This can be scheduled via Supabase Cron
-- =============================================
CREATE OR REPLACE FUNCTION reset_monthly_sequences()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO transaction_sequences (year, month, type, last_sequence)
    SELECT 
        EXTRACT(YEAR FROM CURRENT_DATE + INTERVAL '1 month')::INTEGER,
        EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '1 month')::INTEGER,
        type,
        0
    FROM transaction_sequences
    WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
      AND month = EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER
    ON CONFLICT DO NOTHING;
END;
$$;

-- =============================================
-- 9. METRIC FUNCTIONS
-- =============================================
CREATE OR REPLACE FUNCTION get_monthly_stats()
RETURNS TABLE (
    total_quotations INTEGER,
    total_orders INTEGER,
    total_revenue NUMERIC,
    total_deliveries INTEGER,
    pending_approvals INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE))::INTEGER,
        COUNT(*) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE))::INTEGER,
        COALESCE(SUM(grand_total) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND status = 'paid'), 0),
        COUNT(*) FILTER (WHERE date >= DATE_TRUNC('month', CURRENT_DATE))::INTEGER,
        (SELECT COUNT(*) FROM quotations WHERE status = 'pending_approval') +
        (SELECT COUNT(*) FROM sales_orders WHERE status = 'pending_approval')::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 10. API ENDPOINT: Quick Stats
-- =============================================
CREATE OR REPLACE FUNCTION api_get_quick_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'products', (SELECT COUNT(*) FROM products WHERE status = 'active'),
        'customers', (SELECT COUNT(*) FROM customers WHERE status = 'active'),
        'suppliers', (SELECT COUNT(*) FROM suppliers WHERE status = 'active'),
        'pending_quotations', (SELECT COUNT(*) FROM quotations WHERE status = 'pending_approval'),
        'pending_orders', (SELECT COUNT(*) FROM sales_orders WHERE status = 'pending_approval'),
        'unpaid_invoices', (SELECT COUNT(*) FROM invoices WHERE status = 'unpaid'),
        'monthly_revenue', (SELECT COALESCE(SUM(grand_total), 0) FROM invoices WHERE status = 'paid' AND date >= DATE_TRUNC('month', CURRENT_DATE)))
    ) INTO result;
    
    RETURN result;
END;
$$;
