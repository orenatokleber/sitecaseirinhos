import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export interface Redirect {
  id: string;
  slug: string;
  destination_url: string;
  title: string | null;
  is_active: boolean;
  total_clicks: number;
  created_at: string;
  updated_at: string;
}

export interface RedirectClick {
  id: string;
  redirect_id: string;
  referrer: string | null;
  user_agent: string | null;
  clicked_at: string;
}

export function useRedirects() {
  return useQuery({
    queryKey: ["redirects"],
    queryFn: async () => {
      return await apiClient.get("/api/site/redirects") as Redirect[];
    },
  });
}

export function useRedirectBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["redirect", slug],
    enabled: !!slug,
    queryFn: async () => {
      const data = await apiClient.get(`/api/site/r/${slug}`);
      return {
        slug,
        destination_url: data.destination_url,
        // Mock properties for client compatibility
        id: slug, 
        is_active: true,
        total_clicks: 0,
        title: '',
        created_at: '',
        updated_at: ''
      } as Redirect;
    },
  });
}

export function useRedirectClicks(redirectId: string | undefined) {
  return useQuery({
    queryKey: ["redirect-clicks", redirectId],
    enabled: !!redirectId,
    queryFn: async () => {
      return [] as RedirectClick[];
    },
  });
}

export function useCreateRedirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { slug: string; destination_url: string; title?: string }) => {
      return await apiClient.post("/api/site/redirects", values);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });
}

export function useUpdateRedirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; slug?: string; destination_url?: string; title?: string; is_active?: boolean }) => {
      await apiClient.post("/api/site/redirects", { id, ...values });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });
}

export function useDeleteRedirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/site/redirects/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });
}

export async function trackClick(redirectId: string) {
  // Clicks are already tracked automatically on the backend during the useRedirectBySlug request
  return Promise.resolve();
}
