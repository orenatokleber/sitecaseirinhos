import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "@/lib/api";

export function useTrackPageView() {
  const location = useLocation();

  useEffect(() => {
    const track = async () => {
      // Don't track admin routes
      if (location.pathname.startsWith("/painel-admin")) return;

      try {
        await apiClient.post("/api/site/analytics/page-view", {
          page_path: location.pathname,
          page_title: document.title,
          referrer: document.referrer || null,
        });
      } catch (e) {
        console.error("Failed tracking page view:", e);
      }
    };

    track();
  }, [location.pathname]);
}
