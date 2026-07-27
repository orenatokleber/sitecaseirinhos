import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { getPublicImageUrl } from "@/lib/supabase";
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
      const data = await apiClient.get(`/api/site/popups?activeOnly=${activeOnly}`) as DeliveryPopup[];
      return data.map((p) => ({
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
      await apiClient.post("/api/site/popups", popup);
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
      await apiClient.post("/api/site/popups", { id, ...updates });
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
      await apiClient.delete(`/api/site/popups/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["delivery-popups"] });
      toast.success("Popup excluído!");
    },
    onError: () => toast.error("Erro ao excluir popup"),
  });
}
