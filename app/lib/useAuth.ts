'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useAuthContext } from '../context/AuthContext';

const useAuth = (requireAuth: boolean = true, redirectUrl?: string) => {
  const { session, loading } = useAuthContext(requireAuth);
  const router = useRouter();

  const excludedPaths = [
    '/', '/users/change-password',
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
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    }
  }, [loading, session, requireAuth, redirectUrl, router]);

  return { session, loading };
};

export default useAuth;
