'use client';

import { useRouter } from 'next/navigation';
import QuestionForm from '../../components/Questions/QuestionForm';
import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import QuestionList from '../../components/Questions/QuestionList';
import useAuth from '../../lib/useAuth';
import Notification from '../../components/ui/Notification';
import SearchTool from '@/app/components/ui/SearchTool';
import QuestionHeader from '../../components/Layout/header/QuestionHeader';


export default function QuestionsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isPublicScreen = false;
  const [localsession, setLocalSession] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);


  const toggleSearchTool = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    if (!userLoading && !session) {
      router.push('/questions/public');
    }
  }, [userLoading, session, router]);


  const handleSortQuestions = () => {
    router.push('/questions/search/sort');
  };

  const handleFilteredQuestions = () => {
    router.push('/questions/search/filter');
  };

  const handleSearchCategory = () => {
    router.push('/questions/search/category');
};

  useEffect(() => {
      setLocalSession(session);
      console.log('localsession:', session);
  }, [session]);


  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}

    <QuestionHeader toggleSearchTool={toggleSearchTool} />


    <div className="container mx-auto px-4 py-8">

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

      <div className="flex justify-end items-center mt-8 mb-4 mr-4">
          {!isModalOpen && (
            <button
              className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-transform duration-300 ease-in-out transform scale-105 ml-auto  whitespace-nowrap"
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

      {/* 質問リスト */}
      <div className="w-full">
        <QuestionList
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
      </div>

      {/* 検索ツール */}
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
