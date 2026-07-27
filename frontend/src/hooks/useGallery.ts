import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { getPublicImageUrl } from "@/lib/supabase";
import { toast } from "sonner";

export function useGalleryImages(activeOnly = true) {
  return useQuery({
    queryKey: ['gallery-images', activeOnly],
    queryFn: async () => {
      const data = await apiClient.get(`/api/site/gallery?activeOnly=${activeOnly}`) as any[];
      return data.map(img => ({
        ...img,
        image_url: img.image_url ? getPublicImageUrl(img.image_url) : '',
      }));
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCreateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image: { image_url: string; title?: string; alt_text?: string; category?: string }) => {
      await apiClient.post("/api/site/gallery", image);
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
      await apiClient.post("/api/site/gallery", { id, ...updates });
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
      await apiClient.delete(`/api/site/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Imagem excluída!');
    },
    onError: () => toast.error('Erro ao excluir imagem'),
  });
}
