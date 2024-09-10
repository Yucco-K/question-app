'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function VoteDetail() {
  const pathname = usePathname();
  const voteId = pathname.split('/').pop();
  const [vote, setVote] = useState<{ title: string, count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (voteId) {
      const fetchVote = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/votes/${voteId}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || '投票が見つかりませんでした');
          }

          setVote(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchVote();
    }
  }, [voteId]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div>
      {vote ? (
        <>
          <h1>投票タイトル: {vote.title}</h1>
          <p>投票数: {vote.count}</p>
          {/* 他の投票詳細情報を追加 */}
        </>
      ) : (
        <p>投票が見つかりませんでした。</p>
      )}
    </div>
  );
}
