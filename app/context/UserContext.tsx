'use client';

import useAuth from '@/app/lib/useAuth';
import { createContext, useContext, useState, useEffect } from 'react';
import { useLoading } from './LoadingContext';
import { usePathname } from 'next/navigation';

interface UserContextType {
  userId: string | null;
  username: string | null;
  profileImage: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: { username: string, email: string, profileImage: string }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { isLoading, setLoading } = useLoading();
  const { session } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);


  const excludedPaths = [
    '/','/api','/auth/v1',
    '/link/contact','/link/privacy-policy', '/link/terms',
    '/users/signup','/users/login',
    '/users/change-password','users/check-email','/users/set-new-password',
  ];

  const isExcludedPath = (path: string) => excludedPaths.includes(path);

  const pathname = usePathname();

  useEffect(() => {
    if (isExcludedPath(pathname)) {
      console.log(`認証不要のページです: ${pathname}`);
      setLoading(false);
      return;
    }
  }, [pathname]);

  useEffect(() => {
      if (!session) {
        console.log('セッションがまだありません');
        return;
      }

      const currentUserId = session.user?.id || null;
      setUserId(currentUserId);
      console.log('セッション:', session);
      console.log('ユーザーID:', currentUserId);
    }, [session]);

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

          console.log('ユーザー情報:', data);
        } catch (err) {
          console.error('エラー:', err);
        }
      };

      fetchUserInfo();
    }, [userId]);



  const setUser = (user: { username: string, email: string, profileImage: string }) => {
    setUsername(user.username);
    setEmail(user.email);
    setProfileImage(user.profileImage);
  };


  useEffect(() => {
    if (!userId || !userId) {
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        console.log('ユーザー情報取得中...');
        console.log('ユーザーID:', userId);
        const response = await fetch(`/api/users/${userId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }

        const data = await response.json();

        setUser({
          username: data.username,
          email: data.email,
          profileImage: data.profileImage,
        });
        setError(null);
        console.log('ユーザー情報:', data);
      } catch (err) {
        console.error('エラー:', err);
        setError('ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, username, email, profileImage, isLoading, error, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
