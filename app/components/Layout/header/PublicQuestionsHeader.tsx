import { useState, useEffect} from 'react';
import useAuth from '../../../lib/useAuth';
import { useRouter } from 'next/navigation';

export default function PublicQuestionsHeader() {
  const { session } = useAuth(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

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
