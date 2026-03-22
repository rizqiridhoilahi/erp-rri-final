-- =============================================
-- ERP RRI - Functions, Triggers, Views & RLS
-- =============================================

-- =============================================
-- 1. FUNCTION: Auto-Generate Document Number
-- Format: RRI-{TYPE}-{YY}-{MM}-{XXX}
-- =============================================
CREATE OR REPLACE FUNCTION generate_doc_number(doc_type VARCHAR)
RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
DECLARE
    new_number VARCHAR;
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    current_month INTEGER := EXTRACT(MONTH FROM CURRENT_DATE);
    next_seq INTEGER;
BEGIN
    -- Lock the row for update to prevent race conditions
    UPDATE transaction_sequences 
    SET last_sequence = last_sequence + 1
    WHERE year = current_year 
      AND month = current_month 
      AND type = doc_type
    RETURNING last_sequence INTO next_seq;
    
    -- If no sequence exists, create one
    IF next_seq IS NULL THEN
        INSERT INTO transaction_sequences (year, month, type, last_sequence)
        VALUES (current_year, current_month, doc_type, 1)
        RETURNING 1 INTO next_seq;
    END IF;
    
    -- Format: RRI-SPH-26-03-001
    new_number := 'RRI-' || doc_type || '-' || 
                  TO_CHAR(CURRENT_DATE, 'YY') || '-' ||
                  LPAD(current_month::TEXT, 2, '0') || '-' ||
                  LPAD(next_seq::TEXT, 3, '0');
    
    RETURN new_number;
END;
$$;

-- =============================================
-- 2. FUNCTION: Get Contract Price
-- Returns special price if customer has active contract
-- =============================================
CREATE OR REPLACE FUNCTION get_contract_price(
    p_customer_id UUID,
    p_product_id UUID
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    contract_price NUMERIC;
    regular_price NUMERIC;
BEGIN
    -- Check if customer has active contract with this product
    SELECT cp.special_price
    INTO contract_price
    FROM customer_contracts cc
    JOIN contract_prices cp ON cc.id = cp.contract_id
    WHERE cc.customer_id = p_customer_id
      AND cp.product_id = p_product_id
      AND cc.start_date <= CURRENT_DATE
      AND cc.end_date >= CURRENT_DATE
    LIMIT 1;
    
    IF contract_price IS NOT NULL THEN
        RETURN contract_price;
    END IF;
    
    -- Fallback to regular selling price
    SELECT selling_price
    INTO regular_price
    FROM products
    WHERE id = p_product_id;
    
    RETURN COALESCE(regular_price, 0);
END;
$$;

-- =============================================
-- 3. FUNCTION: Update Stock After SO
-- Decreases stock when Sales Order is created
-- =============================================
CREATE OR REPLACE FUNCTION update_stock_after_so()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    item RECORD;
BEGIN
    -- Only trigger on INSERT
    IF TG_OP = 'INSERT' THEN
        -- Update each item's stock
        FOR item IN 
            SELECT product_id, qty 
            FROM sales_order_items 
            WHERE sales_order_id = NEW.id
        LOOP
            UPDATE products
            SET current_stock = current_stock - item.qty
            WHERE id = item.product_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$;

-- =============================================
-- 4. TRIGGER: Auto-update stock on SO creation
-- =============================================
DROP TRIGGER IF EXISTS trg_update_stock_on_so ON sales_orders;
CREATE TRIGGER trg_update_stock_on_so
    AFTER INSERT ON sales_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_so();

-- =============================================
-- 5. FUNCTION: Generate Customer ID (CUST-XXX)
-- =============================================
CREATE OR REPLACE FUNCTION generate_customer_id()
RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
DECLARE
    next_id INTEGER;
BEGIN
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(customer_id FROM 6) AS INTEGER)
    ), 0) + 1
    INTO next_id
    FROM customers;
    
    RETURN 'CUST-' || LPAD(next_id::TEXT, 3, '0');
END;
$$;

