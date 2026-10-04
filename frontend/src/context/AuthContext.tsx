import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials } from '../types/auth';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    
    setToken(response.token);
    setUser(response.user);
    
    if (credentials.rememberMe) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    } else {
      sessionStorage.setItem('auth_token', response.token);
      sessionStorage.setItem('auth_user', JSON.stringify(response.user));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
