import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, getPublicImageUrl } from "@/lib/supabase";
import { toast } from "sonner";

export type PopupType = "banner" | "promo" | "coupon" | "notice";

export interface DeliveryPopup {
  id: string;
  title: string;
  description: string | null;
  popup_type: PopupType;
  image_url: string | null;
  coupon_code: string | null;
  discount_text: string | null;
  bg_color: string;
  text_color: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useDeliveryPopups(activeOnly = true) {
  return useQuery({
    queryKey: ["delivery-popups", activeOnly],
    queryFn: async () => {
      let query = supabase
        .from("delivery_popups")
        .select("*")
        .order("sort_order", { ascending: true });

      if (activeOnly) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data as DeliveryPopup[]).map((p) => ({
        ...p,
        image_url: p.image_url ? getPublicImageUrl(p.image_url) : null,
      }));
    },
  });
}

export function useCreateDeliveryPopup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (popup: Partial<DeliveryPopup>) => {
      const { error } = await supabase.from("delivery_popups").insert(popup as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-popups"] });
      toast.success("Popup criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar popup"),
  });
}

export function useUpdateDeliveryPopup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DeliveryPopup> }) => {
      const { error } = await supabase
        .from("delivery_popups")
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-popups"] });
      toast.success("Popup atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar popup"),
  });
}

export function useDeleteDeliveryPopup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("delivery_popups").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-popups"] });
      toast.success("Popup excluído!");
    },
    onError: () => toast.error("Erro ao excluir popup"),
  });
}