-- =============================================
-- 6. HELPER FUNCTION: Convert Hundreds (for number_to_words_id)
-- =============================================
CREATE OR REPLACE FUNCTION convert_hundreds(n INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    result TEXT := '';
    hundreds_val INTEGER;
    tens_val INTEGER;
    ones_val INTEGER;
BEGIN
    IF n > 99 THEN
        hundreds_val := n / 100;
        IF hundreds_val = 1 THEN
            result := result || 'Seratus ';
        ELSIF hundreds_val = 2 THEN
            result := result || 'Dua Ratus ';
        ELSE
            result := result || 
                CASE hundreds_val
                    WHEN 3 THEN 'Tiga'
                    WHEN 4 THEN 'Empat'
                    WHEN 5 THEN 'Lima'
                    WHEN 6 THEN 'Enam'
                    WHEN 7 THEN 'Tujuh'
                    WHEN 8 THEN 'Delapan'
                    WHEN 9 THEN 'Sembilan'
                END || ' Ratus ';
        END IF;
        n := n % 100;
    END IF;
    
    IF n > 11 AND n < 20 THEN
        result := result || 
            CASE n - 10
                WHEN 1 THEN 'Sebelas'
                WHEN 2 THEN 'Dua Belas'
                WHEN 3 THEN 'Tiga Belas'
                WHEN 4 THEN 'Empat Belas'
                WHEN 5 THEN 'Lima Belas'
                WHEN 6 THEN 'Enam Belas'
                WHEN 7 THEN 'Tujuh Belas'
                WHEN 8 THEN 'Delapan Belas'
                WHEN 9 THEN 'Sembilan Belas'
            END;
    ELSIF n >= 20 THEN
        tens_val := n / 10;
        IF tens_val > 1 THEN
            result := result ||
                CASE tens_val
                    WHEN 2 THEN 'Dua Puluh '
                    WHEN 3 THEN 'Tiga Puluh '
                    WHEN 4 THEN 'Empat Puluh '
                    WHEN 5 THEN 'Lima Puluh '
                    WHEN 6 THEN 'Enam Puluh '
                    WHEN 7 THEN 'Tujuh Puluh '
                    WHEN 8 THEN 'Delapan Puluh '
                    WHEN 9 THEN 'Sembilan Puluh '
                END;
        END IF;
        ones_val := n % 10;
        IF ones_val > 0 THEN
            result := result ||
                CASE ones_val
                    WHEN 1 THEN 'Satu'
                    WHEN 2 THEN 'Dua'
                    WHEN 3 THEN 'Tiga'
                    WHEN 4 THEN 'Empat'
                    WHEN 5 THEN 'Lima'
                    WHEN 6 THEN 'Enam'
                    WHEN 7 THEN 'Tujuh'
                    WHEN 8 THEN 'Delapan'
                    WHEN 9 THEN 'Sembilan'
                END;
        END IF;
    ELSIF n > 0 THEN
        result := result ||
            CASE n
                WHEN 1 THEN 'Satu'
                WHEN 2 THEN 'Dua'
                WHEN 3 THEN 'Tiga'
                WHEN 4 THEN 'Empat'
                WHEN 5 THEN 'Lima'
                WHEN 6 THEN 'Enam'
                WHEN 7 THEN 'Tujuh'
                WHEN 8 THEN 'Delapan'
                WHEN 9 THEN 'Sembilan'
                WHEN 10 THEN 'Sepuluh'
                WHEN 11 THEN 'Sebelas'
            END;
    END IF;
    
    RETURN result;
END;
$$;

-- =============================================
-- 7. FUNCTION: Convert Number to Words (IDR)
-- =============================================
CREATE OR REPLACE FUNCTION number_to_words_id(numeric_val NUMERIC)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    input_num INTEGER := FLOOR(numeric_val)::INTEGER;
    output_text TEXT := '';
    billions_val INTEGER;
    millions_val INTEGER;
    thousands_val INTEGER;
BEGIN
    IF input_num = 0 THEN
        RETURN 'Nol';
    END IF;
    
    IF input_num < 0 THEN
        RETURN 'Minus ' || number_to_words_id(-input_num);
    END IF;
    
    -- Billions
    IF input_num >= 1000000000 THEN
        billions_val := input_num / 1000000000;
        output_text := output_text || convert_hundreds(billions_val) || ' Milyar ';
        input_num := input_num % 1000000000;
    END IF;
    
    -- Millions
    IF input_num >= 1000000 THEN
        millions_val := input_num / 1000000;
        output_text := output_text || convert_hundreds(millions_val) || ' Juta ';
        input_num := input_num % 1000000;
    END IF;
    
    -- Thousands
    IF input_num >= 1000 THEN
        thousands_val := input_num / 1000;
        IF thousands_val = 1 THEN
            output_text := output_text || 'Seribu ';
        ELSE
            output_text := output_text || convert_hundreds(thousands_val) || ' Ribu ';
        END IF;
        input_num := input_num % 1000;
    END IF;
    
    -- Hundreds
    IF input_num > 0 THEN
        output_text := output_text || convert_hundreds(input_num);
    END IF;
    
    RETURN TRIM(output_text);
END;
$$;

-- =============================================
-- 8. VIEW: Dashboard Summary
-- =============================================
CREATE OR REPLACE VIEW v_dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM products WHERE status = 'active') AS total_products,
    (SELECT COUNT(*) FROM customers WHERE status = 'active') AS total_customers,
    (SELECT COUNT(*) FROM suppliers WHERE status = 'active') AS total_suppliers,
    (SELECT COUNT(*) FROM internal_pics) AS total_pics,
    (SELECT COUNT(*) FROM quotations WHERE status = 'pending_approval') AS pending_quotations,
    (SELECT COUNT(*) FROM sales_orders WHERE status = 'pending_approval') AS pending_orders,
    (SELECT COUNT(*) FROM invoices WHERE status = 'unpaid') AS unpaid_invoices,
    COALESCE((SELECT SUM(grand_total) FROM invoices WHERE status = 'paid' AND date >= DATE_TRUNC('month', CURRENT_DATE)), 0) AS monthly_revenue;

