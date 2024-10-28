'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import useAuth from '@/app/lib/useAuth';
import { useEffect, useState } from 'react';
import MobileDefaultNav from './MobileDefaultNav';

export default function DefaultNavigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const pathname = usePathname();


  useEffect(() => {
    const checkIsMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(checkIsMobile());
  }, []);


  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleBack = () => {
    router.back();
  };


  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  let pageTitle = 'その他';
  if (pathname.startsWith (`/users/${userId}`)) pageTitle = 'マイページ';
  else if (pathname === '/questions/search/category') pageTitle = 'カテゴリ検索';
  else if (pathname === '/questions/search/sort') pageTitle = 'ソート';
  else if (pathname === '/questions/search/filter') pageTitle = 'フィルター';
  else if (pathname === '/link/contact') pageTitle = 'お問い合わせ';
  else if (pathname === '/link/privacy-policy') pageTitle = 'プライバシーポリシー';
  else if (pathname === '/link/terms') pageTitle = '利用規約';


  if (isMobile) {
    return <MobileDefaultNav />;
  }


  return (
  <nav
    className={`fixed top-0 left-0 w-full bg-white text-gray-700 px-4 py-2 shadow-md rounded-sm transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
    >
    <div className="w-[1200px] mx-auto">
      <ul className="flex space-x-2 text-sm items-center">
        <li>
          <button
            className="text-blue-700 ml-2 font-bold hover:underline flex items-center whitespace-nowrap"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            戻る
          </button>
        </li>

        <li>
          <button
            className="text-blue-700 ml-2 font-bold hover:underline whitespace-nowrap flex items-center"
            onClick={() => handleNavigation('/questions/public')}
          >
            <FontAwesomeIcon icon={faHome} className="mr-2 text-blue-500" />
            Top
          </button>
        </li>

        <li className="text-gray-500 mx-1">＞</li>

        <li className="text-gray-700 whitespace-nowrap flex items-center">
          {pageTitle}
        </li>

      </ul>
    </div>
    </nav>
  );
}
