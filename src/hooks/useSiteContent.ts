import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, getPublicImageUrl } from "@/lib/supabase";
import { toast } from "sonner";

// Site Settings
export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      // Convert to key-value object
      const settings: Record<string, any> = {};
      data?.forEach(item => {
        settings[item.key] = item.value;
      });
      return settings;
    }
  });
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Configuração salva com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao salvar configuração');
    }
  });
}

// Site Sections
export function useSiteSections() {
  return useQuery({
    queryKey: ['site-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_sections')
        .select('*');
      
      if (error) throw error;
      
      // Convert to key-value object
      const sections: Record<string, any> = {};
      data?.forEach(item => {
        sections[item.section_key] = {
          ...item,
          image_url: item.image_url ? getPublicImageUrl(item.image_url) : null
        };
      });
      return sections;
    },
    staleTime: 0,
    gcTime: 0, // Don't cache old data
    refetchOnWindowFocus: true
  });
}

export function useUpdateSiteSection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sectionKey, updates }: { sectionKey: string; updates: any }) => {
      const { error } = await supabase
        .from('site_sections')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('section_key', sectionKey);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-sections'] });
      toast.success('Seção atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar seção');
    }
  });
}

// Products
export function useProducts(activeOnly = true) {
  return useQuery({
    queryKey: ['products', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(p => ({
        ...p,
        image_url: p.image_url ? getPublicImageUrl(p.image_url) : null
      })) || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: any) => {
      const { error } = await supabase.from('products').insert(product);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar produto');
    }
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar produto');
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto excluído!');
    },
    onError: () => {
      toast.error('Erro ao excluir produto');
    }
  });
}

// Testimonials
export function useTestimonials(activeOnly = true) {
  return useQuery({
    queryKey: ['testimonials', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (testimonial: any) => {
      const { error } = await supabase.from('testimonials').insert(testimonial);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Depoimento adicionado!');
    },
    onError: () => {
      toast.error('Erro ao adicionar depoimento');
    }
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Depoimento atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar depoimento');
    }
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Depoimento excluído!');
    },
    onError: () => {
      toast.error('Erro ao excluir depoimento');
    }
  });
}
