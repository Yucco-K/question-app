'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useAuthContext } from '../context/AuthContext';

const useAuth = (requireAuth: boolean = true, redirectUrl?: string) => {
  const authContext = useAuthContext();
  const session = authContext?.session;
  const loading = authContext?.loading;
  const router = useRouter();

  const excludedPaths = [
    '/','/api','/auth/v1',
    '/link/contact','/link/privacy-policy', '/link/terms',
    '/users/signup','/users/login',
    '/users/change-password','users/check-email','/users/set-new-password',
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

  return { session, loading, error: authContext?.error };
};

export default useAuth;
