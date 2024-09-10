'use client';

import { useRouter } from 'next/navigation';
import useAuth from '../lib/useAuth';
import LogoutButton from '../components/users/LogoutButton'; // ログアウトボタンのインポート
import Spinner from '../components/Spinner';
import { useEffect, useState } from 'react';

export default function QuestionsPage() {
  const { userId, loading } = useAuth('/users/login', false); // 認証不要ページとして設定
  const router = useRouter(); // ログインボタン用

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 画面上部にログイン/ログアウトボタン */}
      <div className="flex justify-end mb-4">
        {userId ? (
          <LogoutButton /> // ログイン中ならログアウトボタンを表示
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => router.push('/users/login')} // ログインしていない場合はログイン画面に遷移
          >
            ログイン
          </button>
        )}
      </div>

      <h1 className="text-4xl font-bold text-center">質問一覧</h1>
      <p className="text-center text-lg text-gray-700 mb-4">
        ここでは、他のユーザーが投稿した質問を確認できます。
      </p>

      {/* 認証されている場合のアクション */}
      {userId ? (
        <div className="flex justify-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            質問を投稿する
          </button>
        </div>
      ) : (
        <p className="text-center text-red-500">
          質問を投稿するにはログインが必要です。
        </p>
      )}

      {/* 認証されていなくても質問一覧は表示 */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">質問リスト</h2>
        {/* ここに質問リストを表示 */}
        <ul>
          {/* 仮データの例 */}
          <li className="mb-2">質問1: XXXに関する質問です</li>
          <li className="mb-2">質問2: YYYに関する質問です</li>
          <li className="mb-2">質問3: ZZZに関する質問です</li>
        </ul>
      </div>
    </div>
  );
}
