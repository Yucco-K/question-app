'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  userId: string | null;
  username: string | null;
  profileImage: string | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const excludedPaths = [
    '/',
    // '/questions',
    '/users/signup',
    '/users/login',
    '/users/change-password',
    '/users/set-new-password',
  ];

  const isExcludedPath = (path: string) => {
    return excludedPaths.includes(path);
  };

  useEffect(() => {
    const pathname = window.location.pathname;

    if (isExcludedPath(pathname)) {
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }

        const data = await response.json();

        setUserId(data.userId);
        setUsername(data.username);
        setEmail(data.email);
        setProfileImage(data.profileImage);
      } catch (err) {
        console.error('エラー:', err);
        setError('ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userId, username, email, profileImage, loading, error }}>
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
