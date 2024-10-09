// QuestionsPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import useAuth from '../../lib/useAuth';
import '../../globals.css';
import { Session } from '@supabase/supabase-js';
import { useLoading } from '../../context/LoadingContext';
import Notification from '../../components/ui/Notification';
import PublicQuestionList from '@/app/components/questions/PublicQuestionList';
import NavigationBar from '@/app/components/ui/NavigationBar';



export default function PublicQuestionsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginPromptOpen, setLoginPromptOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localSession, setLocalSession] = useState<Session | null>(null);
  const { isLoading, setLoading } = useLoading();
  const { session, loading } = useAuth(false);
  const router = useRouter();


  useEffect(() => {
    if (!loading && session) {
      setLocalSession(session);
      console.log('AuthContextから取得したsession:', session);

      router.push('/questions');
    }
  }, [session, router]);

  const tags = ['カテゴリ1', 'カテゴリ2', 'カテゴリ3']; // タグを仮で設定



  const handleLogin = () => {
    setLoginPromptOpen(false);
    router.push('/users/login');
  };


    const handleContinueWithoutLogin = () => {
      setLoginPromptOpen(false);
    };


    useEffect(() => {
      console.log('session:', session);
      // console.log('userId', userId) // ログイン状態を確認
    } , [session]);


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

      {/* <NavigationBar /> */}

      <Modal
        isOpen={isLoginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        title="ログインしますか？"
      >

        <div
          className="p-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '50%',
            margin: '0 auto',
            zIndex: 1500,
          }}
        >

          <div className="flex justify-center space-x-5">
            <button
              className="bg-blue-500 text-white px-4 py-3 m-6 rounded-md hover:bg-blue-600"
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
              className="bg-gray-500 text-white px-4 py-3 m-6 rounded-md hover:bg-gray-600"
              onClick={handleContinueWithoutLogin}
            >
              閉じる
            </button>
          </div>
          {/* <p className="mb-4 text-sm text-gray-500 font-semibold">※ 投稿にはログインが必要です。</p> */}
        </div>
        <p className='flex justify-end text-sm text-semibold'>※ 投稿にはログインが必要です。</p>
      </Modal>

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

      <div className="flex">
        <div className="flex-grow mr-8">
          <PublicQuestionList />
        </div>

        <div className="w-1/3">
        <div className="bg-white shadow-md border rounded-lg p-4 space-y-4">

          <div>
            <h3 className="font-bold mb-2">ソート</h3>
            <select id="sort" className="block w-full border rounded-md p-2" title="Sort">
              <option value="newest">新着順</option>
              <option value="popular">人気順</option>
            </select>
          </div>

          <div>
            <h3 className="font-bold mb-2">フィルター</h3>
            <select id="status" className="block w-full border rounded-md p-2" title="Status">
              <option value="all">全て</option>
              <option value="open">オープン</option>
              <option value="closed">クローズ</option>
            </select>
          </div>


          <div>
            <h3 className="font-bold mb-2">タグ</h3>
            <input
              type="text"
              placeholder="追加するタグを検索できます"
              className="w-full border rounded-md p-2 mb-2"
            />
            <div className="flex flex-wrap">
              {tags.map((tag, index) => (
                <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* ページネーションと質問を投稿ボタン */}
      <div className="flex justify-between items-center mt-8">
        {/* ページネーション */}
        <div className="flex-grow flex justify-center space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded-l-lg">«</button>
          <button className="px-4 py-2 bg-blue-500 text-white">1</button>
          <button className="px-4 py-2 bg-gray-200">2</button>
          <button className="px-4 py-2 bg-gray-200">3</button>
          <button className="px-4 py-2 bg-gray-200 rounded-r-lg">»</button>
        </div>
      </div>

    </div>
    </>
  );
}
