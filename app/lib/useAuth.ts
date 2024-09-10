// useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = (redirectUrl: string = '/users/login', requireAuth = true) => {
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
        } else if (requireAuth) {
          router.push(redirectUrl);
        }
      } catch (error) {
        setError('認証に失敗しました。');
        if (requireAuth) {
          router.push(redirectUrl);
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