CREATE TYPE "public"."category_type" AS ENUM('product', 'supplier');--> statement-breakpoint
CREATE TYPE "public"."customer_type" AS ENUM('individual', 'corporate');--> statement-breakpoint
CREATE TYPE "public"."doc_status" AS ENUM('draft', 'pending_approval', 'approved', 'rejected', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" "category_type" NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contract_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid,
	"product_id" uuid,
	"special_price" numeric(15, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"label" varchar(100) NOT NULL,
	"address" text NOT NULL,
	"is_primary" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "customer_banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"bank_name" varchar(100) NOT NULL,
	"account_number" varchar(50) NOT NULL,
	"account_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"contract_number" varchar(100) NOT NULL,
	"contract_name" varchar(255) NOT NULL,
	"pic_id" uuid,
	"file_url" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "customer_contracts_contract_number_unique" UNIQUE("contract_number")
);
--> statement-breakpoint
CREATE TABLE "customer_pics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"name" varchar(255) NOT NULL,
	"position" varchar(100),
	"email" varchar(255),
	"phone" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" varchar(20) NOT NULL,
	"type" "customer_type" NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"status" "status" DEFAULT 'active',
	"is_allowed" boolean DEFAULT true,
	"has_contract" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "customers_customer_id_unique" UNIQUE("customer_id")
);
--> statement-breakpoint
CREATE TABLE "delivery_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delivery_order_id" uuid,
	"sales_order_item_id" uuid,
	"product_id" uuid,
	"qty" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sales_order_id" uuid,
	"number" varchar(50) NOT NULL,
	"date" date NOT NULL,
	"driver_name" varchar(255),
	"vehicle_number" varchar(50),
	"delivery_date" date,
	"grn_file_url" text,
	"status" "doc_status" DEFAULT 'draft',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "delivery_orders_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "global_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(50) NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "global_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "internal_pics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "internal_pics_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sales_order_id" uuid,
	"number" varchar(50) NOT NULL,
	"date" date NOT NULL,
	"due_date" date NOT NULL,
	"subtotal" numeric(15, 2) NOT NULL,
	"vat_rate" numeric(5, 2) DEFAULT '11.00',
	"vat_amount" numeric(15, 2) NOT NULL,
	"grand_total" numeric(15, 2) NOT NULL,
	"amount_paid" numeric(15, 2) DEFAULT '0',
	"status" varchar(20) DEFAULT 'unpaid',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand" varchar(100),
	"category_id" uuid,
	"supplier_id" uuid,
	"status" "status" DEFAULT 'active',
	"selling_price" numeric(15, 2) NOT NULL,
	"purchase_price" numeric(15, 2),
	"unit" varchar(50) NOT NULL,
	"initial_stock" integer DEFAULT 0,
	"current_stock" integer DEFAULT 0,
	"min_stock_limit" integer DEFAULT 5,
	"is_contract_product" boolean DEFAULT false,
	"image_url" text,
	"product_url" text,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "quotation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quotation_id" uuid,
	"product_id" uuid,
	"qty" integer NOT NULL,
	"unit_price" numeric(15, 2) NOT NULL,
	"total_price" numeric(15, 2) NOT NULL,
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" varchar(50) NOT NULL,
	"date" date NOT NULL,
	"valid_from" date NOT NULL,
	"valid_until" date NOT NULL,
	"has_rfq" boolean DEFAULT false,
	"rfq_number" varchar(100),
	"rfq_title" varchar(255),
	"rfq_file_url" text,
	"customer_id" uuid,
	"customer_pic_id" uuid,
	"customer_address_id" uuid,
	"internal_pic_id" uuid,
	"subtotal" numeric(15, 2) NOT NULL,
	"vat_rate" numeric(5, 2) DEFAULT '11.00',
	"vat_amount" numeric(15, 2) NOT NULL,
	"grand_total" numeric(15, 2) NOT NULL,
	"status" "doc_status" DEFAULT 'pending_approval',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "quotations_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid,
	"number" varchar(50) NOT NULL,
	"date" date NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"amount_words" text,
	"payment_method" varchar(50),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "receipts_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "sales_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sales_order_id" uuid,
	"product_id" uuid,
	"qty" integer NOT NULL,
	"unit_price" numeric(15, 2) NOT NULL,
	"total_price" numeric(15, 2) NOT NULL,
	"delivered_qty" integer DEFAULT 0,
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "sales_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quotation_id" uuid,
	"number" varchar(50) NOT NULL,
	"date" date NOT NULL,
	"customer_id" uuid,
	"customer_address_id" uuid,
	"subtotal" numeric(15, 2) NOT NULL,
	"vat_rate" numeric(5, 2) DEFAULT '11.00',
	"vat_amount" numeric(15, 2) NOT NULL,
	"grand_total" numeric(15, 2) NOT NULL,
	"status" "doc_status" DEFAULT 'pending_approval',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sales_orders_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"category_id" uuid,
	"status" "status" DEFAULT 'active',
	"pic_name" varchar(255),
	"pic_email" varchar(255),
	"pic_phone" varchar(20),
	"office_address" text,
	"warehouse_address" text,
	"store_url" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transaction_sequences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"last_sequence" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contract_prices" ADD CONSTRAINT "contract_prices_contract_id_customer_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."customer_contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_prices" ADD CONSTRAINT "contract_prices_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_banks" ADD CONSTRAINT "customer_banks_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_contracts" ADD CONSTRAINT "customer_contracts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_contracts" ADD CONSTRAINT "customer_contracts_pic_id_customer_pics_id_fk" FOREIGN KEY ("pic_id") REFERENCES "public"."customer_pics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_pics" ADD CONSTRAINT "customer_pics_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_order_items" ADD CONSTRAINT "delivery_order_items_delivery_order_id_delivery_orders_id_fk" FOREIGN KEY ("delivery_order_id") REFERENCES "public"."delivery_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_order_items" ADD CONSTRAINT "delivery_order_items_sales_order_item_id_sales_order_items_id_fk" FOREIGN KEY ("sales_order_item_id") REFERENCES "public"."sales_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_order_items" ADD CONSTRAINT "delivery_order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_orders" ADD CONSTRAINT "delivery_orders_sales_order_id_sales_orders_id_fk" FOREIGN KEY ("sales_order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_sales_order_id_sales_orders_id_fk" FOREIGN KEY ("sales_order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_customer_pic_id_customer_pics_id_fk" FOREIGN KEY ("customer_pic_id") REFERENCES "public"."customer_pics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_customer_address_id_customer_addresses_id_fk" FOREIGN KEY ("customer_address_id") REFERENCES "public"."customer_addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_internal_pic_id_internal_pics_id_fk" FOREIGN KEY ("internal_pic_id") REFERENCES "public"."internal_pics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_sales_order_id_sales_orders_id_fk" FOREIGN KEY ("sales_order_id") REFERENCES "public"."sales_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_customer_address_id_customer_addresses_id_fk" FOREIGN KEY ("customer_address_id") REFERENCES "public"."customer_addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;