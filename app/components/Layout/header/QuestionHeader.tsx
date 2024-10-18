import { useState, useEffect} from 'react';
import useAuth from '../../../lib/useAuth';
import { useRouter } from 'next/navigation';
import LogoutButton from '../../users/LogoutButton';
import { useUser } from '@/app/context/UserContext';
import CurrentUserNameDisplay from '../../profile/CurrentUserNameDisplay';
import CurrentUserProfileImage from '../../profile/CurrentUserProfileImage';

export default function DefaultHeader() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { userId, username } = useUser();
  const { session, loading } = useAuth();

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


  return (
    <header className="bg-gray-100 text-white py-1 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">

        <div className="logo cursor-pointer" onClick={handleLogoClick}>
          Engineers <span>Q&A</span> Board
        </div>

        <div className="relative">
          <div onClick={handleProfileClick} className="cursor-pointer">
            <CurrentUserProfileImage />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
              {session && !loading ? (
                <>
                  <div className="ml-4 my-2 text-black whitespace-nowrap">
                    <CurrentUserNameDisplay />
                  </div>
                  <button
                    onClick={handleAccountManagement}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    マイページ
                  </button>

                  <LogoutButton />
                </>
              ) : (
                <button
                  onClick={() => router.push('/users/login')}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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

        }
      `}</style>
    </header>
  );
}
