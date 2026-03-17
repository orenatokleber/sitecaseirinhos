import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRedirectBySlug, trackClick } from "@/hooks/useRedirects";
import { Loader2 } from "lucide-react";

const RedirectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: redirect, isLoading, isError } = useRedirectBySlug(slug);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (redirect && !redirecting) {
      setRedirecting(true);
      trackClick(redirect.id).finally(() => {
        window.location.href = redirect.destination_url;
      });
    }
  }, [redirect, redirecting]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || (!isLoading && !redirect)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-2xl font-bold text-foreground">Link não encontrado</h1>
        <p className="text-muted-foreground">Este link não existe ou foi desativado.</p>
        <a href="/" className="text-primary underline">Voltar ao site</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
};

export default RedirectPage;
