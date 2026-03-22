import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageWrapper } from '@/components/layout'
import Dashboard from '@/pages/dashboard/Dashboard'
import Products from '@/pages/master-data/products/Products'
import Customers from '@/pages/master-data/customers/Customers'
import Suppliers from '@/pages/master-data/suppliers/Suppliers'
import InternalPics from '@/pages/master-data/internal-pics/InternalPics'
import Quotations from '@/pages/sales/quotations/Quotations'
import SalesOrders from '@/pages/sales/sales-orders/SalesOrders'
import DeliveryOrders from '@/pages/sales/delivery-orders/DeliveryOrders'
import Invoices from '@/pages/sales/invoices/Invoices'
import Receipts from '@/pages/sales/receipts/Receipts'
import Settings from '@/pages/settings/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageWrapper />}>
          <Route path="/" element={<Dashboard />} />
          
          {/* Master Data */}
          <Route path="/master-data/products" element={<Products />} />
          <Route path="/master-data/customers" element={<Customers />} />
          <Route path="/master-data/suppliers" element={<Suppliers />} />
          <Route path="/master-data/internal-pics" element={<InternalPics />} />
          
          {/* Sales */}
          <Route path="/sales/quotations" element={<Quotations />} />
          <Route path="/sales/sales-orders" element={<SalesOrders />} />
          <Route path="/sales/delivery-orders" element={<DeliveryOrders />} />
          <Route path="/sales/invoices" element={<Invoices />} />
          <Route path="/sales/receipts" element={<Receipts />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
