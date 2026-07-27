// List of public routes that can be toggled to "maintenance" mode from the admin.
export const MAINTENANCE_ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "Página Inicial" },
  { path: "/nossa-historia", label: "Nossa História" },
  { path: "/cardapio", label: "Cardápio" },
  { path: "/contato", label: "Contato" },
  { path: "/galeria", label: "Galeria" },
  { path: "/blog", label: "Blog" },
];
