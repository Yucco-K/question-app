'use client';

import { createContext, useContext, useState, useEffect, ReactNode, use } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
  session: any;
  setSession: (session: any) => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (p0: boolean) => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthはAuthProvider内でのみ使用できます');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const excludedPaths = [
    '/', '/questions', '/users/change-password',
    '/users/login', '/users/set-new-password', '/users/signup',
  ];

  const isExcludedPath = (path: string) => excludedPaths.includes(path);

  useEffect(() => {
    const checkAuth = async () => {
      const pathname = window.location.pathname;

      if (isExcludedPath(pathname)) {
        console.log(`認証不要のページです: ${pathname}`);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          console.log('data:', data);
        } else {
          router.push('/users/login');
        }
      } catch (err) {
        setError('認証に失敗しました');
        router.push('/users/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!loading && session) {
      console.log('session:', session);
    }
  }, [session, loading]);

  return (
    <AuthContext.Provider value={{ session, setSession, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
