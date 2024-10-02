import { useEffect, useState } from 'react';
import Notification from '../../components/ui/Notification';
import Form from '../../components/ui/Form';
import useAuth from '../../lib/useAuth';
import { useRouter } from 'next/router';

export default function EditQuestion() {
  const { userId, loading: authLoading } = useAuth(); // useAuthフックからuserIdを取得

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);  // タグ用の状態を追加
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [questionId, setQuestionId] = useState<string | null>(null);

  useEffect(() => {
    // router.asPath から questionId を取得する方法
    const { questionId } = router.query; // URLクエリからquestionIdを取得
    if (questionId && typeof questionId === 'string') {
      setQuestionId(questionId);
    }
  }, [router]);

  if (!questionId) {
    return <p>読み込み中...</p>;
  }

  useEffect(() => {
    const fetchQuestionData = async () => {
      if (questionId) {
        try {
          const response = await fetch(`/api/questions/${questionId}`);
          const data = await response.json();
          if (response.ok) {
            setTitle(data.title);
            setDescription(data.description);
            setTags(data.tags || []); // タグもセット
          } else {
            setError('質問の取得に失敗しました');
          }
        } catch (error) {
          setError('エラーが発生しました');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchQuestionData();
  }, [questionId]);

  const handleUpdate = async () => {
    if (!userId) {
      setError('ユーザー情報が取得できません。');
      setShowNotification(true);
      return;
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          userId,  // userId を送信
          tags,    // フォームから取得したタグを送信
        }),
      });

      if (response.ok) {
        setSuccess('質問が更新されました');
        setShowNotification(true);
        router.push(`/questions/${questionId}`);
      } else {
        setError('更新に失敗しました');
        setShowNotification(true);
      }
    } catch (err) {
      setError('更新中にエラーが発生しました');
      setShowNotification(true);
    }
  };

  if (loading || authLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">質問を編集</h1>

      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}

      <Form
        titleLabel="タイトル"
        titlePlaceholder="新しいタイトルを入力してください"
        bodyLabel="内容"
        bodyPlaceholder="新しい内容を入力してください"
        initialTitle={title}
        initialBody={description}
        onTitleChange={setTitle}
        onBodyChange={setDescription}
      />

      {/* タグのフォームフィールドを追加 */}
      <Form
        titleLabel="タグ"
        titlePlaceholder="タグをカンマで区切って入力してください"
        initialTags={tags.join(', ')} // カンマ区切りで表示
        onTagsChange={(newTags) => setTags(newTags.split(',').map(tag => tag.trim()))} // タグを分割して配列に変換
        bodyLabel={''} bodyPlaceholder={''} initialTitle={''} initialBody={''} onTitleChange={function (newTitle: string): void {
          throw new Error('Function not implemented.');
        } } onBodyChange={function (newBody: string): void {
          throw new Error('Function not implemented.');
        } }      />

      <div className="mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleUpdate}
        >
          更新
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => router.push(`/questions/${questionId}`)}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
