'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
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
      className={`fixed top-16 left-0 w-full bg-white text-gray-700 pb-2 shadow-md rounded-sm transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
    <div className="w-[1500px] mx-auto">
      <ul className="flex text-sm items-center mt-2">
        <li>
          <button
            className="text-blue-700 ml-2 font-bold hover:underline flex items-center"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            戻る
          </button>
        </li>

        <li className="text-gray-500 mx-1">＞</li>

        <li className="text-gray-500 font-bold">
        <FontAwesomeIcon icon={faHome} className="mr-2 text-gray-500 font-bold" />
          Top
        </li>

        <li className="text-gray-500 mx-1">＞</li>

        <li>
          <button
            className="text-blue-700 ml-1 font-bold hover:underline"
            onClick={handleAccountManagement}
          >
            マイページ
          </button>
        </li>

        <li className="text-gray-500 mx-2">＞</li>

        <li>
          {!userLoading && session ? (
            <>
              <LogoutButton className="text-blue-700 ml-2 font-bold hover:underline" />
            </>
          ) : (
            <button
              className="text-blue-700 ml-2 font-bold hover:underline"
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
