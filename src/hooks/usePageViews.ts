import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useTrackPageView() {
  const location = useLocation();

  useEffect(() => {
    const track = async () => {
      // Don't track admin routes
      if (location.pathname.startsWith("/painel-admin")) return;

      await supabase.from("page_views").insert({
        page_path: location.pathname,
        page_title: document.title,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });
    };

    track();
  }, [location.pathname]);
}
