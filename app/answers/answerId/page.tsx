'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal'; // モーダルコンポーネントをインポート

export default function AnswerDetail() {
  const pathname = usePathname();
  const answerId = pathname.split('/').pop();
  const [answer, setAnswer] = useState<{ content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false); // モーダル用の状態管理
  const [newAnswer, setNewAnswer] = useState(''); // 新しい回答の入力内容を管理

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

  const handleNewAnswerSubmit = async () => {
    try {
      const response = await fetch(`/api/answers/${answerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newAnswer }),
      });

      if (!response.ok) {
        throw new Error('回答の投稿に失敗しました。');
      }

      setNewAnswer(''); // 投稿成功時、テキストエリアをクリア
      setModalOpen(false); // モーダルを閉じる
      // 再度データをフェッチするなどして表示を更新する
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div>
      {answer ? (
        <>
          <h1>回答の詳細</h1>
          <p>{answer.content}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
            onClick={() => setModalOpen(true)}
          >
            回答を投稿
          </button>

          {/* モーダルの表示 */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            title="回答を投稿"
            buttons={[
              <button
                key="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleNewAnswerSubmit}
              >
                投稿
              </button>
            ]}
          >
            <div className="mb-4">
              <label className="block text-sm font-semibold">本文</label>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="質問の本文を入力してください。"
                className="w-full border rounded px-3 py-2"
              ></textarea>
            </div>
          </Modal>
        </>
      ) : (
        <p>回答が見つかりませんでした。</p>
      )}
    </div>
  );
}
