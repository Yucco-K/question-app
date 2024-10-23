import { useState, useEffect} from 'react';

interface PublicQuestionHeaderProps {
  toggleSearchTool: () => void;
}

import useAuth from '../../../lib/useAuth';
import { useRouter } from 'next/navigation';


const PublicQuestionsHeader: React.FC<PublicQuestionHeaderProps> = ({ toggleSearchTool }) => {

  const [isDropdownOpen, setDropdownOpen] = useState(false);
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

  return (
    <header className="bg-gray-100 text-white py-1 fixed top-0 left-0 w-full z-50" style={{ minHeight: '40px' }}>
      <div className="container mx-auto flex justify-between items-center w-[1200px]">

        <div className="logo cursor-pointer ml-4" onClick={handleLogoClick}>
          Engineers <span>Q&A</span> Board
        </div>

        <button
          className="flex items-center bg-gray-400 text-white text-xs px-2 py-1 my-2 mr-20 rounded-full hover:bg-gray-600 ml-10 transition-transform duration-300 ease-in-out transform hover:scale-105 md:hidden"
          onClick={toggleSearchTool}
        >
          <span className="bg-gray-400 text-white rounded-full w-6 h-6 flex items-center flex justify-center mr-2 text-2xl">
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

        }
      `}</style>
    </header>
  );
}

export default PublicQuestionsHeader;