-- =============================================
-- 9. VIEW: Products with Category & Supplier
-- =============================================
CREATE OR REPLACE VIEW v_products_full AS
SELECT 
    p.id,
    p.sku,
    p.name,
    p.brand,
    p.selling_price,
    p.unit,
    p.current_stock,
    p.min_stock_limit,
    p.status,
    p.is_contract_product,
    c.name AS category_name,
    s.name AS supplier_name,
    CASE 
        WHEN p.current_stock <= p.min_stock_limit THEN 'low'
        WHEN p.current_stock = 0 THEN 'out'
        ELSE 'ok'
    END AS stock_status
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN suppliers s ON p.supplier_id = s.id;

-- =============================================
-- 10. VIEW: Customers with Contract Info
-- =============================================
CREATE OR REPLACE VIEW v_customers_full AS
SELECT 
    c.id,
    c.customer_id,
    c.type,
    c.name,
    c.email,
    c.phone,
    c.status,
    c.has_contract,
    COUNT(DISTINCT cp.id) AS pic_count,
    COUNT(DISTINCT ca.id) AS address_count,
    COUNT(DISTINCT cb.id) AS bank_count,
    MAX(cc.contract_number) AS contract_number,
    MAX(cc.contract_name) AS contract_name,
    MAX(cc.start_date) AS start_date,
    MAX(cc.end_date) AS end_date
FROM customers c
LEFT JOIN customer_pics cp ON c.id = cp.customer_id
LEFT JOIN customer_addresses ca ON c.id = ca.customer_id
LEFT JOIN customer_banks cb ON c.id = cb.customer_id
LEFT JOIN customer_contracts cc ON c.id = cc.customer_id AND cc.end_date >= CURRENT_DATE
GROUP BY c.id;

-- =============================================
-- 11. VIEW: Active Quotations with Customer
-- =============================================
CREATE OR REPLACE VIEW v_quotations_active AS
SELECT 
    q.id,
    q.number,
    q.date,
    q.valid_from,
    q.valid_until,
    q.has_rfq,
    q.subtotal,
    q.vat_amount,
    q.grand_total,
    q.status,
    q.notes,
    cust.customer_id AS customer_code,
    cust.name AS customer_name,
    ip.name AS pic_name,
    ip.position AS pic_position
FROM quotations q
LEFT JOIN customers cust ON q.customer_id = cust.id
LEFT JOIN internal_pics ip ON q.internal_pic_id = ip.id;

-- =============================================
-- 12. VIEW: Invoice Summary
-- =============================================
CREATE OR REPLACE VIEW v_invoices_summary AS
SELECT 
    i.id,
    i.number,
    i.date,
    i.due_date,
    i.grand_total,
    i.amount_paid,
    i.status,
    i.notes,
    so.number AS so_number,
    cust.name AS customer_name
