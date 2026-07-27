import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useApprovedComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      return await apiClient.get(`/api/blog/comments?approvedOnly=true&postId=${postId}`);
    },
    enabled: !!postId,
  });
}

export function useSubmitComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment: { post_id: string; author_name: string; content: string }) => {
      // Map frontend snake_case to backend camelCase
      await apiClient.post("/api/blog/comments", {
        postId: comment.post_id,
        authorName: comment.author_name,
        content: comment.content,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.post_id] });
    },
  });
}

export function useAllComments() {
  return useQuery({
    queryKey: ["admin-comments"],
    queryFn: async () => {
      return await apiClient.get("/api/blog/comments");
    },
  });
}

export function useApproveComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      await apiClient.put(`/api/blog/comments/${id}`, { is_approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/blog/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
  });
}
