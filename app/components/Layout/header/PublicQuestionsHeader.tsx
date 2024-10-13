import { useState, useEffect} from 'react';
import useAuth from '../../../lib/useAuth';
import { useRouter } from 'next/navigation';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PublicQuestionsHeader() {
  const { session } = useAuth(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // const handleProfileClick = () => {
  //   setDropdownOpen(!isDropdownOpen);
  // };

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
    if (session) {
      router.push('/app/questions');
    }
  }, [session, router]);

  return (
    <header className="bg-gray-100 text-white py-1 fixed top-0 left-0 w-full z-50" style={{ minHeight: '40px' }}>
      <div className="container mx-auto flex justify-between items-center">

        <div className="logo cursor-pointer" onClick={handleLogoClick}>
          Engineers <span>Q&A</span> Board
        </div>

        {/* <div className="relative">

          <div onClick={handleProfileClick} className="w-10 h-10 border bg-white border-gray-300 rounded-sm flex items-center justify-center cursor-pointer">
            <FontAwesomeIcon icon={faUser} className="text-gray-500" size="lg" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">

                <button
                  onClick={() => router.push('/users/login')}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  ログイン
                </button>

            </div>
          )}
        </div> */}
      </div>

      <style jsx>{`
        .logo {
          font-family: 'Exo 2', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #3290fa;
          letter-spacing: 0.1em;
          text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .logo span {
          color: #1de9b6;
        }

        }
      `}</style>
    </header>
  );
}
