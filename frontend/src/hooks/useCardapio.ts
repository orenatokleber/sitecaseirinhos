import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { getPublicImageUrl } from "@/lib/supabase";
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
  type: "standard" | "addon" | "consult";
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
      return await apiClient.get(`/api/cardapio/sizes?activeOnly=${activeOnly}`) as CakeSize[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakeSize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeSize> & { code: string; name: string }) => {
      // Map frontend snake_case to backend camelCase/snake_case structure expected by Fastify
      await apiClient.post("/api/cardapio/sizes", {
        id: row.id,
        code: row.code,
        name: row.name,
        ring_size: row.ring_size,
        slices: row.slices,
        weight_kg: row.weight_kg,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cake-sizes"] });
      toast.success("Tamanho salvo");
    },
    onError: (e: any) => {
      toast.error(`Erro ao salvar: ${e?.message || "tente novamente"}`);
    },
  });
}

export function useDeleteCakeSize() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/cardapio/sizes/${id}`);
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
      return await apiClient.get(`/api/cardapio/categories?activeOnly=${activeOnly}`) as CakeCategory[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakeCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeCategory> & { slug: string; name: string }) => {
      await apiClient.post("/api/cardapio/categories", {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        type: row.type,
        image_url: row.image_url,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
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
      await apiClient.delete(`/api/cardapio/categories/${id}`);
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
      return await apiClient.get("/api/cardapio/prices") as CakePrice[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { category_id: string; size_id: string; price: number }) => {
      await apiClient.post("/api/cardapio/prices", row);
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
      return await apiClient.get(`/api/cardapio/flavors?activeOnly=${activeOnly}`) as CakeFlavor[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakeFlavor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeFlavor> & { name: string; category_id: string }) => {
      await apiClient.post("/api/cardapio/flavors", {
        id: row.id,
        category_id: row.category_id,
        name: row.name,
        description: row.description,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
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
      await apiClient.delete(`/api/cardapio/flavors/${id}`);
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
      return await apiClient.get(`/api/cardapio/rectangular?activeOnly=${activeOnly}`) as CakeRectangular[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakeRectangular() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeRectangular> & { name: string }) => {
      await apiClient.post("/api/cardapio/rectangular", {
        id: row.id,
        name: row.name,
        dimensions: row.dimensions,
        slices: row.slices,
        weight_kg: row.weight_kg,
        class1_price: row.class1_price,
        class2_price: row.class2_price,
        note: row.note,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
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
      await apiClient.delete(`/api/cardapio/rectangular/${id}`);
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
      const data = await apiClient.get(`/api/cardapio/decorations?activeOnly=${activeOnly}`) as CakeDecoration[];
      return data.map((d) => ({
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
      await apiClient.post("/api/cardapio/decorations", {
        id: row.id,
        title: row.title,
        image_url: row.image_url,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
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
      await apiClient.delete(`/api/cardapio/decorations/${id}`);
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
      const data = await apiClient.get(`/api/cardapio/sweet-types?activeOnly=${activeOnly}`) as SweetType[];
      return data.map((t) => ({
        ...t,
        image_url: t.image_url ? getPublicImageUrl(t.image_url) : t.image_url,
      }));
    },
    ...baseOpts,
  });
}

export function useUpsertSweetType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<SweetType> & { slug: string; name: string }) => {
      await apiClient.post("/api/cardapio/sweet-types", {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        weight_g: row.weight_g,
        image_url: row.image_url,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["sweet-types"] }); 
      toast.success("Tipo salvo"); 
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteSweetType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/cardapio/sweet-types/${id}`);
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
      return await apiClient.get(`/api/cardapio/sweet-flavors?activeOnly=${activeOnly}`) as SweetFlavor[];
    },
    ...baseOpts,
  });
}

export function useUpsertSweetFlavor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<SweetFlavor> & { name: string; type_id: string }) => {
      await apiClient.post("/api/cardapio/sweet-flavors", {
        id: row.id,
        type_id: row.type_id,
        name: row.name,
        description: row.description,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["sweet-flavors"] }); 
      toast.success("Sabor salvo"); 
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteSweetFlavor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/cardapio/sweet-flavors/${id}`);
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["sweet-flavors"] }); 
      toast.success("Sabor removido"); 
    },
  });
}

export function useSweetPackages() {
  return useQuery({
    queryKey: ["sweet-packages"],
    queryFn: async () => {
      return await apiClient.get("/api/cardapio/sweet-packages") as SweetPackage[];
    },
    ...baseOpts,
  });
}

export function useUpsertSweetPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<SweetPackage> & { type_id: string; quantity: number; price: number }) => {
      await apiClient.post("/api/cardapio/sweet-packages", {
        id: row.id,
        type_id: row.type_id,
        quantity: row.quantity,
        price: row.price,
        sort_order: row.sort_order,
      });
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["sweet-packages"] }); 
      toast.success("Pacote salvo"); 
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteSweetPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/cardapio/sweet-packages/${id}`);
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["sweet-packages"] }); 
      toast.success("Pacote removido"); 
    },
  });
}

// ============ CAKE ADDONS ============
export type CakeAddon = {
  id: string;
  name: string;
  description: string | null;
  pricing_type: "fixed" | "from" | "per_size" | "consult";
  applies_to: "round" | "rectangular";
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
      return await apiClient.get(`/api/cardapio/addons?activeOnly=${activeOnly}`) as CakeAddon[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakeAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<CakeAddon> & { name: string }) => {
      await apiClient.post("/api/cardapio/addons", {
        id: row.id,
        name: row.name,
        description: row.description,
        pricing_type: row.pricing_type,
        applies_to: row.applies_to,
        sort_order: row.sort_order,
        is_active: row.is_active,
      });
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["cake-addons"] }); 
      toast.success("Adicional salvo"); 
    },
    onError: (e: any) => toast.error("Erro: " + e.message),
  });
}

export function useDeleteCakeAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/cardapio/addons/${id}`);
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
      return await apiClient.get("/api/cardapio/addon-prices") as CakeAddonPrice[];
    },
    ...baseOpts,
  });
}

export function useUpsertCakeAddonPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { addon_id: string; size_id: string | null; price: number }) => {
      await apiClient.post("/api/cardapio/addon-prices", row);
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["cake-addon-prices"] }); 
    },
    onError: (e: any) => toast.error("Erro ao salvar preço: " + e.message),
  });
}
