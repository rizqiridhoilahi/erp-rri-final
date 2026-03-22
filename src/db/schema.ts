import { pgTable, uuid, text, varchar, integer, numeric, timestamp, boolean, pgEnum, date } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const customerTypeEnum = pgEnum('customer_type', ['individual', 'corporate'])
export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived'])
export const docStatusEnum = pgEnum('doc_status', ['draft', 'pending_approval', 'approved', 'rejected', 'cancelled', 'completed'])
export const categoryTypeEnum = pgEnum('category_type', ['product', 'supplier'])

// 1. Global Settings
export const globalSettings = pgTable('global_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 50 }).unique().notNull(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// 2. Categories
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: categoryTypeEnum('type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// 3. Internal PICs
export const internalPics = pgTable('internal_pics', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// 4. Suppliers
export const suppliers = pgTable('suppliers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  status: statusEnum('status').default('active'),
  picName: varchar('pic_name', { length: 255 }),
  picEmail: varchar('pic_email', { length: 255 }),
  picPhone: varchar('pic_phone', { length: 20 }),
  officeAddress: text('office_address'),
  warehouseAddress: text('warehouse_address'),
  storeUrl: text('store_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// 5. Products
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  sku: varchar('sku', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 100 }),
  categoryId: uuid('category_id').references(() => categories.id),
  supplierId: uuid('supplier_id').references(() => suppliers.id),
  status: statusEnum('status').default('active'),
  sellingPrice: numeric('selling_price', { precision: 15, scale: 2 }).notNull(),
  purchasePrice: numeric('purchase_price', { precision: 15, scale: 2 }),
  unit: varchar('unit', { length: 50 }).notNull(),
  initialStock: integer('initial_stock').default(0),
  currentStock: integer('current_stock').default(0),
  minStockLimit: integer('min_stock_limit').default(5),
  isContractProduct: boolean('is_contract_product').default(false),
  imageUrl: text('image_url'),
  productUrl: text('product_url'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
})

// 6. Customers
export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: varchar('customer_id', { length: 20 }).unique().notNull(),
  type: customerTypeEnum('type').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  status: statusEnum('status').default('active'),
  isAllowed: boolean('is_allowed').default(true),
  hasContract: boolean('has_contract').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// 7. Customer PICs
export const customerPics = pgTable('customer_pics', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  position: varchar('position', { length: 100 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
})

// 8. Customer Addresses
export const customerAddresses = pgTable('customer_addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 100 }).notNull(),
  address: text('address').notNull(),
  isPrimary: boolean('is_primary').default(false),
})

// 9. Customer Banks
export const customerBanks = pgTable('customer_banks', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'cascade' }),
  bankName: varchar('bank_name', { length: 100 }).notNull(),
  accountNumber: varchar('account_number', { length: 50 }).notNull(),
  accountName: varchar('account_name', { length: 255 }).notNull(),
})

