'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';

export default function QuestionDetailNav() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };


  return (
    <nav
      className={`fixed top-16 left-0 w-full bg-stone-100 text-gray-700 px-4 py-2 shadow-md rounded-sm transition-opacity duration-500`}
      >
      <div className="w-[1600px] mx-auto">
        <ul className="flex space-x-6 text-md items-center mt-2">

        <li>
          <button
            className="text-blue-700 font-bold ml-4 hover:underline flex items-center"
            onClick={() => handleNavigation('/questions/public')}
            style={{ letterSpacing: '0.1em' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-blue-500 font-bold" />
            {/* <FontAwesomeIcon icon={faHome} className="mx-2 text-blue-500" /> */}
            <span className='text-lg'>公開 ページ</span>
            <span className='text-md flex items-center' style={{ letterSpacing: '0.1em' }}> へ 戻る</span>
          </button>
        </li>

      </ul>
    </div>
    </nav>
  );
}
