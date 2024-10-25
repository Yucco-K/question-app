'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
}

type Session = {
  user: User;
};

type AuthContextProps = {
  user: User | null;
  loading: boolean;
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<any>>;
  error: string | null;
};


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const userId = session?.user?.id || null;


  const excludedPaths = [
    '/', '/users/change-password',
    '/users/login', '/users/set-new-password', '/users/signup',
    '/auth/v1','/api',
  ];

  const isExcludedPath = (path: string) => excludedPaths.includes(path);

  // const checkSession = async () => {
  //   const pathname = window.location.pathname;

  //   if (isExcludedPath(pathname)) {
  //     console.log(`認証不要のページです: ${pathname}`);
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await fetch('/api/check-session', {
  //       method: 'GET',
  //       credentials: 'include',
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setSession(data.session);
  //     } else {
  //       setSession(null);
  //       router.push('/users/login');
  //     }
  //   } catch (error) {
  //     console.error('セッション確認エラー:', error);
  //     setError('認証に失敗しました');
  //     setSession(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   checkSession();
  // }, []);

  useEffect(() => {
    if (!userId) {
      console.log('ユーザーIDがまだ設定されていません');
      return;
    }


    const fetchUserInfo = async () => {
      try {
        console.log('ユーザー情報取得中...ユーザーID:', userId);
        const response = await fetch(`/api/users/${userId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }

        const data = await response.json();
        setSession((prevSession: any) => ({
          ...prevSession,
          user: {
            ...prevSession?.user,
            username: data.username,
            email: data.email,
            profileImage: data.profileImage,
          },
        }));
        console.log('ユーザー情報:', data);
      } catch (err) {
        console.error('ユーザー情報取得エラー:', err);
      }
    };

    fetchUserInfo();
  }, [userId]);


  return (
    <AuthContext.Provider value={{ user: session?.user || null, session, setSession, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
