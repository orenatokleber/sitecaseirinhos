import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, getPublicImageUrl } from "@/lib/supabase";
import { toast } from "sonner";

export type CakeSize = {
  id: string;
  code: string;
  name: string;
  ring_size: string | null;
  slices: number | null;
  weight_kg: number | null;
  sort_order: number;
  is_active: boolean;
};

export type CakeCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  type: "standard" | "addon";
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};


export type CakePrice = {
  id: string;
  category_id: string;
  size_id: string;
  price: number;
};

export type CakeFlavor = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export type CakeRectangular = {
  id: string;
  name: string;
  dimensions: string | null;
  slices: number | null;
  weight_kg: number | null;
  class1_price: number | null;
  class2_price: number | null;
  note: string | null;
  sort_order: number;
  is_active: boolean;
};

export type CakeDecoration = {
  id: string;
  title: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
};

const baseOpts = { staleTime: 0, refetchOnWindowFocus: true } as const;

// ============ SIZES ============
export function useCakeSizes(activeOnly = false) {
  return useQuery({
    queryKey: ["cake-sizes", activeOnly],
    queryFn: async () => {
      let q = supabase.from("cake_sizes" as any).select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as CakeSize[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakeSize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeSize> & { code: string; name: string }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("cake_sizes" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cake_sizes" as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-sizes"] });
      toast.success("Tamanho salvo");
    },
    onError: (e: any) => toast.error("Erro ao salvar: " + e.message),
  });
}

export function useDeleteCakeSize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cake_sizes" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-sizes"] });
      qc.invalidateQueries({ queryKey: ["cake-prices"] });
      toast.success("Tamanho removido");
    },
  });
}

// ============ CATEGORIES ============
export function useCakeCategories(activeOnly = false) {
  return useQuery({
    queryKey: ["cake-categories", activeOnly],
    queryFn: async () => {
      let q = supabase.from("cake_categories" as any).select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as CakeCategory[];
    },
    ...baseOpts,
  });
}



export function useUpsertCakeCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeCategory> & { slug: string; name: string }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("cake_categories" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cake_categories" as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-categories"] });
      toast.success("Categoria salva");
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteCakeCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cake_categories" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-categories"] });
      toast.success("Categoria removida");
    },
  });
}

// ============ PRICES ============
export function useCakePrices() {
  return useQuery({
    queryKey: ["cake-prices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cake_category_prices" as any).select("*");
      if (error) throw error;
      return (data ?? []) as unknown as CakePrice[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { category_id: string; size_id: string; price: number }) => {
      const { error } = await supabase
        .from("cake_category_prices" as any)
        .upsert(row, { onConflict: "category_id,size_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-prices"] });
    },
    onError: (e: any) => toast.error("Erro ao salvar preço: " + e.message),
  });
}

// ============ FLAVORS ============
export function useCakeFlavors(activeOnly = false) {
  return useQuery({
    queryKey: ["cake-flavors", activeOnly],
    queryFn: async () => {
      let q = supabase.from("cake_flavors" as any).select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as CakeFlavor[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakeFlavor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeFlavor> & { name: string; category_id: string }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("cake_flavors" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cake_flavors" as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-flavors"] });
      toast.success("Sabor salvo");
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteCakeFlavor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cake_flavors" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-flavors"] });
      toast.success("Sabor removido");
    },
  });
}

// ============ RECTANGULAR ============
export function useCakeRectangular(activeOnly = false) {
  return useQuery({
    queryKey: ["cake-rectangular", activeOnly],
    queryFn: async () => {
      let q = supabase.from("cake_rectangular" as any).select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as CakeRectangular[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakeRectangular() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeRectangular> & { name: string }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("cake_rectangular" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cake_rectangular" as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-rectangular"] });
      toast.success("Salvo");
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteCakeRectangular() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cake_rectangular" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-rectangular"] });
      toast.success("Removido");
    },
  });
}

// ============ DECORATIONS ============
export function useCakeDecorations(activeOnly = false) {
  return useQuery({
    queryKey: ["cake-decorations", activeOnly],
    queryFn: async () => {
      let q = supabase.from("cake_decorations" as any).select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return ((data ?? []) as unknown as CakeDecoration[]).map((d) => ({
        ...d,
        image_url: d.image_url ? getPublicImageUrl(d.image_url) : d.image_url,
      }));
    },
    ...baseOpts,
  });
}

export function useUpsertCakeDecoration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeDecoration> & { image_url: string }) => {
      const { error } = await supabase.from("cake_decorations" as any).upsert(row, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-decorations"] });
      toast.success("Decoração salva");
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteCakeDecoration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cake_decorations" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-decorations"] });
      toast.success("Decoração removida");
    },
  });
}
