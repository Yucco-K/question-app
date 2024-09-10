'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AnswerDetail() {
  const pathname = usePathname();
  const answerId = pathname.split('/').pop();
  const [answer, setAnswer] = useState<{ content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (answerId) {
      const fetchAnswer = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/answers/${answerId}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || '回答が見つかりませんでした');
          }

          setAnswer(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchAnswer();
    }
  }, [answerId]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div>
      {answer ? (
        <>
          <h1>回答の詳細</h1>
          <p>{answer.content}</p>
          {/* 他の回答の詳細情報を追加 */}
        </>
      ) : (
        <p>回答が見つかりませんでした。</p>
      )}
    </div>
  );
}
