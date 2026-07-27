import { apiClient } from './api.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper para obter URL pública de imagem do servidor local
export function getPublicImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Imagens locais do servidor
  return `${API_URL}/uploads/${path}`;
}

// Upload de imagem para o backend Fastify
export async function uploadImage(file: File, folder: string = 'general'): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  try {
    const res = await apiClient.post('/api/upload', formData, {
      // Fetch will automatically set content-type for FormData, so we don't pass JSON
      // and we let the browser set the boundary headers.
      headers: {}, 
      body: formData,
    } as any);

    return res.fileName;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

// Helper para verificar se usuário é admin (adaptado do Supabase)
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const data = await apiClient.get('/api/auth/me');
    return data.user?.roles?.includes('admin') || false;
  } catch (err) {
    return false;
  }
}

// Export a dummy object to satisfy legacy imports if any exist,
// but we will refactor direct supabase calls.
export const supabase = {
  auth: {
    // dummy methods
    signOut: async () => {
      localStorage.removeItem('caseirinhos_access_token');
      localStorage.removeItem('caseirinhos_refresh_token');
    }
  }
} as any;
