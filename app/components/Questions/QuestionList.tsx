import { useEffect, useState } from 'react';
import Card from '../ui/Card';
// import Spinner from '../ui/Spinner';
import Notification from '../ui/Notification';
import DOMPurify from 'dompurify';
import styles from './QuestionList.module.css';
import { useLoading } from '../../context/LoadingContext';

interface Question {
  id: string;
  title: string;
  description: string;
  user_id: string;
  category_id: string;
  file_id: string;
  is_draft: boolean;
  created_at: string;
  tags: string[];
}

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { isLoading, setLoading } = useLoading();

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();

      if (response.ok) {
        setQuestions(data);
        setError(null);
      } else {
        setError(data.message || 'データの取得に失敗しました');
        setShowNotification(true);
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました');
      setShowNotification(true);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // if (loading) {
  //   return <Spinner />;
  // }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className={styles.questionBody}>
        <h1 className="text-3xl font-bold mb-6">質問一覧</h1>
        {questions.length === 0 ? (
          <p>質問がありません。</p>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => {
              const sanitizedDescription = DOMPurify.sanitize(question.description);

              return (
                <Card
                  key={`質問ID:${question.id}`}
                  title={`質問: ${question.title}`}
                  footer={<a href={`/questions/${question.id}`}>詳細を見る</a>}
                >
                  <div>
                    <p className="label">質問内容:</p>
                    <div
                      className={styles.questionBody}
                      dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                    />
                  </div>
                  <div className="flex flex-wrap mt-4">
                    {question.tags?.map((tag, index) => (
                      <span key={index} className="bg-blue-500 text-white px-4 rounded-full mr-2 mb-2">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center mt-4">
                    <div className="ml-2">
                      <p className="font-semibold">User ID: {question.user_id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(question.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
