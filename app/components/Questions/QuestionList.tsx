import { useCallback, useEffect, useState } from 'react';
import Card from '../ui/Card';
import Notification from '../ui/Notification';
import DOMPurify from 'dompurify';
import styles from './QuestionList.module.css';
import { useLoading } from '../../context/LoadingContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faSync } from '@fortawesome/free-solid-svg-icons';

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
  const [usernames, setUsernames] = useState<{ [userId: string]: string }>({});
  const { isLoading, setLoading } = useLoading();
  const [isBottomVisible, setIsBottomVisible] = useState(false);

  const fetchUsername = async (userId: string) => {
    if (usernames[userId]) return;
    try {
      const response = await fetch(`/api/users/${userId}/name`);
      const data = await response.json();
      if (response.ok) {
        setUsernames((prevUsernames) => ({
          ...prevUsernames,
          [userId]: data.username,
        }));
        console.log('question user:',data);
      } else {
        setError(data.message || 'ユーザー名の取得に失敗しました');
        setShowNotification(true);
      }
    } catch (err) {
      setError('ユーザー名の取得中にエラーが発生しました');
      setShowNotification(true);
    }
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      console.log('questions:',data);

      if (response.ok) {
        setQuestions(data);
        setError(null);

      data.forEach((question: Question) => {
        if (question.user_id) {
          fetchUsername(question.user_id);
        }
      }
    );
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
  }, [setLoading]);

  useEffect(() => {
    fetchQuestions();

  }, [fetchQuestions]);


  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        setIsBottomVisible(false);
      } else {
        setIsBottomVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };


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
      <div className="my-4 top-0">
        <button
          onClick={fetchQuestions}
          className="text-gray-500 bg-gray-100 text-lg p-1 rounded hover:text-gray-900"
          title="質問一覧を再読み込み"
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />
        </button>
      </div>
      <div className={styles.questionBody}>
        <h1 className="text-3xl font-bold mb-6">質問一覧</h1>
        {questions.length === 0 ? (
          <p>質問がありません。</p>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => {
              const sanitizedDescription = DOMPurify.sanitize(question.description);
              const username = usernames[question.user_id] || 'ユーザー名取得中...';

              return (
                <Card
                  key={`質問ID:${question.id}`}
                  title={question.title}
                  categoryId={question.category_id}
                  footer={<a href={`/questions/${question.id}`} className='text-md'>詳細を見る</a>}
                >
                  <div className='text-2xl'>
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
                    <div>
                      <p className="font-semibold">{username}</p>
                    </div>
                    <div className="text-left text-sm mt-2 text-gray-500">
                        {question.created_at ? (
                          new Date(question.created_at).toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })

                        ) : (
                          '作成日登録なし'
                        )}
                      </div>
                      </div>
                    </div>
                  </Card>
              );
            })}
          </div>
        )}
        {/* スクロールボタンの追加 */}
        {isBottomVisible && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-10 right-10 bg-white-500 text-gray-500 p-4 rounded-full shadow-lg hover:text-gray-700"
            title="ページの下部に移動"
          >
            <FontAwesomeIcon icon={faArrowDown} size="lg" />
          </button>
        )}
      </div>
    </>
  );
}
