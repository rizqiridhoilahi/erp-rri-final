import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { InternalPic } from '@/db/schema'

export function useInternalPics() {
  return useQuery({
    queryKey: ['internal-pics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('internal_pics')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data as InternalPic[]
    },
  })
}

export function useInternalPic(id: string) {
  return useQuery({
    queryKey: ['internal-pics', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('internal_pics')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as InternalPic
    },
    enabled: !!id,
  })
}

export function useCreateInternalPic() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (pic: Record<string, unknown>) => {
      const dbData: Record<string, unknown> = {
        name: pic.name,
        position: pic.position,
        email: pic.email,
        phone: pic.phone || null,
      }
      
      const { data, error } = await supabase
        .from('internal_pics')
        .insert(dbData)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase create internal pic error:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-pics'] })
    },
  })
}

export function useUpdateInternalPic() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...pic }: Record<string, unknown> & { id: string }) => {
      const dbData: Record<string, unknown> = {
        name: pic.name,
        position: pic.position,
        email: pic.email,
        phone: pic.phone || null,
      }
      
      const { data, error } = await supabase
        .from('internal_pics')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase update internal pic error:', error)
        throw error
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-pics'] })
    },
  })
}

export function useDeleteInternalPic() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('internal_pics')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-pics'] })
    },
  })
}
