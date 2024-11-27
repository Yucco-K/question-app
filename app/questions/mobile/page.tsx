'use client';

export const fetchCache = 'force-no-store';

import { useRouter } from 'next/navigation';
import QuestionForm from '../../components/Questions/QuestionForm';
import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import QuestionList from '../../components/Questions/QuestionList';
import useAuth from '../../lib/useAuth';
import Notification from '../../components/ui/Notification';
import SearchTool from '@/app/components/ui/SearchTool';
import QuestionHeader from '../../components/Layout/header/QuestionHeader';


export default function MobileQuestionsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isPublicScreen = false;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);


  const toggleSearchTool = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    if (!userLoading && !session) {
      router.push('/questions/public/mobile');
    }
  }, [userLoading, session, router]);


  const handleSortQuestions = () => {
    router.push('/questions/search/sort');
  };

  const handleFilteredQuestions = () => {
    router.push('/questions/search/filter/mobile');
  };

  const handleSearchCategory = () => {
    router.push('/questions/search/category/mobile');
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

      <div className='relative mt-24 mr-8'>
        <button
          className="flex items-center bg-gray-400 text-white text-xs top-20 ml-auto px-2 py-1 rounded-full hover:bg-gray-600 ml-10 transition-transform duration-300 ease-in-out transform hover:scale-105 md:hidden"
          onClick={toggleSearchTool}
        >
          <span className="bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-2xl hover:bg-gray-600">
            ⊕
          </span>
            検索ツール
        </button>
      </div>



    <div className="container mx-auto px-4">

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="質問を投稿">
        <QuestionForm
          initialTitle={''}
          initialBody={''}
          initialTags={[]}
          onSubmit={() => {
            setModalOpen(false);
          }}
          onCancel={() => {
            setModalOpen(false);
          }}
        />
      </Modal>

      <div className="flex justify-end items-center mr-4">
          {!isModalOpen && (
            <button
              className="flex items-center bg-orange-400 text-white mt-4 px-4 py-2 rounded-full hover:bg-orange-600 transition-transform duration-300 ease-in-out transform scale-105 ml-auto whitespace-nowrap"
              onClick={() =>{
                setModalOpen(true);
              }}
            >
              <span className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-2xl  hover:bg-orange-600">
                ⊕
              </span>
              質問を投稿
            </button>
          )}
      </div>

      <div className="w-full">
        <QuestionList
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>

      <SearchTool
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        setLoginPromptOpen={setLoginPromptOpen}
        setSelectedTags={setSelectedTags}
        isPublicScreen={false}
        handleSortQuestions={handleSortQuestions}
        handleFilteredQuestions={handleFilteredQuestions}
        handleSearchCategory={handleSearchCategory}
      />

      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ''}
          type={error ? 'error' : 'success'}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
    </>
  );
}
