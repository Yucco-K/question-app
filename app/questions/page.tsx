// QuestionsPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import useAuth from '../lib/useAuth';
import LogoutButton from '../components/users/LogoutButton';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
// import Avatar from '../components/ui/Avatar';

export default function QuestionsPage() {
  const { userId, loading } = useAuth('/users/login', false);
  const router = useRouter();

  if (loading) {
    return <Spinner />;
  }

  const tags = ['カテゴリ1', 'カテゴリ2', 'カテゴリ3']; // タグを仮で設定

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ログイン/ログアウトボタン */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
        </div>
        {userId ? (
          <LogoutButton />
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => router.push('/users/login')}
          >
            ログイン
          </button>
        )}
      </div>

      <div className="flex">
        {/* 左側の質問カード部分 */}
        <div className="flex-grow mr-8">
          <h1 className="text-3xl font-bold mb-6">質問一覧</h1>

          {/* 質問カード */}
          <div className="space-y-4">
            <Card
              title="質問1: 〇〇について"
              footer={<button className="text-blue-500">詳細を見る</button>}
            >
              <p>これは質問の概要です。</p>
              {/* タグ */}
              <div className="flex flex-wrap mt-4">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
              {/* ユーザープロフィール */}
              <div className="flex items-center mt-4">
                <div className="ml-2">
                  <p className="font-semibold">User Name</p>
                  <p className="text-sm text-gray-500">2024/01/14 12:12</p>
                </div>
              </div>
            </Card>

            <Card title="質問2: 〇〇の解決方法">
              <p>こちらは別の質問です。</p>
              {/* タグ */}
              <div className="flex flex-wrap mt-4">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
              {/* ユーザープロフィール */}
              <div className="flex items-center mt-4">
                <div className="ml-2">
                  <p className="font-semibold">User Name</p>
                  <p className="text-sm text-gray-500">2024/01/14 12:12</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 右側のソート、フィルター、タグ部分 */}
        <div className="w-1/3">
        <div className="bg-white shadow-md border rounded-lg p-4 space-y-4">
          {/* ソート */}
          <div>
            <h3 className="font-bold mb-2">ソート</h3>
            <select id="sort" className="block w-full border rounded-md p-2" title="Sort">
              <option value="newest">新着順</option>
              <option value="popular">人気順</option>
            </select>
          </div>

          {/* フィルター */}
          <div>
            <h3 className="font-bold mb-2">フィルター</h3>
            <select id="status" className="block w-full border rounded-md p-2" title="Status">
              <option value="all">全て</option>
              <option value="open">オープン</option>
              <option value="closed">クローズ</option>
            </select>
          </div>

          {/* タグ */}
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

        {/* 質問を投稿ボタン */}
        <button
          className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 ml-60"
          onClick={() => router.push('/questions/new')}
        >
          <span className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-3xl">
            ⊕
          </span>
          質問を投稿
        </button>
      </div>
    </div>
  );
}
