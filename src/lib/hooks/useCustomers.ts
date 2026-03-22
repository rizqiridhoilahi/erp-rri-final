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
        customerId: c.customer_id,
        isAllowed: c.is_allowed,
        hasContract: c.has_contract,
        picCount: (c.pics as unknown as { count: number }[])?.[0]?.count ?? 0,
        addressCount: (c.addresses as unknown as { count: number }[])?.[0]?.count ?? 0,
        hasContractFlag: ((c.contracts as unknown as { id: string }[]) ?? []).length > 0,
      })) as (Customer & { picCount: number; addressCount: number; hasContract: boolean; hasContractFlag?: boolean })[]
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
    mutationFn: async (customer: Record<string, unknown>) => {
      const dbData: Record<string, unknown> = {
        type: customer.type,
        name: customer.name,
        email: customer.email || null,
        phone: customer.phone || null,
        notes: customer.notes || null,
        is_allowed: customer.isAllowed ?? true,
        has_contract: customer.hasContract ?? false,
      }
      
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert(dbData)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase create customer error:', error)
        throw error
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
    mutationFn: async ({ id, ...customer }: Record<string, unknown> & { id: string }) => {
      const dbData: Record<string, unknown> = {
        type: customer.type,
        name: customer.name,
        email: customer.email || null,
        phone: customer.phone || null,
        notes: customer.notes || null,
        is_allowed: customer.isAllowed ?? true,
        has_contract: customer.hasContract ?? false,
      }
      
      const { data, error } = await supabase
        .from('customers')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase update customer error:', error)
        throw error
      }
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
