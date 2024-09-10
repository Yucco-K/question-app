'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from './components/users/LogoutButton';
import Spinner from './components/Spinner';
import Notification from './components/layout/Notification';
import useAuth from './lib/useAuth';

interface HomePageProps {
  greetingTimeout?: number; // 可変にするための引数、デフォルトは8時間
}

export default function HomePage() {
  const { userId, error, loading } = useAuth('/', false);
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  const [isReturningUser, setIsReturningUser] = useState(false);
  const router = useRouter();
  const greetingTimeout = 0.1 * 60 * 60 * 1000;

  useEffect(() => {
    const now = Date.now();

    if (typeof window !== 'undefined') {
      const lastVisit = localStorage.getItem('lastVisitTime');

      if (lastVisit && now - parseInt(lastVisit, 10) < greetingTimeout) {
        setIsReturningUser(true);
      } else {
        localStorage.setItem('lastVisitTime', now.toString());
        setIsReturningUser(false);
      }
    }

    const nowHours = new Date().getHours();

    if (isReturningUser) {
      setGreeting(`お帰りなさい！${userId}さん`);
    } else {
      if (nowHours >= 5 && nowHours < 12) {
        setGreeting(`おはようございます！${userId}さん`);
      } else if (nowHours >= 12 && nowHours < 18) {
        setGreeting(`こんにちは！${userId}さん`);
      } else {
        setGreeting(`こんばんは！${userId}さん`);
      }
    }

    const timer = setTimeout(() => {
      router.push('/questions');
    }, 6000);

    return () => clearTimeout(timer);
  }, [userId, isReturningUser, greetingTimeout, router]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end space-x-4 mb-4">
        {showNotification && (error || success) && (
          <Notification
            message={error ?? success ?? ""}
            type={error ? "error" : "success"}
            onClose={() => setShowNotification(false)}
          />
        )}
        {userId ? (
          <>
            <p>userID: {userId}</p>
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

      <div>
        {userId ? (
          <>
            <div className="flex flex-col justify-between h-screen bg-gradient-to-b from-blue-900 to-indigo-600 text-white font-sans">
              <div className="p-8">
                <h1 className="text-4xl font-extrabold text-center my-10 drop-shadow-lg">
                新しい質問に挑戦して、コミュニティに貢献してみませんか？</h1>
                  <p className="text-3xl text-center text-indigo-300 my-10">現在 ログイン中です。</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-3xl font-semibold text-center my-10 animate-pulse">
                  3秒後に質問一覧ページに遷移します。
                </h1>
              </div>
              <div className="bg-gray-900 bg-opacity-75 text-center p-4 mt-auto rounded-t-lg shadow-lg">
              <h2 className="text-lg font-semibold">{`メンテナンス情報：現在 ${new Date().toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })} 通常稼働中`}</h2>
                {/* <p className="text-sm text-gray-400">リリース情報：○○○○年△△月○○日 ○○××△△○○○○</p> */}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-between h-screen bg-gradient-to-b from-blue-900 to-indigo-600 text-white font-sans">
            <div className="p-8">
              <h1 className="text-4xl font-extrabold text-center mb-4 drop-shadow-lg">
              エンジニアQ & A ボードへようこそ！</h1>
              <p className="text-3xl text-center text-indigo-300 my-10">さあ、始めましょう！</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-3xl font-semibold text-center mb-4 animate-pulse">
                3秒後に質問一覧ページに遷移します。
              </h1>
            </div>
            <div className="bg-gray-900 bg-opacity-75 text-center p-4 mt-auto rounded-t-lg shadow-lg">
            <h2 className="text-lg font-semibold">{`メンテナンス情報：現在 ${new Date().toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })} 通常稼働中`}</h2>
              {/* <p className="text-sm text-gray-400">リリース情報：○○○○年△△月○○日 ○○××△△○○○○</p> */}
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
