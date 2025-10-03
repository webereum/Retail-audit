import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setSession({ user: userData });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const mockUser = { id: '1', email, name: 'Admin User' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setSession({ user: mockUser });
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'Auditor') => {
    const mockUser = { id: '1', email, name, role };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setSession({ user: mockUser });
  };

  const signOut = async () => {
    localStorage.removeItem('user');
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
