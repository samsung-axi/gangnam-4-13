import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth } from '../api/fetchAuthCheck';
import type { TokenUser } from '../types/user';

interface AuthContextType {
  user: TokenUser | null;
  setUser: React.Dispatch<React.SetStateAction<TokenUser | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TokenUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (user) {
        setUser(user);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
