import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase
        .from("redirects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Redirect[];
    },
  });
}

export function useRedirectBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["redirect", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("redirects")
        .select("*")
        .eq("slug", slug!)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data as Redirect | null;
    },
  });
}

export function useRedirectClicks(redirectId: string | undefined) {
  return useQuery({
    queryKey: ["redirect-clicks", redirectId],
    enabled: !!redirectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("redirect_clicks")
        .select("*")
        .eq("redirect_id", redirectId!)
        .order("clicked_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as RedirectClick[];
    },
  });
}

export function useCreateRedirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { slug: string; destination_url: string; title?: string }) => {
      const { data, error } = await supabase.from("redirects").insert(values).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });
}

export function useUpdateRedirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; slug?: string; destination_url?: string; title?: string; is_active?: boolean }) => {
      const { error } = await supabase.from("redirects").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });
}

export function useDeleteRedirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("redirects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redirects"] }),
  });
}

export async function trackClick(redirectId: string) {
  await Promise.all([
    supabase.from("redirect_clicks").insert({
      redirect_id: redirectId,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    }),
    supabase.rpc("increment_redirect_clicks", { redirect_id: redirectId }),
  ]);
}
