'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import useAuth from '../../../lib/useAuth';
import MobileDefaultNav from './MobileDefaultNav';

export default function QuestionDetailNav() {
  const [isVisible, setIsVisible] = useState(true);
  const { session, loading: userLoading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const userId = (session?.user as { id?: string })?.id ?? null;
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    const checkIsMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(checkIsMobile());
  }, []);


  const handleNavigation = (path: string) => {
    if (path !== pathname) {
      router.push(path);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSearchSort = () => {
    router.push('/questions/search/sort');
  };

  const handleSearchFilter = () => {
    router.push('/questions/search/filter');
  };

  const handleSearchCategory = () => {
    router.push('/questions/search/category');
  };

  const handleAccountManagement = () => {
    if (userId) {
      router.push(`/users/${userId}`);
    }
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

  if (isMobile) {
    return <MobileDefaultNav />;
  }


  return (
    <nav
      className={`fixed top-20 left-28 w-1/2 bg-white text-gray-700 px-4 pb-2 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="w-[1500px] mx-auto">
        <ul className="flex space-x-2 text-sm items-center mt-2 ml-4">
          <li>
            <button
              className="text-blue-700 font-bold hover:underline flex items-center"
              onClick={handleBack}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mx-2" />
              戻る
            </button>
          </li>

          <li>
            <button
              className={`text-blue-700 ml-4 font-bold ${
                pathname === '/questions/public'
                  ? 'text-gray-400 cursor-default pointer-events-none'
                  : 'hover:underline'
              }`}
              onClick={() => handleNavigation('/questions/public')}
              title="Home"
            >
              <FontAwesomeIcon icon={faHome} className="text-blue-500 mx-2" />
              Top
            </button>
          </li>

          <li className="text-gray-500 mx-1">＞</li>

          {pathname.startsWith('/questions/') && (
            <>
              <li>
                <button
                  className={`text-gray-500 mx-1 font-bold`}
                >
                  質問詳細
                </button>
              </li>
              <li className="text-gray-500 mx-2">＞</li>
            </>
          )}


          <li>
            <button
              className={`text-blue-700 ml-1 font-bold ${
                pathname === '/questions/search/sort'
                  ? 'text-gray-400 cursor-default pointer-events-none'
                  : 'hover:underline'
              }`}
              onClick={handleSearchSort}
            >
              ソート
            </button>
          </li>

          <li className="text-gray-500 mx-1">＞</li>

          <li>
            <button
              className={`text-blue-700 ml-1 font-bold ${
                pathname === '/questions/search/filter'
                  ? 'text-gray-400 cursor-default pointer-events-none'
                  : 'hover:underline'
              }`}
              onClick={handleSearchFilter}
            >
              フィルター
            </button>
          </li>

          <li className="text-gray-500 mx-1">＞</li>

          <li>
            <button
              className={`text-blue-700 ml-1 font-bold ${
                pathname === '/questions/search/category'
                  ? 'text-gray-400 cursor-default pointer-events-none'
                  : 'hover:underline'
              }`}
              onClick={handleSearchCategory}
            >
              カテゴリ
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
