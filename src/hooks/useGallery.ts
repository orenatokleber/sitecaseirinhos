import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, getPublicImageUrl } from "@/lib/supabase";
import { toast } from "sonner";

export function useGalleryImages(activeOnly = true) {
  return useQuery({
    queryKey: ['gallery-images', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data?.map(img => ({
        ...img,
        image_url: img.image_url ? getPublicImageUrl(img.image_url) : '',
      })) || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCreateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image: { image_url: string; title?: string; alt_text?: string; category?: string }) => {
      const { error } = await supabase.from('gallery_images').insert(image);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Imagem adicionada!');
    },
    onError: () => toast.error('Erro ao adicionar imagem'),
  });
}

export function useUpdateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from('gallery_images').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Imagem atualizada!');
    },
    onError: () => toast.error('Erro ao atualizar imagem'),
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Imagem excluída!');
    },
    onError: () => toast.error('Erro ao excluir imagem'),
  });
}