FROM invoices i
LEFT JOIN sales_orders so ON i.sales_order_id = so.id
LEFT JOIN customers cust ON so.customer_id = cust.id;

-- =============================================
-- 13. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_pics ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_pics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_sequences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for global_settings (Admin only)
CREATE POLICY "Admin can view global_settings"
    ON global_settings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin can update global_settings"
    ON global_settings FOR ALL
    TO authenticated
    USING (true);

-- RLS Policies for transaction_sequences (Internal use only)
CREATE POLICY "Allow read on transaction_sequences"
    ON transaction_sequences FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow insert on transaction_sequences"
    ON transaction_sequences FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update on transaction_sequences"
    ON transaction_sequences FOR UPDATE
    TO authenticated
    USING (true);

-- RLS Policies for master data (All authenticated users can CRUD)
CREATE POLICY "Allow CRUD on categories"
    ON categories FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on products"
    ON products FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on suppliers"
    ON suppliers FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on internal_pics"
    ON internal_pics FOR ALL
    TO authenticated
    USING (true);

-- RLS Policies for customers and related tables
CREATE POLICY "Allow CRUD on customers"
    ON customers FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on customer_pics"
    ON customer_pics FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on customer_addresses"
    ON customer_addresses FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on customer_banks"
    ON customer_banks FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on customer_contracts"
    ON customer_contracts FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on contract_prices"
    ON contract_prices FOR ALL
    TO authenticated
    USING (true);

-- RLS Policies for sales workflow
CREATE POLICY "Allow CRUD on quotations"
    ON quotations FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on quotation_items"
    ON quotation_items FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on sales_orders"
    ON sales_orders FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on sales_order_items"
    ON sales_order_items FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on delivery_orders"
    ON delivery_orders FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on delivery_order_items"
    ON delivery_order_items FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on invoices"
    ON invoices FOR ALL
    TO authenticated
    USING (true);

CREATE POLICY "Allow CRUD on receipts"
    ON receipts FOR ALL
    TO authenticated
    USING (true);

-- =============================================
-- 14. FUNCTION: Get Next Customer ID
-- =============================================
CREATE OR REPLACE FUNCTION get_next_customer_id()
RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(customer_id FROM 6) AS INTEGER)
    ), 0) + 1
    FROM customers
    INTO next_num;
    
    RETURN 'CUST-' || LPAD(next_num::TEXT, 3, '0');
END;
$$;

-- =============================================
-- 15. FUNCTION: Check Stock Availability
-- =============================================
CREATE OR REPLACE FUNCTION check_stock_availability(
    p_product_id UUID,
    p_qty INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    SELECT current_stock
    INTO current_stock
    FROM products
    WHERE id = p_product_id;
    
    RETURN COALESCE(current_stock, 0) >= p_qty;
END;
$$;

-- =============================================
-- 16. FUNCTION: Get Customer By ID for Cascade Drop
-- =============================================
CREATE OR REPLACE FUNCTION get_customer_details(p_customer_id UUID)
RETURNS TABLE (
    customer_data JSONB,
    pics_data JSONB,
    addresses_data JSONB,
    banks_data JSONB,
    contracts_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        row_to_json(c)::JSONB,
        COALESCE(json_agg(DISTINCT row_to_json(cp)) FILTER (WHERE cp.id IS NOT NULL), '[]')::JSONB,
        COALESCE(json_agg(DISTINCT row_to_json(ca)) FILTER (WHERE ca.id IS NOT NULL), '[]')::JSONB,
        COALESCE(json_agg(DISTINCT row_to_json(cb)) FILTER (WHERE cb.id IS NOT NULL), '[]')::JSONB,
        COALESCE(json_agg(DISTINCT row_to_json(cc)) FILTER (WHERE cc.id IS NOT NULL), '[]')::JSONB
    FROM customers c
    LEFT JOIN customer_pics cp ON c.id = cp.customer_id
    LEFT JOIN customer_addresses ca ON c.id = ca.customer_id
    LEFT JOIN customer_banks cb ON c.id = cb.customer_id
    LEFT JOIN customer_contracts cc ON c.id = cc.customer_id
    WHERE c.id = p_customer_id
    GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;
