'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ルーティング用
import { useAuth as useAuthContext } from '../context/AuthContext'; // AuthContextのフックを使用

const useAuth = (requireAuth: boolean = true, redirectUrl?: string) => {
  const { session, loading } = useAuthContext(); // 認証状態を取得
  const router = useRouter();

  const excludedPaths = [
    '/', '/questions', '/users/change-password',
    '/users/login', '/users/set-new-password', '/users/signup',
  ];

  const isExcludedPath = (path: string) => excludedPaths.includes(path);

  useEffect(() => {

    const pathname = window.location.pathname;

    if (isExcludedPath(pathname)) {
      console.log(`認証不要のページです: ${pathname}`);
      return;
    }

    if (!loading) {
      if (requireAuth && !session) {
        // redirectUrlが指定されている場合のみリダイレクト
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    }
  }, [loading, session, requireAuth, redirectUrl, router]);

  return { session, loading };
};

export default useAuth;
