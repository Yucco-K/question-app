'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '../../components/ui/Modal';
import ButtonGroup from '../../components/ui/ButtonGroup';
import Form from '../../components/ui/Form';
import { useUser } from '../../context/UserContext';

export default function AnswerDetail() {
  const pathname = usePathname();
  const answerId = pathname.split('/').pop();
  const [answer, setAnswer] = useState<{ content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [initialTitle, setInitialTitle] = useState('');
  const [initialBody, setInitialBody] = useState('');
  const { userId, loading: userLoading, error: userError } = useUser();

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

      setNewAnswer('');
      setModalOpen(false);
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

          <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            title="回答を投稿"
          >
            <Form
              titleLabel="回答"
              titlePlaceholder="回答の内容を入力してください"
              bodyLabel=""
              bodyPlaceholder="詳細な説明を追加してください"
              initialTitle={initialTitle}
              initialBody={initialBody}
              onTitleChange={(newTitle) => setInitialTitle(newTitle)}
              onBodyChange={(newBody) => setInitialBody(newBody)}
            />

          </Modal>

          <ButtonGroup
            pattern={1} // 使用するボタンの配置パターン
            buttons={[
              {
                label: '投稿',
                className: 'px-4 py-2 bg-blue-500 text-white rounded',
                onClick: handleNewAnswerSubmit,
              },
            ]}
            buttonsPerRow={[1]} // 各行のボタン数を配列で指定
          />
        </>
      ) : (
        <p>回答が見つかりませんでした。</p>
      )}
    </div>
  );
}
