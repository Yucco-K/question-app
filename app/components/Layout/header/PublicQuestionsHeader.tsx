import { useState, useEffect} from 'react';

interface PublicQuestionHeaderProps {
  toggleSearchTool: () => void;
}

import useAuth from '../../../lib/useAuth';
import { useRouter } from 'next/navigation';


const PublicQuestionsHeader: React.FC<PublicQuestionHeaderProps> = ({ toggleSearchTool }) => {

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;

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

  // useEffect(() => {
  //   if (session) {
  //     router.push('/app/questions');
  //   }
  // }, [session, router]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop <= 10); // スクロール位置に応じてヘッダーの可視性を切り替え
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

        <div className="logo cursor-pointer my-2 ml-4" onClick={handleLogoClick}>
          Engineers <span>Q&A</span> Board
        </div>

        <button
          className="flex items-center bg-gray-400 text-white text-xs px-2 py-1 my-2 mr-4 rounded-full hover:bg-gray-600 ml-10 transition-transform duration-300 ease-in-out transform hover:scale-105 md:hidden"
          onClick={toggleSearchTool}
        >
          <span className="bg-gray-400 text-white rounded-full w-6 h-6 flex items-center flex justify-center mr-2 text-2xl hover:bg-gray-600">
            ⊕
          </span>
            検索ツール
        </button>

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

        @media (max-width: 640px) {
        .logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          /*font-size: 1.2rem;*/
          text-align: center;
          margin-top: 2px;
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

export default PublicQuestionsHeader;
