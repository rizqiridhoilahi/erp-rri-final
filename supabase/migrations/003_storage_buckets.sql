-- =============================================
-- ERP RRI - Storage Buckets Configuration
-- =============================================
-- Date: 2026-03-22
-- Purpose: Create all storage buckets for ERP RRI system
-- =============================================

-- =============================================
-- 1. CREATE STORAGE BUCKETS
-- =============================================

-- Bucket 1: public-assets (for product images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('public-assets', 'public-assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Bucket 2: private-docs (for contracts, RFQ documents)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('private-docs', 'private-docs', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Bucket 3: customer-docs (for customer documents like KTP, NPWP, SIUP)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('customer-docs', 'customer-docs', false, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- Bucket 4: invoices (for invoice PDFs and receipts)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('invoices', 'invoices', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Bucket 5: quotations (for quotation files and price lists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('quotations', 'quotations', false, 10485760, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
ON CONFLICT (id) DO NOTHING;

-- Bucket 6: delivery-orders (for delivery order documents)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('delivery-orders', 'delivery-orders', false, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. STORAGE POLICIES - public-assets
-- =============================================

DROP POLICY IF EXISTS "Public can view public assets" ON storage.objects;
CREATE POLICY "Public can view public assets"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'public-assets');

DROP POLICY IF EXISTS "Public can upload public assets" ON storage.objects;
CREATE POLICY "Public can upload public assets"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'public-assets');

DROP POLICY IF EXISTS "Public can update public assets" ON storage.objects;
CREATE POLICY "Public can update public assets"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'public-assets');

DROP POLICY IF EXISTS "Public can delete public assets" ON storage.objects;
CREATE POLICY "Public can delete public assets"
    ON storage.objects FOR DELETE
    TO public
    USING (bucket_id = 'public-assets');

-- =============================================
-- 3. STORAGE POLICIES - private-docs
-- =============================================

DROP POLICY IF EXISTS "Public can view private docs" ON storage.objects;
CREATE POLICY "Public can view private docs"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'private-docs');

DROP POLICY IF EXISTS "Public can upload private docs" ON storage.objects;
CREATE POLICY "Public can upload private docs"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'private-docs');

DROP POLICY IF EXISTS "Public can update private docs" ON storage.objects;
CREATE POLICY "Public can update private docs"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'private-docs');

DROP POLICY IF EXISTS "Public can delete private docs" ON storage.objects;
CREATE POLICY "Public can delete private docs"
    ON storage.objects FOR DELETE
    TO public
    USING (bucket_id = 'private-docs');

-- =============================================
-- 4. STORAGE POLICIES - customer-docs
-- =============================================

DROP POLICY IF EXISTS "Public can view customer docs" ON storage.objects;
CREATE POLICY "Public can view customer docs"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'customer-docs');

DROP POLICY IF EXISTS "Public can upload customer docs" ON storage.objects;
CREATE POLICY "Public can upload customer docs"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'customer-docs');

DROP POLICY IF EXISTS "Public can update customer docs" ON storage.objects;
CREATE POLICY "Public can update customer docs"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'customer-docs');

DROP POLICY IF EXISTS "Public can delete customer docs" ON storage.objects;
CREATE POLICY "Public can delete customer docs"
    ON storage.objects FOR DELETE
    TO public
    USING (bucket_id = 'customer-docs');

-- =============================================
-- 5. STORAGE POLICIES - invoices
-- =============================================

DROP POLICY IF EXISTS "Public can view invoices" ON storage.objects;
CREATE POLICY "Public can view invoices"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'invoices');

DROP POLICY IF EXISTS "Public can upload invoices" ON storage.objects;
CREATE POLICY "Public can upload invoices"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'invoices');

DROP POLICY IF EXISTS "Public can update invoices" ON storage.objects;
CREATE POLICY "Public can update invoices"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'invoices');

DROP POLICY IF EXISTS "Public can delete invoices" ON storage.objects;
CREATE POLICY "Public can delete invoices"
    ON storage.objects FOR DELETE
    TO public
    USING (bucket_id = 'invoices');

-- =============================================
-- 6. STORAGE POLICIES - quotations
-- =============================================

DROP POLICY IF EXISTS "Public can view quotations" ON storage.objects;
CREATE POLICY "Public can view quotations"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'quotations');

DROP POLICY IF EXISTS "Public can upload quotations" ON storage.objects;
CREATE POLICY "Public can upload quotations"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'quotations');

DROP POLICY IF EXISTS "Public can update quotations" ON storage.objects;
CREATE POLICY "Public can update quotations"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'quotations');

DROP POLICY IF EXISTS "Public can delete quotations" ON storage.objects;
CREATE POLICY "Public can delete quotations"
    ON storage.objects FOR DELETE
    TO public
    USING (bucket_id = 'quotations');

-- =============================================
-- 7. STORAGE POLICIES - delivery-orders
-- =============================================

DROP POLICY IF EXISTS "Public can view delivery orders" ON storage.objects;
CREATE POLICY "Public can view delivery orders"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'delivery-orders');

DROP POLICY IF EXISTS "Public can upload delivery orders" ON storage.objects;
CREATE POLICY "Public can upload delivery orders"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'delivery-orders');

DROP POLICY IF EXISTS "Public can update delivery orders" ON storage.objects;
CREATE POLICY "Public can update delivery orders"
    ON storage.objects FOR UPDATE
    TO public
    USING (bucket_id = 'delivery-orders');

DROP POLICY IF EXISTS "Public can delete delivery orders" ON storage.objects;
CREATE POLICY "Public can delete delivery orders"
    ON storage.objects FOR DELETE
    TO public
    USING (bucket_id = 'delivery-orders');

-- =============================================
-- 8. VERIFICATION
-- =============================================

-- List all buckets
SELECT id, name, public, file_size_limit FROM storage.buckets;

-- List all storage policies
SELECT policyname, cmd, qual FROM pg_policies WHERE schemaname = 'storage';
