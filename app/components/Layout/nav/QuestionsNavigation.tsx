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

        <li className="text-gray-500 mx-2">＞</li>

        <li className="text-gray-700">Top 画面</li>

        <li className="text-gray-500 mx-2">＞</li>

        <li>
          <button
            className="text-blue-500 ml-2 hover:underline"
            onClick={() => handleAccountManagement}
          >
            プロフィール
          </button>
        </li>

        <li className="text-gray-500 mx-2">＞</li>

        <li>
          <button
            className="text-blue-500 ml-2 hover:underline"
            onClick={() => handleNavigation('/users/login')}
          >
            ログイン
          </button>
        </li>

      </ul>
    </nav>
  );
}
