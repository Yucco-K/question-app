'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function QuestionDetail() {
  const pathname = usePathname();
  const questionId = pathname.split('/').pop();
  const [question, setQuestion] = useState<{ title: string, content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (questionId) {
      const fetchQuestion = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/questions/${questionId}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || '質問が見つかりませんでした');
          }

          setQuestion(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false); // ローディング状態を終了
        }
      };

      fetchQuestion();
    }
  }, [questionId]);

  // ローディング中のスピナーを表示
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  // エラーが発生した場合の表示
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>エラー: {error}</p>
      </div>
    );
  }

  // 質問が見つかった場合の表示
  return (
    <div className="container mx-auto p-4">
      {question ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
          <p>{question.content}</p>
          {/* <p>投稿者: {question.author}</p> */}
        </>
      ) : (
        <p>質問が見つかりませんでした。</p>
      )}
    </div>
  );
}
