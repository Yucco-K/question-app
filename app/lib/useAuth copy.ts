'use client';

import { useAuth as useAuthContext } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = (redirectUrl: string = '/', requireAuth: boolean = true) => {
  const { session, loading, error } = useAuthContext();
  const router = useRouter();

  const excludedPaths = [
    '/',
    '/questions',
    '/users/change-password',
    '/users/login',
    '/users/set-new-password',
    '/users/signup'
  ];

  const isExcludedPath = (path: string) => {
    return excludedPaths.includes(path);
  };

  useEffect(() => {

    const pathname = window.location.pathname;

    if (isExcludedPath(pathname)) {
      return;
    }

    // if (pathname === '/questions') {
    //   setLoading(false);
    //   return;
    // }

    if (!loading && requireAuth && !session) {
      router.push('/users/login');
    }
  }, [loading, requireAuth, session, router]);

  return { session, loading, error };
};

export default useAuth;