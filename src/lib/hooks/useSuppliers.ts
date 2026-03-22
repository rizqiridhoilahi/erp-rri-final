import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Supplier, Category } from '@/db/schema'

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          category:categories(id, name)
        `)
        .order('name')
      
      if (error) throw error
      
      return data.map(s => ({
        ...s,
        categoryId: s.category_id,
        picName: s.pic_name,
        picEmail: s.pic_email,
        picPhone: s.pic_phone,
        officeAddress: s.office_address,
        warehouseAddress: s.warehouse_address,
        storeUrl: s.store_url,
      })) as (Supplier & { category: Category | null })[]
    },
  })
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Supplier & { category: Category | null }
    },
    enabled: !!id,
  })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (supplier: Record<string, unknown>) => {
      const dbData: Record<string, unknown> = {
        name: supplier.name,
        status: supplier.status,
        pic_name: supplier.picName,
        pic_email: supplier.picEmail,
        pic_phone: supplier.picPhone,
        office_address: supplier.officeAddress,
        warehouse_address: supplier.warehouseAddress,
        store_url: supplier.storeUrl,
        notes: supplier.notes,
      }
      
      if (supplier.categoryId) {
        dbData.category_id = supplier.categoryId
      }
      
      const { data, error } = await supabase
        .from('suppliers')
        .insert(dbData)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase insert error:', error)
        throw error
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...supplier }: Record<string, unknown> & { id: string }) => {
      const dbData: Record<string, unknown> = {
        name: supplier.name,
        status: supplier.status,
        pic_name: supplier.picName,
        pic_email: supplier.picEmail,
        pic_phone: supplier.picPhone,
        office_address: supplier.officeAddress,
        warehouse_address: supplier.warehouseAddress,
        store_url: supplier.storeUrl,
        notes: supplier.notes,
      }
      
      if (supplier.categoryId) {
        dbData.category_id = supplier.categoryId
      }
      
      const { data, error } = await supabase
        .from('suppliers')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    },
  })
}
