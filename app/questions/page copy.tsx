// QuestionsPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import QuestionForm from '../components/questions/QuestionForm';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import QuestionList from '../components/questions/QuestionList';
import useAuth from '../lib/useAuth';
import '../globals.css';

export default function QuestionsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginPromptOpen, setLoginPromptOpen] = useState(false);
  const router = useRouter();
  const { session, loading } = useAuth();

  // if (loading) {
  //   return <Spinner />;
  // }

  const tags = ['カテゴリ1', 'カテゴリ2', 'カテゴリ3']; // タグを仮で設定

    // 質問投稿ボタンが押されたときの処理
    const handlePostQuestionClick = () => {
      if (!session) {
        setLoginPromptOpen(true); // ログインの確認モーダルを開く
      } else {
        setModalOpen(true); // ログイン済みの場合、質問投稿モーダルを開く
      }
    };
  
    // ログインする処理
    const handleLogin = () => {
      setLoginPromptOpen(false);
      router.push('/users/login'); // ログイン画面にリダイレクト
    };
  
    // ログインせずに続ける処理
    const handleContinueWithoutLogin = () => {
      setLoginPromptOpen(false); // モーダルを閉じる
    };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 質問投稿モーダル
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="質問を投稿">
        <QuestionForm
          initialTitle={''}
          initialBody={''}
          initialTags={[]}
          onSubmit={function (updatedTitle: string, updatedBody: string, updatedTags: string[]): void {
            throw new Error('Function not implemented.');
          }}
          onCancel={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </Modal> */}

      {/* ログイン確認モーダル */}
      <Modal isOpen={isLoginPromptOpen} onClose={() => setLoginPromptOpen(false)} title="ログインが必要です">
        <div className="p-4">
          <p className="mb-4 text-lg font-semibold">
            質問の投稿にはログインが必要です。ログインしますか？
          </p>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleLogin} // ログイン画面に遷移
            >
              ログインする
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={handleContinueWithoutLogin} // モーダルを閉じて続ける
            >
              ログインせずに閲覧を続ける
            </button>
          </div>
        </div>
      </Modal>

    {/* <div className="container mx-auto px-4 py-8"> */}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="質問を投稿">
        <QuestionForm initialTitle={''} initialBody={''} initialTags={[]} onSubmit={function (updatedTitle: string, updatedBody: string, updatedTags: string[]): void {
          throw new Error('Function not implemented.');
        } } onCancel={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </Modal>

      <div className="flex">

        <div className="flex-grow mr-8">
          <QuestionList />
        </div>

        {/* <div className="flex justify-between items-center mb-4"> */}
        {/* <div className="flex items-center">
        </div> */}

      {/* </div> */}

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

        {/* {userId && ( */}
        {!isModalOpen && (
        <button
          className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 ml-60 post-button"
          onClick={() => setModalOpen(true)}
        >
          <span className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-2xl">
            ⊕
          </span>
          質問を投稿
        </button>
        )}
      {/* )} */}
      </div>
    </div>
  );
}
