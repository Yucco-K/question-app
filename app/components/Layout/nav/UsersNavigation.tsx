'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function QuestionDetailNav() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };


  return (
    <nav
      className={`fixed top-15 left-0 w-full bg-stone-100 text-gray-700 px-4 py-2 shadow-md rounded-sm transition-opacity duration-500`}
      >
      <div className="w-[1200px] mx-auto">
        <ul className="flex space-x-6 text-sm items-center mt-2">

        <li>
          <button
            className="text-blue-800 font-bold ml-4 hover:underline flex items-center"
            onClick={() => handleNavigation('/questions/public')}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 font-bold" />
            公開ページへ戻る
          </button>
        </li>

      </ul>
    </div>
    </nav>
  );
}
