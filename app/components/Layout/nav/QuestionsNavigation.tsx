'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import useAuth from '@/app/lib/useAuth';
import LogoutButton from '../../users/LogoutButton';

export default function QuestionsNavigation() {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAccountManagement = () => {
    if (userId) {
      router.push(`/users/${userId}`);
    }
  };

  const handleSearchCategory = () => {

      router.push('/questions/search/category');

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


  return (
    <nav
    className={`fixed top-15 left-0 w-full bg-white text-gray-700 px-4 py-2 shadow-md rounded-sm transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
    >
    <div className="w-[1200px] mx-auto">
      <ul className="flex space-x-6 text-sm items-center mt-2">
        <li>
          <button
            className="text-blue-800 ml-4 hover:underline flex items-center"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            戻る
          </button>
        </li>

        <li className="text-gray-500 mx-2">＞</li>

        <li className="text-gray-700">Top 画面</li>

        <li className="text-gray-500 mx-2">＞</li>

        <li>
          <button
            className="text-blue-800 ml-2 hover:underline"
            onClick={handleAccountManagement}
          >
            マイページ
          </button>
        </li>

        <li>
          <button
            className="text-blue-800 ml-2 hover:underline"
            onClick={handleSearchCategory}
          >
            カテゴリ検索
          </button>
        </li>

        <li className="text-gray-500 mx-2">＞</li>

        <li>
          {!userLoading && session ? (
            <>
              <LogoutButton className="text-blue-800 ml-2 hover:underline" />
            </>
          ) : (
            <button
              className="text-blue-800 ml-2 hover:underline"
              onClick={() => handleNavigation('/users/login')}
            >
              ログイン
            </button>
          )}
        </li>

      </ul>
    </div>
    </nav>
  );
}
