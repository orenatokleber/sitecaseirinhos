import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiClient } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  session: { accessToken: string } | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ accessToken: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token: string) => {
    try {
      const data = await apiClient.get('/api/auth/me');
      if (data.user) {
        setUser(data.user);
        setSession({ accessToken: token });
        setIsAdmin(data.user.roles?.includes('admin') || false);
      }
    } catch (err) {
      // Token might be invalid or expired. Clear session.
      localStorage.removeItem('caseirinhos_access_token');
      localStorage.removeItem('caseirinhos_refresh_token');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('caseirinhos_access_token');
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }

    // Handle token expired event from apiClient
    const handleAuthExpired = () => {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const data = await apiClient.post('/api/auth/login', { email, password });
      
      localStorage.setItem('caseirinhos_access_token', data.accessToken);
      localStorage.setItem('caseirinhos_refresh_token', data.refreshToken);
      
      setUser(data.user);
      setSession({ accessToken: data.accessToken });
      setIsAdmin(data.user.roles?.includes('admin') || false);
      
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Erro ao realizar login.') };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const data = await apiClient.post('/api/auth/register', { email, password });
      
      localStorage.setItem('caseirinhos_access_token', data.accessToken);
      localStorage.setItem('caseirinhos_refresh_token', data.refreshToken);
      
      setUser(data.user);
      setSession({ accessToken: data.accessToken });
      setIsAdmin(data.user.roles?.includes('admin') || false);
      
      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Erro ao realizar cadastro.') };
    }
  };

  const signInWithGoogle = async () => {
    // OAuth Google is disabled as it relies on Supabase.
    throw new Error("Login com Google desativado. Por favor, use login por e-mail e senha.");
  };

  const signOut = async () => {
    localStorage.removeItem('caseirinhos_access_token');
    localStorage.removeItem('caseirinhos_refresh_token');
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
