// QuestionsPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import QuestionForm from '../components/questions/QuestionForm';
import { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal';
import QuestionList from '../components/questions/QuestionList';
import useAuth from '../lib/useAuth';
import '../globals.css';
import { Session } from '@supabase/supabase-js';
import { useLoading } from '../context/LoadingContext';
import Notification from '../components/ui/Notification';


export default function QuestionsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localSession, setLocalSession] = useState<Session | null>(null);
  const { isLoading, setLoading } = useLoading();
  const { session, loading, setSession } = useAuth(true) as { session: any; loading: boolean; setSession: (session: any) => void };
  const router = useRouter();


    // const fetchAndUpdateSession = async () => {
    //   try {
    //     const response = await fetch('/api/auth/get-session', {
    //       method: 'GET',
    //       credentials: 'include',
    //     });

    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log('セッションデータを取得:', data);
    //       setSession(data.session);
    //     } else {
    //       console.error('セッションの取得に失敗しました');
    //     }
    //   } catch (error) {
    //     console.error('セッション更新時のエラー:', error);
    //   }
    // };

    // if (!loading) {
    //   fetchAndUpdateSession();
    // }

  useEffect(() => {
    if (!loading && !session) {
      router.push('/questions/public');
    }
  }, [loading, session, router]);


  const tags = ['カテゴリ1', 'カテゴリ2', 'カテゴリ3']; // タグを仮で設定


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
    {/* <ProfileImageDisplay /> */}
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
          <QuestionList />
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
