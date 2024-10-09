'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@/app/context/UserContext';

export default function QuestionDetailNav() {
  const router = useRouter();
  const { userId } = useUser();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAccountManagement = () => {
    if (userId) {
      router.push(`/users/${userId}`);
    }
  };

  return (
    <nav className="fixed top-10 left-0 bg-white text-gray-700 px-4 py-2 shadow-lg rounded-md">
      <ul className="flex space-x-6 text-sm items-center">
        <li>
          <button
            className="text-blue-500 ml-4 hover:underline flex items-center"
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            戻る
          </button>
        </li>

        <li>
          <button
            className="text-blue-500 ml-10 hover:underline"
            onClick={() => handleNavigation('/questions/public')}
          >
            Top画面
          </button>
        </li>

      </ul>
    </nav>
  );
}
