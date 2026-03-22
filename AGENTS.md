# AGENTS.md - ERP RRI Development Guidelines

## Project Overview
ERP System for Radio Republik Indonesia (PT. Rizqi Ridho Ilahi)
- **Stack:** Vite + React + TypeScript + Tailwind CSS + Supabase + Drizzle ORM
- **Repo:** https://github.com/rizqiridhoilahi/erp-rri-final

---

## Build & Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Preview production build locally
npm run preview

# Database operations
npm run db:generate    # Generate Drizzle migrations
npm run db:push       # Push schema to Supabase
npm run db:studio     # Open Drizzle Studio
```

### Environment Variables
Create `.env` from `.env.example`:
```
VITE_SUPABASE_URL=https://lgwxelbaxivlutvvmnel.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.host:5432/postgres
```

---

## Code Style Guidelines

### TypeScript Conventions

1. **Use strict TypeScript** - No `any` types allowed
2. **Define explicit interfaces** for all data structures
3. **Use generics** for reusable components (e.g., `DataTable<T>`)
4. **Export types** alongside components for better DX

```typescript
// ✅ Good
interface Product {
  id: string
  name: string
  price: number
}

// ❌ Bad
const product: any = { ... }
```

### Component Patterns

1. **Functional components only** - No class components
2. **Use forwardRef sparingly** - Only for form inputs
3. **Colocate types with components** - Export in same file
4. **Use generic types** for shared components

```typescript
// ✅ Component with props interface
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>
}
```

### File Naming & Structure

```
src/
├── components/
│   ├── forms/           # Form inputs (Input, Select, Button, etc.)
│   ├── layout/          # Sidebar, TopBar, PageWrapper
│   └── shared/          # DataTable, Modal, Badge, etc.
├── pages/               # Route pages (one file per page)
│   ├── dashboard/
│   ├── master-data/     # products, customers, suppliers, internal-pics
│   └── sales/          # quotations, orders, invoices, receipts
├── db/                  # Drizzle schema
├── lib/
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # Helper functions
└── types/               # Shared types
```

### Import Order

1. React/core imports
2. Third-party libraries (lucide-react, react-router-dom)
3. Internal imports (@/lib, @/components)
4. Types imports

```typescript
// 1. React
import { useState, useEffect } from 'react'

// 2. Third-party
import { Plus, Edit } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

