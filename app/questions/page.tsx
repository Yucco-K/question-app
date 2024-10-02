// QuestionsPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import useAuth from '../lib/useAuth';
import LogoutButton from '../components/users/LogoutButton';
import QuestionForm from '../components/questions/QuestionForm';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import QuestionList from '../components/questions/QuestionList';
import '../globals.css';
// import Avatar from '../components/ui/Avatar';

export default function QuestionsPage() {
  const { userId, loading } = useAuth('/users/login', false);
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  // if (loading) {
  //   return <Spinner />;
  // }

  const tags = ['カテゴリ1', 'カテゴリ2', 'カテゴリ3']; // タグを仮で設定

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
        </div>
        {userId ? (
          <>
            <LogoutButton />
          </>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => router.push('/users/login')}
          >
            ログイン
          </button>
        )}
      </div>

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
          <span className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-3xl">
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
