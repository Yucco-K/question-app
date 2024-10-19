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


export default function PublicQuestionsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginPromptOpen, setLoginPromptOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localSession, setLocalSession] = useState<Session | null>(null);
  const { isLoading, setLoading } = useLoading();
  const { session, loading } = useAuth(false);
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isPublicScreen = true;


  useEffect(() => {
    if (!loading && session) {
      setLocalSession(session);

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

      <Modal
        isOpen={isLoginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        title="ログインしますか？"
      >

        <div
          className="p-4"
          style={{
            backgroundColor: 'rgb(255, 248, 220, 0.9)',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '50%',
            margin: '0 auto',
            zIndex: 1500,
          }}
        >

          <div className="flex justify-center space-x-5">
            <button
              className="bg-orange-400 text-white px-4 py-3 m-6 rounded-md hover:bg-orange-500"
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
              className="bg-neutral-500 text-white px-4 py-3 m-6 rounded-md hover:bg-gray-600"
              onClick={handleContinueWithoutLogin}
            >
              閉じる
            </button>
          </div>
        </div>
        <p className='flex justify-end text-sm text-semibold mt-3'>※ 投稿またはソート・フィルタリング・カテゴリ検索にはログインが必要です。</p>
      </Modal>

      <div className="flex">
        <div className="flex-grow mr-8 w-2/3">
          <PublicQuestionList
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>

        <div className="w-1/3">
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
                className="block w-full border border-gray-300 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out"
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
                className="block w-full border border-gray-300 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out"
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
                className="block w-full border border-gray-300 bg-gray-100 rounded-md p-2 hover: transition transform hover:scale-105 duration-300 ease-in-out"
              >
                カテゴリ検索
              </button>
            </div>

            <TagSearch onTagsSelected={setSelectedTags} />

            </div>

          {!isModalOpen && (
          <button
            className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 ml-60 post-button"
            style={{ zIndex: 10 }}
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
      </div>
    </div>
    </>
  );
}
