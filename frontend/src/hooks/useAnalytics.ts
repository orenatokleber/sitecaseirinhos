import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function usePageViewStats() {
  return useQuery({
    queryKey: ["analytics-page-views"],
    queryFn: async () => {
      const data = await apiClient.get("/api/site/analytics/page-views") as any[];
      return data || [];
    },
  });
}

export function useAnalyticsSummary() {
  const { data: views, isLoading } = usePageViewStats();

  const summary = (() => {
    if (!views) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayViews = views.filter(v => new Date(v.viewed_at) >= today).length;
    const weekViews = views.filter(v => new Date(v.viewed_at) >= weekAgo).length;
    const monthViews = views.filter(v => new Date(v.viewed_at) >= monthAgo).length;
    const totalViews = views.length;

    // Most visited pages
    const pageCounts: Record<string, { count: number; title: string }> = {};
    views.forEach(v => {
      if (!pageCounts[v.page_path]) {
        pageCounts[v.page_path] = { count: 0, title: v.page_title || v.page_path };
      }
      pageCounts[v.page_path].count++;
    });

    const topPages = Object.entries(pageCounts)
      .map(([path, { count, title }]) => ({ path, count, title }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Views per day (last 7 days)
    const dailyViews: { date: string; views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const next = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      const count = views.filter(v => {
        const vd = new Date(v.viewed_at);
        return vd >= d && vd < next;
      }).length;
      dailyViews.push({
        date: d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" }),
        views: count,
      });
    }

    return { todayViews, weekViews, monthViews, totalViews, topPages, dailyViews };
  })();

  return { summary, isLoading };
}
