'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HomePageProps {
  greetingTimeout?: number;
}

export default function Greeting() {
  const [greeting, setGreeting] = useState('');
  const [fade, setFade] = useState(false);
  const router = useRouter();
  const greetingTimeout = 0.1 * 60 * 60 * 1000;

  useEffect(() => {
    const now = Date.now();
    const greetingTimeout = 8 * 60 * 60 * 1000;

    const lastGreetingTime = localStorage.getItem('lastGreetingTime');

    if (!lastGreetingTime || now - parseInt(lastGreetingTime, 10) >= greetingTimeout) {

      if (!lastGreetingTime) {
        setGreeting('さあ、始めましょう！');

      } else {
        const nowHours = new Date().getHours();
        if (nowHours >= 5 && nowHours < 12) {
          setGreeting('おはようございます！');
        } else if (nowHours >= 12 && nowHours < 18) {
          setGreeting('こんにちは！');
        } else {
          setGreeting('こんばんは！');
        }
      }
      localStorage.setItem('lastGreetingTime', now.toString());

    }

    const interval = setInterval(() => {
      setFade((prev) => !prev);
    }, 1000);

    setTimeout(() => {
      router.push('/questions');
    }, 1000);

    return () => clearInterval(interval);

  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col justify-between">
      <div className="text-center mt-4">
        <h1 className={`text-2xl font-semibold animate-fade-in-out`}>
          {greeting}
        </h1>
      </div>

      <div className="flex flex-grow justify-center items-center">
        <h1 className="text-6xl font-bold text-center animate-fade">Engineers Q&A Board</h1>
      </div>

      <style jsx>{`
        .animate-fade-in-out {
          animation: fadeInOut 1s ease-in-out forwards;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0; /* 初期状態は透明 */
          }
          20% {
            opacity: 1; /* 少し遅れてフェードイン */
          }
          80% {
            opacity: 1; /* 一定時間表示状態を保つ */
          }
          100% {
            opacity: 0; /* 最後にフェードアウト */
          }
        }
        .animate-fade {
          animation: fadeOut 1s forwards; /* forwardsでフェードアウトした後の状態を維持 */
        }

        @keyframes fadeOut {
          0% {
            opacity: 1; /* 初期状態は表示 */
          }
          100% {
            opacity: 0; /* フェードアウトして透明になる */
          }
        }
      `}</style>

    </div>
  );
}
