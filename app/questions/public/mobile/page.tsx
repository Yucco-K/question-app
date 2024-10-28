'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuth from '../../../lib/useAuth';
import { Session } from '@supabase/supabase-js';
import { useLoading } from '../../../context/LoadingContext';
import Notification from '../../../components/ui/Notification';
import PublicQuestionList from '../../../components/Questions/PublicQuestionList';
import PublicQuestionsHeader from '@/app/components/Layout/header/PublicQuestionsHeader';
import SearchTool from '@/app/components/ui/SearchTool';


export default function MobilePublicQuestionsPage() {
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


  useEffect(() => {
    if (!isLoading && session) {
      // setLocalSession(session);

      router.push('/questions/mobile');
    }
  }, [session, router]);


  const toggleSearchTool = () => {
    setIsSearchOpen(!isSearchOpen);
  };


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

        {isLoginPromptOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex flex-col items-center justify-center z-50"
          onClick={() => setLoginPromptOpen(false)}
        >
          <div
            className="bg-white p-10 rounded shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center mb-6">ログインしますか？</p>

            <div className="flex flex-col gap-4 items-center justify-center">
              <button
                className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 w-full max-w-xs whitespace-nowrap mt-8"
                onClick={() => {
                  setLoginPromptOpen(false);
                  setTimeout(() => {
                    router.push('/users/login');
                  }, 1000);}
                }
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

            <p className="text-gray-500 text-sm mt-4">
              ※ 投稿またはソート・フィルタリング・カテゴリ検索には、ログインが必要です。
            </p>
          </div>
        </div>
      )}


        <div className="flex justify-end items-center mt-20 mr-4 justify-end">
          {!isModalOpen && (
            <button
              className="flex items-center mt-8 mb-2 bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-transform duration-300 ease-in-out transform scale-105 ml-auto  whitespace-nowrap"
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


        {/* <div className="flex container mx-auto w-[1200px]"> */}
        <div className="w-full">
            <PublicQuestionList
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
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
        </div>
      {/* </div> */}
    </>
  );
}
