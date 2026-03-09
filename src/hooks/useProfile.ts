import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useAdminProfile() {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (data?.avatar_url && !data.avatar_url.startsWith("http")) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.avatar_url);
        return { ...data, avatar_url: urlData.publicUrl };
      }
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: { display_name?: string; bio?: string; avatar_url?: string }) => {
      if (!user) throw new Error("Not authenticated");

      // Check if profile exists
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("profiles")
          .insert({ user_id: user.id, ...updates });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error("Not authenticated");
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (error) throw error;

      // Update profile with path
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("profiles").update({ avatar_url: path }).eq("user_id", user.id);
      } else {
        await supabase.from("profiles").insert({ user_id: user.id, avatar_url: path });
      }

      return path;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
  });
}
