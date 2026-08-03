import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BioLink {
  id: string;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useBioLinks(activeOnly = false) {
  return useQuery({
    queryKey: ["bio-links", activeOnly],
    queryFn: async () => {
      let query = supabase.from("bio_links").select("*").order("sort_order", { ascending: true });
      if (activeOnly) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as BioLink[];
    },
  });
}

export function useCreateBioLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Partial<BioLink>) => {
      const { error } = await supabase.from("bio_links").insert(values as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bio-links"] });
      toast.success("Link criado!");
    },
    onError: (e: any) => toast.error(e.message || "Erro ao criar link"),
  });
}

export function useUpdateBioLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: Partial<BioLink> & { id: string }) => {
      const { error } = await supabase.from("bio_links").update(values as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bio-links"] });
    },
    onError: (e: any) => toast.error(e.message || "Erro ao salvar link"),
  });
}

export function useDeleteBioLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bio_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bio-links"] });
      toast.success("Link excluído");
    },
    onError: (e: any) => toast.error(e.message || "Erro ao excluir link"),
  });
}
