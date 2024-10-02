'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = (redirectUrl: string = '/', requireAuth = true) => { // デフォルトをホームページに
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setSession(data.session);
          setUserId(data.user?.id ?? null);

          // セッションが存在する場合はホームページにリダイレクト
          if (data.session) {
            router.push(redirectUrl);  // ログイン済みならリダイレクト
          }
        } else if (requireAuth) {
          router.push('/users/login');  // 認証が必要でセッションがない場合
        }
      } catch (error) {
        setError('認証に失敗しました。');
        if (requireAuth) {
          router.push('/users/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectUrl, requireAuth]);

  return { session, userId, loading, error };
};

export default useAuth;
