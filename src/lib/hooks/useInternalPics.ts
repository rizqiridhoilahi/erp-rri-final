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
    mutationFn: async (pic: Partial<InternalPic>) => {
      const { data, error } = await supabase
        .from('internal_pics')
        .insert(pic)
        .select()
        .single()
      
      if (error) throw error
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
    mutationFn: async ({ id, ...pic }: Partial<InternalPic> & { id: string }) => {
      const { data, error } = await supabase
        .from('internal_pics')
        .update(pic)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
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
