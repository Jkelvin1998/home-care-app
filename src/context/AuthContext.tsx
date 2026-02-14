import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
   apiRequest,
   clearAuthToken,
   getAuthToken,
   setAuthToken,
} from '../lib/api';

type AuthUser = {
   id: string;
   name: string;
   email: string;
};

type LoginPayload = {
   email: string;
   password: string;
};

type SignupPayload = {
   name: string;
   email: string;
   password: string;
};

type AuthContextValue = {
   isAuthenticated: boolean;
   isAuthLoading: boolean;
   user: AuthUser | null;
   login: (payload: LoginPayload) => Promise<void>;
   signup: (payload: SignupPayload) => Promise<void>;
   logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
   children: React.ReactNode;
};

type AuthResponse = {
   token: string;
   user: AuthUser;
};

export function AuthProvider({ children }: AuthProviderProps) {
   const [token, setToken] = useState<string | null>(() => getAuthToken());
   const [user, setUser] = useState<AuthUser | null>(null);
   const [isAuthLoading, setIsAuthLoading] = useState<boolean>(
      Boolean(getAuthToken()),
   );

   useEffect(() => {
      const existingToken = getAuthToken();

      if (!existingToken) {
         setIsAuthLoading(false);
         return;
      }

      apiRequest<{ user: AuthUser }>('/auth/user', { auth: true })
         .then((response) => {
            setUser(response.user);
         })
         .catch(() => {
            clearAuthToken();
            setToken(null);
            setUser(null);
         })
         .finally(() => {
            setIsAuthLoading(false);
         });
   }, []);

   const login = async (payload: LoginPayload) => {
      const response = await apiRequest<AuthResponse>('/auth/login', {
         method: 'POST',
         body: JSON.stringify(payload),
      });

      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
   };

   const signup = async (payload: SignupPayload) => {
      const response = await apiRequest<AuthResponse>('/auth/signup', {
         method: 'POST',
         body: JSON.stringify(payload),
      });

      setAuthToken(response.token);
      setToken(response.token);
      setUser(response.user);
   };

   const logout = () => {
      clearAuthToken();
      setToken(null);
      setUser(null);
   };

   const value = useMemo(
      () => ({
         isAuthenticated: Boolean(token),
         isAuthLoading,
         user,
         login,
         signup,
         logout,
      }),
      [token, isAuthLoading, user],
   );

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
}
