import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Helper para verificar se usuário é admin
export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();
  
  return !error && data !== null;
}

// Helper para obter URL pública de imagem do storage
export function getPublicImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const { data } = supabase.storage.from('site-images').getPublicUrl(path);
  return data.publicUrl;
}

// Upload de imagem
export async function uploadImage(file: File, folder: string = 'general'): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('site-images')
    .upload(fileName, file, { upsert: true });
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  return fileName;
}
