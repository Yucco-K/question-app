'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '../../context/LoadingContext';

interface HomePageProps {
  greetingTimeout?: number;
}

export default function Greeting() {
  const [greeting, setGreeting] = useState('');
  const [fade, setFade] = useState(false);
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
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
      router.push('/questions/public');
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

      <div className="flex flex-grow justify-center">
        <h1 className="text-4xl font-bold text-center animate-logo h-screen flex justify-center items-center transform -translate-y-40">
          Engineers Q&A Board
        </h1>
      </div>

      <style jsx>{`
        html, body {
          height: 100%;
          margin: 0;
          overflow: hidden;
        }

        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .animate-fade-in-out {
          animation: fadeInOut 1s ease-in-out forwards;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-logo {
          animation: logoFadeUp 2s ease-in-out forwards;
        }

        @keyframes logoFadeUp {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.8); /* ロゴを下に少し小さく配置 */
          }
          50% {
            opacity: 1;
            transform: translateY(0px) scale(1.05); /* ロゴを少し大きく */
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1); /* ロゴが通常サイズに戻る */
          }
        }

      `}</style>
    </div>
  );
}
