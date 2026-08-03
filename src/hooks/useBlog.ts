import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, getPublicImageUrl } from "@/lib/supabase";
import { toast } from "sonner";

function transformPost(post: any) {
  return {
    ...post,
    cover_image: post.cover_image ? getPublicImageUrl(post.cover_image) : null,
  };
}

export function useBlogPosts(publishedOnly = true) {
  return useQuery({
    queryKey: ["blog-posts", publishedOnly],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (publishedOnly) {
        query = query.eq("is_published", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data?.map(transformPost) || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;
      return data ? transformPost(data) : null;
    },
    enabled: !!slug,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: any) => {
      const { error } = await supabase.from("blog_posts").insert(post);
      if (error) throw error;
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
      const { error } = await supabase.from("blog_posts").update(updates).eq("id", id);
      if (error) throw error;
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
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Post excluído!");
    },
    onError: () => toast.error("Erro ao excluir post"),
  });
}
