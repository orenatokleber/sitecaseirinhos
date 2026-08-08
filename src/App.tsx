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
import MontarPedido from "./pages/MontarPedido";

import Contato from "./pages/Contato";
import Galeria from "./pages/Galeria";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSections from "./pages/admin/AdminSections";
import AdminNossaHistoria from "./pages/admin/AdminNossaHistoria";
import AdminPages from "./pages/admin/AdminPages";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminConfig from "./pages/admin/AdminConfig";
import BlogEditor from "./pages/admin/BlogEditor";
import AdminCardapio from "./pages/admin/AdminCardapio";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminSEO from "./pages/admin/AdminSEO";
import AdminComments from "./pages/admin/AdminComments";
import AdminLinks from "./pages/admin/AdminLinks";
import RedirectPage from "./pages/RedirectPage";
import MaintenancePage from "./pages/MaintenancePage";
import AdminMaintenance from "./pages/admin/AdminMaintenance";
import Biolink from "./pages/Biolink";
import AdminBiolink from "./pages/admin/AdminBiolink";
import { HelmetProvider } from "react-helmet-async";
import { useTrackPageView } from "@/hooks/usePageViews";
import { useSiteSettings } from "@/hooks/useSiteContent";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/painel-admin');
  const isBareRoute = location.pathname === '/links';
  const hideWhatsApp = location.pathname === '/' || location.pathname.startsWith('/cardapio');
  useTrackPageView();
  const { data: settings } = useSiteSettings();

  if (isAdminRoute || isBareRoute) {
    return <>{children}</>;
  }

  const maintenance = settings?.maintenance;
  const enabledPaths: string[] = maintenance?.enabled_paths || [];
  if (enabledPaths.includes(location.pathname)) {
    return <MaintenancePage />;
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
      {!hideWhatsApp && <WhatsAppButton />}
    </>
  );
};

const App = () => (
  <HelmetProvider>
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
              
              <Route path="/contato" element={<Contato />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/links" element={<Biolink />} />
              <Route path="/:slug" element={<RedirectPage />} />


              {/* Admin routes */}
              <Route path="/painel-admin/login" element={<AdminLogin />} />
              <Route path="/painel-admin/blog/novo" element={<BlogEditor />} />
              <Route path="/painel-admin/blog/:id" element={<BlogEditor />} />
              <Route path="/painel-admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="secoes" element={<AdminSections />} />
                <Route path="paginas" element={<AdminPages />} />
                <Route path="paginas/nossa-historia" element={<AdminNossaHistoria />} />
                <Route path="nossa-historia" element={<AdminNossaHistoria />} />
                <Route path="produtos" element={<AdminProducts />} />
                <Route path="cardapio" element={<AdminCardapio />} />
                <Route path="depoimentos" element={<AdminTestimonials />} />
                <Route path="galeria" element={<AdminGallery />} />
              <Route path="blog" element={<AdminBlog />} />
                <Route path="comentarios" element={<AdminComments />} />
                <Route path="seo" element={<AdminSEO />} />
                <Route path="links" element={<AdminLinks />} />
                <Route path="biolink" element={<AdminBiolink />} />
                <Route path="config" element={<AdminConfig />} />
                <Route path="manutencao" element={<AdminMaintenance />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