// 3. Internal
import { Button } from '@/components/forms'
import { DataTable, Modal } from '@/components/shared'
import { formatCurrency } from '@/lib/utils'
```

### Tailwind CSS Guidelines

1. **Use design system colors** - Custom RRI palette:
   - Primary: `primary`, `primary-container`
   - Surface: `surface`, `surface-container-low`, `surface-container-lowest`
   - Text: `on-surface`, `on-surface-variant`

2. **Avoid hardcoded colors** - Use semantic tokens:
   ```html
   <!-- ✅ Good -->
   <div className="bg-surface-container-lowest text-on-surface">
   
   <!-- ❌ Bad -->
   <div className="bg-white text-gray-900">
   ```

3. **Spacing scale** - Use consistent values (4, 6, 8, 12 units)

4. **Typography** - Use design system fonts:
   - Headlines: `font-headline` (Manrope)
   - Body: `font-body` (Inter)

### Database Schema (Drizzle ORM)

1. **Use UUID primary keys** with `defaultRandom()`
2. **Define enums** for status fields
3. **Use `relations()`** for table relationships
4. **Export types** for all tables

```typescript
// ✅ Good schema pattern
export const statusEnum = pgEnum('status', ['active', 'inactive'])

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  status: statusEnum('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Export type
export type Product = typeof products.$inferSelect
```

---

## Error Handling

1. **Handle loading states** - Show spinners during async operations
2. **Display empty states** - "Tidak ada data" for empty lists
3. **Use try/catch** for API calls
4. **Validate form inputs** - Show inline error messages

```typescript
// ✅ Loading state
if (isLoading) {
  return <LoadingSpinner />
}

// ✅ Error handling
try {
  const { data } = await supabase.from('products').select()
} catch (error) {
  console.error('Failed to fetch:', error)
}
```

---

## Form Validation

1. **Mark required fields** with red asterisk `*`
2. **Show inline errors** below inputs
3. **Use descriptive labels** (uppercase, tracking-wider)

```tsx
<Input
  label="Nama Produk"
  error={errors.name}
  required
/>
```

---

## Component Library Usage

### Shared Components (use these instead of raw HTML)
- `<DataTable>` - For lists with pagination, sorting, search
- `<Modal>` - For dialogs and confirmations
- `<SlideOver>` - For side panels (edit forms)
- `<SearchInput>` - Debounced search with clear button
- `<StatusBadge>` - For status indicators
- `<BentoCard>` - For dashboard stats
- `<DataPulse>` - For live indicators

### Form Components
- `<Input>` - Text inputs with label
- `<Select>` - Dropdowns with placeholder
- `<Textarea>` - Multi-line text
- `<CurrencyInput>` - IDR formatted number input
- `<Button>` - Styled buttons with variants

---

## Database Conventions

1. **Auto-generate UUID** for all primary keys
2. **Use snake_case** for database columns
3. **Add timestamps** - `createdAt`, `updatedAt`
4. **Create indexes** for foreign keys
5. **Use RLS** - Row Level Security enabled

### Document Numbering Format
```
RRI-SPH-YY-MM-XXX  (Quotation)
RRI-SO-YY-MM-XXX  (Sales Order)
RRI-SJ-YY-MM-XXX  (Surat Jalan)
RRI-INV-YY-MM-XXX (Invoice)
RRI-KWT-YY-MM-XXX (Kwitansi)
```

### Customer ID Format
```
CUST-XXX (e.g., CUST-001)
```

---

## UI/UX Guidelines

1. **No 1px borders** - Use tonal shifts (surface hierarchy)
2. **Use glassmorphism** for floating elements
3. **Primary gradient** - `linear-gradient(135deg, #00478d, #005eb8)`
4. **Tables without dividers** - Use hover states instead
5. **Uppercase headers** in tables
6. **Status badges** for document states

---

## Testing Guidelines

1. **Use React Testing Library** for component tests
2. **Mock Supabase calls** for unit tests
3. **Test critical paths** - Auth, form submissions
4. **E2E tests** for user workflows

---

## Supabase Integration

1. **Client-side** - Use `@supabase/supabase-js`
2. **Server-side** - Use Service Role for admin operations
3. **RLS Policies** - Define for all tables
4. **Storage Buckets**:
   - `public-assets` - Product images
   - `private-docs` - Contracts, RFQ files

---

## Important Notes

1. **PRD.md is the source of truth** - Always reference for business logic
2. **Design files in `stitch/`** - Use for UI/UX reference
3. **No authentication yet** - Open access (add later)
4. **PDF generation** - Using @react-pdf/renderer
5. **Image compression** - Use browser-image-compression library

---

## MCP Servers

This project is configured with MCP (Model Context Protocol) servers for enhanced development capabilities.

### Available MCP Servers

| Server | Purpose | Status |
|--------|---------|--------|
| **supabase** | Database tools, schema viewing, query execution | ✅ Active |
| **context7** | Documentation search (React, Tailwind, Supabase, Drizzle) | ✅ Active |

### Configuration File
```
~/.config/opencode/opencode.json
```

### Supabase MCP Connection

The Supabase MCP server is connected to project: `lgwxelbaxivlutvvmnel`

**Connection URL:**
```
https://mcp.supabase.com/mcp?project_ref=lgwxelbaxivlutvvmnel
```

When working with this project:

```
Use `supabase` MCP tools to:
- View database schema and tables
- Execute queries on Supabase
- Check table data and relationships
- View RLS policies and security
```

### Context7 MCP Usage

```
When you need to search docs, use `context7` tools to find relevant information.

Examples:
- "Search Tailwind CSS v4 documentation for custom color configuration"
- "Find Supabase auth documentation for email login"
- "Search Drizzle ORM for migration commands"
- "Look up React Query useMutation examples"
```

### MCP Authentication

If MCP authentication is needed, run:
```bash
opencode mcp auth <server-name>
opencode mcp list  # List all MCP servers and status
```

### Quick Reference for Agents

When working in this codebase:
1. For database operations → Use `supabase` MCP tools
2. For library documentation → Use `context7` MCP tools
3. Always check PRD.md for business logic
4. Follow design system from `stitch/` folder
