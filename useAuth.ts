'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';

const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getCookieValue = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const token = parts.pop();
        if (token) {
          return token.split(';').shift();
        }
      }
    };

    const checkSession = async () => {
      const accessToken = getCookieValue('access_token');
      const refreshToken = getCookieValue('refresh_token');

      if (accessToken && refreshToken) {
        // Supabaseクライアントにトークンを設定してセッションを再構築
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (data.session) {
          setSession(data.session);
          console.log('Session:', data.session);
        } else {
          router.push('/auth');
        }
      } else {
        router.push('/auth');
      }
    };

    checkSession();
  }, [router, supabase]);

  return session;
};

export default useAuth;