// 10. Customer Contracts
export const customerContracts = pgTable('customer_contracts', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  contractNumber: varchar('contract_number', { length: 100 }).unique().notNull(),
  contractName: varchar('contract_name', { length: 255 }).notNull(),
  picId: uuid('pic_id').references(() => customerPics.id),
  fileUrl: text('file_url'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// 11. Contract Prices
export const contractPrices = pgTable('contract_prices', {
  id: uuid('id').defaultRandom().primaryKey(),
  contractId: uuid('contract_id').references(() => customerContracts.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id),
  specialPrice: numeric('special_price', { precision: 15, scale: 2 }).notNull(),
})

// 12. Quotations (SPH)
export const quotations = pgTable('quotations', {
  id: uuid('id').defaultRandom().primaryKey(),
  number: varchar('number', { length: 50 }).unique().notNull(),
  date: date('date').notNull(),
  validFrom: date('valid_from').notNull(),
  validUntil: date('valid_until').notNull(),
  hasRfq: boolean('has_rfq').default(false),
  rfqNumber: varchar('rfq_number', { length: 100 }),
  rfqTitle: varchar('rfq_title', { length: 255 }),
  rfqFileUrl: text('rfq_file_url'),
  customerId: uuid('customer_id').references(() => customers.id),
  customerPicId: uuid('customer_pic_id').references(() => customerPics.id),
  customerAddressId: uuid('customer_address_id').references(() => customerAddresses.id),
  internalPicId: uuid('internal_pic_id').references(() => internalPics.id),
  subtotal: numeric('subtotal', { precision: 15, scale: 2 }).notNull(),
  vatRate: numeric('vat_rate', { precision: 5, scale: 2 }).default('11.00'),
  vatAmount: numeric('vat_amount', { precision: 15, scale: 2 }).notNull(),
  grandTotal: numeric('grand_total', { precision: 15, scale: 2 }).notNull(),
  status: docStatusEnum('status').default('pending_approval'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// 13. Quotation Items
export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id').references(() => quotations.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id),
  qty: integer('qty').notNull(),
  unitPrice: numeric('unit_price', { precision: 15, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 15, scale: 2 }).notNull(),
  remarks: text('remarks'),
})

// 14. Sales Orders
export const salesOrders = pgTable('sales_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  quotationId: uuid('quotation_id').references(() => quotations.id),
  number: varchar('number', { length: 50 }).unique().notNull(),
  date: date('date').notNull(),
  customerId: uuid('customer_id').references(() => customers.id),
  customerAddressId: uuid('customer_address_id').references(() => customerAddresses.id),
  subtotal: numeric('subtotal', { precision: 15, scale: 2 }).notNull(),
  vatRate: numeric('vat_rate', { precision: 5, scale: 2 }).default('11.00'),
  vatAmount: numeric('vat_amount', { precision: 15, scale: 2 }).notNull(),
  grandTotal: numeric('grand_total', { precision: 15, scale: 2 }).notNull(),
  status: docStatusEnum('status').default('pending_approval'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// 15. Sales Order Items
export const salesOrderItems = pgTable('sales_order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  salesOrderId: uuid('sales_order_id').references(() => salesOrders.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id),
  qty: integer('qty').notNull(),
  unitPrice: numeric('unit_price', { precision: 15, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 15, scale: 2 }).notNull(),
  deliveredQty: integer('delivered_qty').default(0),
  remarks: text('remarks'),
})

// 16. Delivery Orders (Surat Jalan)
export const deliveryOrders = pgTable('delivery_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  salesOrderId: uuid('sales_order_id').references(() => salesOrders.id),
  number: varchar('number', { length: 50 }).unique().notNull(),
  date: date('date').notNull(),
  driverName: varchar('driver_name', { length: 255 }),
  vehicleNumber: varchar('vehicle_number', { length: 50 }),
  deliveryDate: date('delivery_date'),
  grnFileUrl: text('grn_file_url'),
  status: docStatusEnum('status').default('draft'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// 17. Delivery Order Items
export const deliveryOrderItems = pgTable('delivery_order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  deliveryOrderId: uuid('delivery_order_id').references(() => deliveryOrders.id, { onDelete: 'cascade' }),
  salesOrderItemId: uuid('sales_order_item_id').references(() => salesOrderItems.id),
  productId: uuid('product_id').references(() => products.id),
  qty: integer('qty').notNull(),
})

// 18. Invoices
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  salesOrderId: uuid('sales_order_id').references(() => salesOrders.id),
  number: varchar('number', { length: 50 }).unique().notNull(),
  date: date('date').notNull(),
  dueDate: date('due_date').notNull(),
  subtotal: numeric('subtotal', { precision: 15, scale: 2 }).notNull(),
  vatRate: numeric('vat_rate', { precision: 5, scale: 2 }).default('11.00'),
  vatAmount: numeric('vat_amount', { precision: 15, scale: 2 }).notNull(),
  grandTotal: numeric('grand_total', { precision: 15, scale: 2 }).notNull(),
  amountPaid: numeric('amount_paid', { precision: 15, scale: 2 }).default('0'),
  status: varchar('status', { length: 20 }).default('unpaid'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// 19. Receipts (Kwitansi)
export const receipts = pgTable('receipts', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceId: uuid('invoice_id').references(() => invoices.id),
  number: varchar('number', { length: 50 }).unique().notNull(),
  date: date('date').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  amountWords: text('amount_words'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})

// 20. Transaction Sequences
export const transactionSequences = pgTable('transaction_sequences', {
  id: uuid('id').defaultRandom().primaryKey(),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  lastSequence: integer('last_sequence').default(0).notNull(),
})

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  suppliers: many(suppliers),
}))

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  quotationItems: many(quotationItems),
  contractPrices: many(contractPrices),
}))

export const customersRelations = relations(customers, ({ many }) => ({
  pics: many(customerPics),
  addresses: many(customerAddresses),
  banks: many(customerBanks),
  contracts: many(customerContracts),
}))

export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  customer: one(customers, {
    fields: [quotations.customerId],
    references: [customers.id],
  }),
  customerPic: one(customerPics, {
    fields: [quotations.customerPicId],
    references: [customerPics.id],
  }),
  customerAddress: one(customerAddresses, {
    fields: [quotations.customerAddressId],
    references: [customerAddresses.id],
  }),
  internalPic: one(internalPics, {
    fields: [quotations.internalPicId],
    references: [internalPics.id],
  }),
  items: many(quotationItems),
  salesOrders: many(salesOrders),
}))

// Type exports
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type Supplier = typeof suppliers.$inferSelect
export type NewSupplier = typeof suppliers.$inferInsert
export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
export type CustomerPic = typeof customerPics.$inferSelect
export type NewCustomerPic = typeof customerPics.$inferInsert
export type CustomerAddress = typeof customerAddresses.$inferSelect
export type NewCustomerAddress = typeof customerAddresses.$inferInsert
export type CustomerBank = typeof customerBanks.$inferSelect
export type NewCustomerBank = typeof customerBanks.$inferInsert
export type CustomerContract = typeof customerContracts.$inferSelect
export type NewCustomerContract = typeof customerContracts.$inferInsert
export type InternalPic = typeof internalPics.$inferSelect
export type NewInternalPic = typeof internalPics.$inferInsert
export type Quotation = typeof quotations.$inferSelect
export type NewQuotation = typeof quotations.$inferInsert
export type QuotationItem = typeof quotationItems.$inferSelect
export type NewQuotationItem = typeof quotationItems.$inferInsert
export type SalesOrder = typeof salesOrders.$inferSelect
export type NewSalesOrder = typeof salesOrders.$inferInsert
export type Invoice = typeof invoices.$inferSelect
export type NewInvoice = typeof invoices.$inferInsert
export type Receipt = typeof receipts.$inferSelect
export type NewReceipt = typeof receipts.$inferInsert
