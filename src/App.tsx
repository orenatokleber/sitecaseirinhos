import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeColorInjector } from "@/components/ThemeColorInjector";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import NossaHistoria from "./pages/NossaHistoria";
import Cardapio from "./pages/Cardapio";
import Encomendas from "./pages/Encomendas";
import Contato from "./pages/Contato";
import Galeria from "./pages/Galeria";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSections from "./pages/admin/AdminSections";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminConfig from "./pages/admin/AdminConfig";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/painel-admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeColorInjector />
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/nossa-historia" element={<NossaHistoria />} />
              <Route path="/cardapio" element={<Cardapio />} />
              <Route path="/encomendas" element={<Encomendas />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/galeria" element={<Galeria />} />

              {/* Admin routes */}
              <Route path="/painel-admin/login" element={<AdminLogin />} />
              <Route path="/painel-admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="secoes" element={<AdminSections />} />
                <Route path="produtos" element={<AdminProducts />} />
                <Route path="depoimentos" element={<AdminTestimonials />} />
                <Route path="galeria" element={<AdminGallery />} />
                <Route path="config" element={<AdminConfig />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
