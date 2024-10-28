'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import useAuth from '@/app/lib/useAuth';
import LogoutButton from '../../users/LogoutButton';

export default function MobileQuestionsNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
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
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <nav className="fixed top-16 right-0 w-full bg-white z-50 shadow-md mb-4">
        <div className="w-full mx-auto flex justify-between items-center px-4 pt-6 pb-2">

          <button
            title="Toggle Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`menu-icon ${isMenuOpen ? 'open' : ''} focus:outline-none`}
            // style={{ zIndex: 60 }}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          <h1 className="text-gray-500 font-bold text-md">Top ページ</h1>

        </div>

        {isMenuOpen && (
          <div className="absolute top-20 left-0 w-1/2 bg-black opacity-70 shadow-lg rounded-md p-4 z-50">
            <ul className="flex flex-col">
              <li>
                <button
                  className="text-white hover:underline whitespace-nowrap"
                  onClick={handleBack}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  戻る
                </button>
              </li>

              <li className="text-gray-500 font-bold whitespace-nowrap">
                <FontAwesomeIcon icon={faHome} className="mr-2 text-gray-500 mt-4" />
                Top
              </li>

              {/* <li>
                <button
                  className="text-blue-700 ml-1 mt-2  mb-1 font-bold hover:underline"
                  onClick={handleAccountManagement}
                >
                  マイページ
                </button>
              </li> */}

              <li>
                {!userLoading && session ? (
                  <>
                    <LogoutButton className="text-white ml-1 mt-4 hover:underline" />
                  </>
                ) : (
                  <button
                    className="text-white ml-1 mt-4 hover:underline"
                    onClick={() => handleNavigation('/users/login')}
                  >
                    ログイン
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
        <style jsx>{`
          .menu-icon {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 16px;
            height: 16px;
            cursor: pointer;
            transition: transform 0.3s ease-in-out;
          }

          .bar {
            width: 100%;
            height: 3px;
            background-color: #888;
            border-radius: 5px;
            transition: all 0.3s ease-in-out;
          }

          .menu-icon.open .bar:nth-child(1) {
            transform: rotate(45deg) translate(4.3px, 4.3px); /* 上の線の位置を微調整 */
          }

          .menu-icon.open .bar:nth-child(2) {
            opacity: 0;
          }

          .menu-icon.open .bar:nth-child(3) {
            transform: rotate(-45deg) translate(4.3px, -4.3px); /* 下の線の位置を微調整 */
          }
        `}</style>
      </nav>
    </div>
  );
}

