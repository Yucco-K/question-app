'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@/app/context/UserContext';
import { useEffect, useState } from 'react';
import LogoutButton from '../../users/LogoutButton';
import useAuth from '../../../lib/useAuth';

export default function QuestionDetailNav() {
  const [isVisible, setIsVisible] = useState(true);
  const { userId } = useUser();
  const { session, loading } = useAuth();
  const router = useRouter();

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
      className={`fixed top-15 left-0 bg-white text-gray-700 px-4 py-2 shadow-md rounded-md transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <ul className="flex space-x-6 text-md items-center mt-4">

        <li>
          <button
            className="text-blue-800 ml-4 hover:underline flex items-center"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            戻る
          </button>
        </li>

        <li>
          <button
            className="text-blue-800 ml-4 hover:underline"
            onClick={() => handleNavigation('/questions/public')}
          >
            Top画面
          </button>
        </li>

        <li className="text-gray-500 mx-2">＞</li>

        <li className="text-gray-700">質問詳細</li>

        <li className="text-gray-500 mx-2">＞</li>

        <li>
          <button
          className="text-blue-800 ml-2 hover:underline"
          onClick={handleAccountManagement}
        >
          マイページ
        </button>
        </li>

        <li className="text-gray-500 mx-2">＞</li>

        <li>
        {!loading && session ? (
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
    </nav>
  );
}
