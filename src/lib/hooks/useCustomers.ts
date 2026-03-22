import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Customer, CustomerPic, CustomerAddress, CustomerBank, CustomerContract } from '@/db/schema'

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          pics:customer_pics(count),
          addresses:customer_addresses(count),
          contracts:customer_contracts(id)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return data.map(c => ({
        ...c,
        picCount: (c.pics as unknown as { count: number }[])?.[0]?.count ?? 0,
        addressCount: (c.addresses as unknown as { count: number }[])?.[0]?.count ?? 0,
        hasContract: ((c.contracts as unknown as { id: string }[]) ?? []).length > 0,
      })) as (Customer & { picCount: number; addressCount: number; hasContract: boolean })[]
    },
  })
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      const [{ data: pics }, { data: addresses }, { data: banks }, { data: contracts }] = await Promise.all([
        supabase.from('customer_pics').select('*').eq('customer_id', id),
        supabase.from('customer_addresses').select('*').eq('customer_id', id),
        supabase.from('customer_banks').select('*').eq('customer_id', id),
        supabase.from('customer_contracts').select('*').eq('customer_id', id),
      ])
      
      return {
        ...customer,
        pics: pics ?? [],
        addresses: addresses ?? [],
        banks: banks ?? [],
        contracts: contracts ?? [],
      } as Customer & { pics: CustomerPic[]; addresses: CustomerAddress[]; banks: CustomerBank[]; contracts: CustomerContract[] }
    },
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (customer: Partial<Customer> & { pics?: Partial<CustomerPic>[]; addresses?: Partial<CustomerAddress>[]; banks?: Partial<CustomerBank>[] }) => {
      const { pics, addresses, banks, ...customerData } = customer
      
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single()
      
      if (error) throw error
      
      if (pics && pics.length > 0) {
        const { error: picsError } = await supabase
          .from('customer_pics')
          .insert(pics.map(p => ({ ...p, customer_id: newCustomer.id })))
        if (picsError) throw picsError
      }
      
      if (addresses && addresses.length > 0) {
        const { error: addError } = await supabase
          .from('customer_addresses')
          .insert(addresses.map(a => ({ ...a, customer_id: newCustomer.id })))
        if (addError) throw addError
      }
      
      if (banks && banks.length > 0) {
        const { error: banksError } = await supabase
          .from('customer_banks')
          .insert(banks.map(b => ({ ...b, customer_id: newCustomer.id })))
        if (banksError) throw banksError
      }
      
      return newCustomer
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...customer }: Partial<Customer> & { id: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useCreateCustomerPic() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (pic: Partial<CustomerPic> & { customerId: string }) => {
      const { customerId, ...picData } = pic
      const { data, error } = await supabase
        .from('customer_pics')
        .insert({ ...picData, customer_id: customerId })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['customers', vars.customerId] })
    },
  })
}

export function useDeleteCustomerPic() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id }: { id: string; customerId: string }) => {
      const { error } = await supabase
        .from('customer_pics')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['customers', vars.customerId] })
    },
  })
}

export function useCreateCustomerAddress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (address: Partial<CustomerAddress> & { customerId: string }) => {
      const { customerId, ...addressData } = address
      const { data, error } = await supabase
        .from('customer_addresses')
        .insert({ ...addressData, customer_id: customerId })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['customers', vars.customerId] })
    },
  })
}

export function useDeleteCustomerAddress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id }: { id: string; customerId: string }) => {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['customers', vars.customerId] })
    },
  })
}
