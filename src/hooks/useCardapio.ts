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
      const normalizedRow = {
        ...row,
        code: row.code.trim(),
        name: (row.name || row.code).trim(),
      };
      const { id, ...rest } = normalizedRow;
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
    onError: (e: any) => {
      const message = e?.code === "23505" || String(e?.message || "").includes("cake_sizes_code_key")
        ? "Já existe um tamanho com esse código. Use outro código ou edite o tamanho existente."
        : `Erro ao salvar: ${e?.message || "tente novamente"}`;
      toast.error(message);
    },
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
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("cake_decorations" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cake_decorations" as any).insert(rest);
        if (error) throw error;
      }
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

// ============ SWEETS ============
export type SweetType = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  weight_g: number | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};
export type SweetFlavor = {
  id: string;
  type_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};
export type SweetPackage = {
  id: string;
  type_id: string;
  quantity: number;
  price: number;
  sort_order: number;
};

export function useSweetTypes(activeOnly = false) {
  return useQuery({
    queryKey: ["sweet-types", activeOnly],
    queryFn: async () => {
      let q = supabase.from("sweet_types" as any).select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as SweetType[];
    },
    ...baseOpts,
  });
}
export function useUpsertSweetType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<SweetType> & { slug: string; name: string }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("sweet_types" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sweet_types" as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sweet-types"] }); toast.success("Tipo salvo"); },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}
export function useDeleteSweetType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sweet_types" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sweet-types"] });
      qc.invalidateQueries({ queryKey: ["sweet-flavors"] });
      qc.invalidateQueries({ queryKey: ["sweet-packages"] });
      toast.success("Tipo removido");
    },
  });
}

export function useSweetFlavors(activeOnly = false) {
  return useQuery({
    queryKey: ["sweet-flavors", activeOnly],
    queryFn: async () => {
      let q = supabase.from("sweet_flavors" as any).select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as SweetFlavor[];
    },
    ...baseOpts,
  });
}
export function useUpsertSweetFlavor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<SweetFlavor> & { name: string; type_id: string }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("sweet_flavors" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sweet_flavors" as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sweet-flavors"] }); toast.success("Sabor salvo"); },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}
export function useDeleteSweetFlavor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sweet_flavors" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sweet-flavors"] }); toast.success("Sabor removido"); },
  });
}

export function useSweetPackages() {
  return useQuery({
    queryKey: ["sweet-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sweet_packages" as any).select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as SweetPackage[];
    },
    ...baseOpts,
  });
}
export function useUpsertSweetPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<SweetPackage> & { type_id: string; quantity: number; price: number }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("sweet_packages" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sweet_packages" as any).upsert(rest, { onConflict: "type_id,quantity" });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sweet-packages"] }); toast.success("Pacote salvo"); },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}
export function useDeleteSweetPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sweet_packages" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sweet-packages"] }); toast.success("Pacote removido"); },
  });
}

// ============ CAKE ADDONS ============
export type CakeAddon = {
  id: string;
  name: string;
  description: string | null;
  pricing_type: "fixed" | "per_size";
  sort_order: number;
  is_active: boolean;
};
export type CakeAddonPrice = {
  id: string;
  addon_id: string;
  size_id: string | null;
  price: number;
};

export function useCakeAddons(activeOnly = false) {
  return useQuery({
    queryKey: ["cake-addons", activeOnly],
    queryFn: async () => {
      let q = supabase.from("cake_addons" as any).select("*").order("sort_order");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as CakeAddon[];
    },
    ...baseOpts,
  });
}
export function useUpsertCakeAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeAddon> & { name: string }) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await supabase.from("cake_addons" as any).update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cake_addons" as any).insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cake-addons"] }); toast.success("Adicional salvo"); },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}
export function useDeleteCakeAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cake_addons" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-addons"] });
      qc.invalidateQueries({ queryKey: ["cake-addon-prices"] });
      toast.success("Adicional removido");
    },
  });
}

export function useCakeAddonPrices() {
  return useQuery({
    queryKey: ["cake-addon-prices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cake_addon_prices" as any).select("*");
      if (error) throw error;
      return (data ?? []) as unknown as CakeAddonPrice[];
    },
    ...baseOpts,
  });
}
export function useUpsertCakeAddonPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { addon_id: string; size_id: string | null; price: number }) => {
      // Manual upsert: delete matching then insert
      let del = supabase.from("cake_addon_prices" as any).delete().eq("addon_id", row.addon_id);
      del = row.size_id === null ? del.is("size_id", null) : del.eq("size_id", row.size_id);
      const { error: delErr } = await del;
      if (delErr) throw delErr;
      const { error } = await supabase.from("cake_addon_prices" as any).insert(row);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cake-addon-prices"] }); },
    onError: (e: any) => toast.error("Erro ao salvar preço: " + e.message),
  });
}
