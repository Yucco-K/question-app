import { useState, useEffect, JSX} from 'react';

interface QuestionHeaderProps {
  style?: React.CSSProperties;
}

import useAuth from '../../../lib/useAuth';
import { useRouter } from 'next/navigation';
import LogoutButton from '../../users/LogoutButton';
import CurrentUserNameDisplay from '../../profile/CurrentUserNameDisplay';
import CurrentUserProfileImage from '../../profile/CurrentUserProfileImage';

const QuestionHeader: React.FC<QuestionHeaderProps> = ({ style }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;

  const handleProfileClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleAccountManagement = () => {
    if (userId) {
      router.push(`/users/${userId}`);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (isDropdownOpen && event.target instanceof Element && !event.target.closest('.profile-dropdown')) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

  };


  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop <= 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <header
      className={`fixed top-0 left-0 w-full bg-gray-100 text-white py-1 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: 100 }}
    >
      <div className="container mx-auto flex justify-between items-center w-full px-4">

        <div className="logo cursor-pointer ml-4" onClick={handleLogoClick}>
          Engineers <span>Q&A</span> Board
        </div>

        <div className="relative z-100">
          <div onClick={handleProfileClick} className="cursor-pointer mr-4 z-100">
            <CurrentUserProfileImage />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-sm rounded-md shadow-lg py-2 z-100">
              {session && !userLoading ? (
                <>
                  <div className="ml-4 mt-2 mb-1 text-black whitespace-nowrap z-100">
                    <CurrentUserNameDisplay />
                  </div>
                  <button
                    onClick={handleAccountManagement}
                    className="block w-full px-4 py-1 text-gray-700 hover:bg-gray-100 z-100 text-center"
                  >
                    マイページ
                  </button>

                  <LogoutButton />
                </>
              ) : (
                <button
                  onClick={() => router.push('/users/login')}
                  className="block w-full px-4 py-1 text-gray-700 hover:bg-gray-100 z-100 text-center"
                >
                  ログイン
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .logo {
          font-family: 'Exo 2', sans-serif; /* 未来感のあるフォント */
          font-size: 1rem; /* ロゴを大きく強調 */
          font-weight: 700;
          color: #3290fa; /* サイバーブルーの文字色 */
          letter-spacing: 0.1em; /* 少し文字を広げてクールさを強調 */
          text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3); /* 軽い影で立体感を演出 */
          position: relative;
        }

        .logo span {
          color: #1de9b6 /* Q&Aのアクセントカラー */
        }

        @media (max-width: 640px) {
          .logo {
            display: flex;
            flex-direction: column;
            align-items: center;
            /*font-size: 1.2rem;*/
            text-align: center;
            margin-top: 2px;
          }
        }
      `}</style>
    </header>
  );
}

export default QuestionHeader;
