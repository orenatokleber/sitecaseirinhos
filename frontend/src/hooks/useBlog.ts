import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { getPublicImageUrl } from "@/lib/supabase";
import { toast } from "sonner";

function transformPost(post: any) {
  return {
    ...post,
    cover_image: post.coverImage ? getPublicImageUrl(post.coverImage) : null,
  };
}

export function useBlogPosts(publishedOnly = true) {
  return useQuery({
    queryKey: ["blog-posts", publishedOnly],
    queryFn: async () => {
      const data = await apiClient.get(`/api/blog/posts?publishedOnly=${publishedOnly}`);
      return (data || []).map(transformPost);
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const data = await apiClient.get(`/api/blog/posts/${slug}`);
      return data ? transformPost(data) : null;
    },
    enabled: !!slug,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: any) => {
      await apiClient.post("/api/blog/posts", post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Post criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar post"),
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      await apiClient.post("/api/blog/posts", { id, ...updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Post atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar post"),
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/blog/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Post excluído!");
    },
    onError: () => toast.error("Erro ao excluir post"),
  });
}
