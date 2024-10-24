'use client';

import { useRouter } from 'next/navigation';
import QuestionForm from '../components/Questions/QuestionForm';
import { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal';
import QuestionList from '../components/Questions/QuestionList';
import useAuth from '../lib/useAuth';
import '../globals.css';
import Notification from '../components/ui/Notification';
import TagSearch from '../components/ui/TagSearch';
import QuestionHeader from '../components/Layout/header/QuestionHeader';
import SearchTool from '../components/ui/SearchTool';


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


    {/* <QuestionHeader toggleSearchTool={toggleSearchTool} /> */}


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

      <div className="flex container mx-auto w-[1200px]">
        <div className="flex-grow mr-8 w-2/3">
          <QuestionList
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>

        <div className="w-1/3 mt-20 hidden md:block">
          <div className="bg-white shadow-md border rounded-lg p-4 space-y-4">

            <div>
              <button onClick={handleSortQuestions}
                className="block w-full text-blue-700 border border-blue-500 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
                ソート
              </button>
            </div>

            <div>
              <button onClick={handleFilteredQuestions}
                className="block w-full text-blue-700 border border-blue-500 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
                フィルター
              </button>
            </div>

            <div>
              <button onClick={handleSearchCategory}
                className="block w-full text-blue-700 border border-blue-500 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
                カテゴリ検索
              </button>
            </div>

            <TagSearch onTagsSelected={setSelectedTags} />
          </div>
        </div>
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

    </div>



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

      <div className="flex justify-end items-center mt-8 sm:justify-end">
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

      <div className="flex container mx-auto w-[1200px]">
        <div className="flex-grow mr-8 w-full">
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
      </div>
    </div>
    </>
  );
}
