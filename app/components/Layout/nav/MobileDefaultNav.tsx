'use client';

import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import useAuth from '@/app/lib/useAuth';
import { useEffect, useState } from 'react';

export default function MobileDefaultNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
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
  else if (pathname.startsWith ('/questions/')) pageTitle = '質問詳細';
  else if (pathname === '/link/contact') pageTitle = 'お問い合わせ';
  else if (pathname === '/link/privacy-policy') pageTitle = 'プライバシーポリシー';
  else if (pathname === '/link/terms') pageTitle = '利用規約';


  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <nav className="fixed top-20 left-0 w-1/2 bg-white z-10">
        <div className="w-full mx-auto flex justify-between items-center px-4 pt-3 pb-2">

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

          {/* <h1 className="text-gray-500 font-bold text-md z-0">{pageTitle}</h1> */}

        </div>

        {isMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-black opacity-70 shadow-lg rounded-md p-4">
            <ul className="flex flex-col">
              <li>
                <button
                  className="text-white hover:underline font-bold whitespace-nowrap"
                  onClick={handleBack}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  戻る
                </button>
              </li>

              <li>
                <button
                  className="text-white ml-2 mt-4 font-bold hover:underline whitespace-nowrap flex items-center"
                  onClick={() => handleNavigation('/questions/public')}
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2 text-blue-500" />
                  Top
                </button>
              </li>

              <li className="text-gray-400 font-bold whitespace-nowrap flex items-center mt-4">
                {pageTitle}
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
