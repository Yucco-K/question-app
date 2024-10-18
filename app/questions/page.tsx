// QuestionsPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import QuestionForm from '../components/questions/QuestionForm';
import { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal';
import QuestionList from '../components/questions/QuestionList';
import useAuth from '../lib/useAuth';
import '../globals.css';
import Notification from '../components/ui/Notification';
import TagSearch from '../components/ui/TagSearch';
import { useUser } from '../context/UserContext';


export default function QuestionsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { session, loading, setSession } = useAuth(true) as { session: any; loading: boolean; setSession: (session: any) => void };
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isPublicScreen = false;
  const { userId } = useUser();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/questions/public');
    }
  }, [loading, session, router]);


  const handleSearchCategory = () => {
      router.push('/questions/search/category');
  };

  const handleSortQuestions = () => {
    router.push('/questions/sort');
  };

  const handleFilteredQuestions = () => {
    router.push('/questions/filter');
  };


  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
    <div className="container mx-auto px-4 py-8">
    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="質問を投稿">
      <QuestionForm
        initialTitle={''}
        initialBody={''}
        initialTags={[]}
        onSubmit={function (): void {
          throw new Error('Function not implemented.');
        }}
        onCancel={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </Modal>

    <div className="flex">
      <div className="flex-grow mr-8 w-2/3">
        <QuestionList
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>

      <div className="w-1/3">
        <div className="bg-white shadow-md border rounded-lg p-4 space-y-4">

          <div>
            <button onClick={handleSortQuestions}
              className="block w-full border border-gray-300 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
              ソート
            </button>
          </div>

          <div>
            <button onClick={handleFilteredQuestions}
              className="block w-full border border-gray-300 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
              フィルター
            </button>
          </div>

          <div>
            <button onClick={handleSearchCategory}
              className="block w-full border border-gray-300 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
              カテゴリ検索
            </button>
          </div>

          <TagSearch onTagsSelected={setSelectedTags} />
        </div>
      </div>
    </div>

      <div className="flex justify-between items-center mt-8">
        {!isModalOpen && (
          <button
            className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 ml-60 post-button"
            onClick={() =>{
              setModalOpen(true);
            }}
          >
            <span className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-2xl">
              ⊕
            </span>
            質問を投稿
          </button>
        )}
      </div>

    </div>
    </>
  );
}
