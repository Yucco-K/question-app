'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import useAuth from '../../lib/useAuth';
import '../../globals.css';
import { Session } from '@supabase/supabase-js';
import { useLoading } from '../../context/LoadingContext';
import Notification from '../../components/ui/Notification';
import PublicQuestionList from '../../components/Questions/PublicQuestionList';
import TagSearch from '@/app/components/ui/TagSearch';
import PublicQuestionsHeader from '@/app/components/Layout/header/PublicQuestionsHeader';
import SearchTool from '@/app/components/ui/SearchTool';


export default function PublicQuestionsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginPromptOpen, setLoginPromptOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localSession, setLocalSession] = useState<Session | null>(null);
  const { isLoading, setLoading } = useLoading();
  const { session, loading: userLoading } = useAuth(false);
  const userId = (session?.user as { id?: string })?.id ?? null;
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isPublicScreen = true;
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  const toggleSearchTool = () => {
    setIsSearchOpen(!isSearchOpen);
  };


  useEffect(() => {
    if (!isLoading && session) {
      // setLocalSession(session);

      router.push('/questions');
    }
  }, [session, router]);


  const handleLogin = () => {
    setLoginPromptOpen(false);
    router.push('/users/login');
  };

  const handleContinueWithoutLogin = () => {
    setLoginPromptOpen(false);
  };


  const handleSearchCategory = () => {
    router.push('/questions/search/category');
  };

  const handleSortQuestions = () => {
    router.push('/questions/search/sort');
  };

  const handleFilteredQuestions = () => {
    router.push('/questions/search/filter');
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
      <div className="container mx-auto px-4">

        <PublicQuestionsHeader toggleSearchTool={toggleSearchTool} />

      {/* <div
        className={`fixed inset-0 bg-white transform transition-transform duration-300 z-40 ${
          isSearchOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-gray-700"
          onClick={toggleSearchTool}
        >
          閉じる
        </button>
          <h2 className="text-xl p-4">検索ツール</h2>
          <div className="p-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (isPublicScreen) {
                  setIsSearchOpen(!isSearchOpen);
                  setLoginPromptOpen(true);
                } else {
                  handleSortQuestions();
                }
                }}
              className="block w-full text-gray-700 border border-gray-500 bg-white rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
              ソート
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (isPublicScreen) {
                  setIsSearchOpen(!isSearchOpen);
                  setLoginPromptOpen(true);
                } else {
                  handleFilteredQuestions();
                }
              }}
              className="block w-full text-gray-700 border border-gray-500 bg-white rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
              フィルター
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (isPublicScreen) {
                  setIsSearchOpen(!isSearchOpen);
                  setLoginPromptOpen(true);
                } else {
                  handleSearchCategory();
                }
              }}
              className="block w-full text-gray-700 border border-gray-500 bg-white rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
              カテゴリ検索
            </button>
            <TagSearch onTagsSelected={setSelectedTags} />
          </div>
        </div> */}

      <div className="container mx-auto px-4 py-8 z-100">

      {/* <Modal
        isOpen={isLoginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        title="ログインしますか？"
      >
      <div
        className="p-4"
        style={{
          backgroundColor: 'rgb(176, 224, 230, 0.5)',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '90%',
          margin: '0 auto',
          zIndex: 1500,
        }}
      >

        <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-5">
          <button
            className="bg-sky-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 w-full md:w-auto"
            onClick={async () => {
              setLoginPromptOpen(false);
              setTimeout(() => {
                router.push('/users/login');
              }, 1000);
            }}
          >
            ログインする
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-3 rounded-md hover:bg-gray-600 w-full md:w-auto"
            onClick={handleContinueWithoutLogin}
          >
            閉じる
          </button>
        </div>
      </div>
      <p className='flex justify-end text-sm text-semibold mt-3'>
        ※ 詳細を見るにはログインが必要です。
      </p>
    </Modal> */}

    <Modal
      isOpen={isLoginPromptOpen}
      onClose={() => setLoginPromptOpen(false)}
      title="ログインしますか？"
    >

      <div
        className="p-4 w-full md:w-2/3 md:flex justify-center items-center"
        style={{
          backgroundColor: 'rgb(176, 224, 230, 0.5)',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '90%',
          margin: '0 auto',
          zIndex: 50,
        }}
      >

      <div className="flex flex-col gap-4 items-center justify-center">
        <button
          className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 w-full max-w-xs whitespace-nowrap mt-8 md:px-8"
          onClick={async () => {
          setLoginPromptOpen(false);
          setTimeout(() => {
            router.push('/users/login');
          }, 1000);
          }}
          >
            ログインする
        </button>
        <button
          className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 w-full max-w-xs mb-4 whitespace-nowrap"
          onClick={handleContinueWithoutLogin}
        >
          閉じる
        </button>
      </div>
    </div>
    <p className='flex justify-center text-sm text-semibold mt-12'>※ 投稿またはソート・フィルタリング・カテゴリ検索には、ログインが必要です。</p>
  </Modal>
  </div>


  <div className="flex justify-end items-center mt-8 mb-4 mr-4 sm:justify-end">
        {!isModalOpen && (
          <button
            className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-transform duration-300 ease-in-out transform scale-105 ml-auto  whitespace-nowrap"
            onClick={() =>{
              setLoginPromptOpen(true);
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
      <PublicQuestionList
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
    </div>

    <div className="w-1/3 mt-20 hidden md:block">
      <div className="bg-white shadow-md border rounded-lg p-4 space-y-4">

        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isPublicScreen) {
                setLoginPromptOpen(true);
              } else {
                handleSortQuestions();
              }
              }}
            className="block w-full text-blue-700 border border-blue-500 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
            ソート
          </button>
        </div>

        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isPublicScreen) {
                setLoginPromptOpen(true);
              } else {
                handleFilteredQuestions();
              }
            }}
            className="block w-full text-blue-700 border border-blue-500 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
            フィルター
          </button>
        </div>

        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isPublicScreen) {
                setLoginPromptOpen(true);
              } else {
                handleSearchCategory();
              }
            }}
            className="block w-full text-blue-700 border border-blue-500 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out">
            カテゴリ検索
          </button>
        </div>

          <TagSearch onTagsSelected={setSelectedTags} />

        </div>
      </div>
    </div>
  </div>

  <SearchTool
      isSearchOpen={isSearchOpen}
      setIsSearchOpen={setIsSearchOpen}
      setLoginPromptOpen={setLoginPromptOpen}
      setSelectedTags={setSelectedTags}
      isPublicScreen={true}
      handleSortQuestions={handleSortQuestions}
      handleFilteredQuestions={handleFilteredQuestions}
      handleSearchCategory={handleSearchCategory}
  />

    {/* <div
      className={`fixed inset-0 bg-white transform transition-transform duration-300 ${
        isSearchOpen ? 'translate-x-0' : 'translate-x-full'
      } z-40 md:hidden`}
    >
      <button
        className="absolute top-4 right-4 text-gray-700"
        onClick={toggleSearchTool}
      >
        閉じる
      </button>
      <h2 className="text-xl p-4">検索ツール</h2>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isPublicScreen) {
                setLoginPromptOpen(true);
              } else {
                handleSortQuestions();
              }
            }}
            className="block w-full text-blue-700 border border-blue-500 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out"
          >
            ソート
          </button>
        </div>

        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isPublicScreen) {
                setLoginPromptOpen(true);
              } else {
                handleFilteredQuestions();
              }
            }}
            className="block w-full text-blue-700 border border-blue-500 bg-gray-100  rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out"
          >
            フィルター
          </button>
        </div>

        <div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isPublicScreen) {
                setLoginPromptOpen(true);
              } else {
                handleSearchCategory();
              }
            }}
            className="block w-full text-blue-700 border border-blue-500 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out"
          >
            カテゴリ検索
          </button>
        </div>

        <TagSearch onTagsSelected={setSelectedTags} />

      </div> */}

        {/* <div className="flex justify-between items-center mt-8 sm:flex-row-reverse sm:justify-end sm:hidden md:block">
          {!isModalOpen && (
            <button
              className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 mr-60 post-button"
          onClick={() =>{
            setLoginPromptOpen(true);
          }}
        >
          <span className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-2xl">
            ⊕
          </span>
          質問を投稿
        </button>
        )}
      </div> */}
    </>
  );
}
