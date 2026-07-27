import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { uploadImage, getPublicImageUrl } from "@/lib/supabase";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const data = await apiClient.get("/api/auth/profile") as Profile;
      return {
        ...data,
        avatar_url: data.avatar_url ? getPublicImageUrl(data.avatar_url) : null
      };
    },
    enabled: !!user,
  });
}

export function useAdminProfile() {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      try {
        const data = await apiClient.get("/api/auth/profile") as Profile;
        return {
          ...data,
          avatar_url: data.avatar_url ? getPublicImageUrl(data.avatar_url) : null
        };
      } catch (e) {
        return null;
      }
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: { display_name?: string; bio?: string; avatar_url?: string }) => {
      if (!user) throw new Error("Not authenticated");
      
      await apiClient.put("/api/auth/profile", {
        display_name: updates.display_name,
        bio: updates.bio,
        avatar_url: updates.avatar_url,
      });
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
      
      // Upload file to local server
      const path = await uploadImage(file, "avatars");
      if (!path) throw new Error("Avatar upload failed");

      // Update profile with returned filename
      await apiClient.put("/api/auth/profile", { avatar_url: path });

      return path;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
    },
  });
}
