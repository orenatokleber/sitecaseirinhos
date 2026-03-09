import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Camera, User } from "lucide-react";
import { toast } from "sonner";

const ProfileSection = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      if (profile.avatar_url) {
        if (profile.avatar_url.startsWith("http")) {
          setAvatarPreview(profile.avatar_url);
        } else {
          const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);
          setAvatarPreview(data.publicUrl + "?t=" + Date.now());
        }
      }
    }
  }, [profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem deve ter no máximo 2MB");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    try {
      await uploadAvatar.mutateAsync(file);
      toast.success("Foto atualizada!");
    } catch {
      toast.error("Erro ao enviar foto");
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ display_name: displayName, bio });
      toast.success("Perfil salvo!");
    } catch {
      toast.error("Erro ao salvar perfil");
    }
  };

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>👤 Meu Perfil</CardTitle>
        <CardDescription>Sua foto e nome aparecerão como autor nos posts do blog</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-20 w-20 border-2 border-border">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Avatar" />
              ) : null}
              <AvatarFallback className="bg-accent/10 text-accent">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="h-5 w-5 text-background" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Foto de Perfil</p>
            <p>Clique na foto para alterar. Max 2MB.</p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="display-name">Nome de exibição</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Seu nome"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Uma breve descrição sobre você..."
            rows={3}
          />
        </div>

        <Button onClick={handleSave} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Perfil
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
