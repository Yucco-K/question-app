import { MouseEvent as ReactMouseEvent, useCallback, useEffect, useState } from 'react';
import Card from '../ui/Card';
import Notification from '../ui/Notification';
import Modal from '../ui/Modal'; // Add this line to import Modal
import DOMPurify from 'dompurify';
import styles from './QuestionList.module.css';
import { useLoading } from '../../context/LoadingContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faSync } from '@fortawesome/free-solid-svg-icons';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import { useRouter } from 'next/navigation';
import useAuth from '@/app/lib/useAuth';
import ProfileImageDisplay from '../profile/ProfileImageDisplay';

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

export default function PublicQuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [usernames, setUsernames] = useState<{ [userId: string]: string }>({});
  const { isLoading, setLoading } = useLoading();
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const [isLoginPromptOpen, setLoginPromptOpen] = useState(false);
  const router = useRouter();
  const { session } = useAuth(false);

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


  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY;
  //     const documentHeight = document.documentElement.scrollHeight;
  //     const windowHeight = window.innerHeight;

  //     if (scrollTop + windowHeight >= documentHeight - 100) {
  //       setIsBottomVisible(false);
  //     } else {
  //       setIsBottomVisible(true);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);


  // const scrollToBottom = () => {
  //   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  // };


  // ログインする処理
  const handleLogin = () => {
    setLoginPromptOpen(false);
    router.push('/users/login');
  };

  // ログインせずに続ける処理
  const handleContinueWithoutLogin = () => {
    setLoginPromptOpen(false);
  };

  // 詳細ページへ遷移する処理
  const handleViewDetails = (e: ReactMouseEvent<HTMLAnchorElement>, question: Question) => {
    e.preventDefault();

    if (!session) {
      // 未ログインの場合はログインモーダルを表示
      setLoginPromptOpen(true);
    } else {
      // ログイン済みの場合は詳細ページに遷移
      router.push(`/questions/${question.id}`);
    }
  };

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
        <div className='flex justify-between'>
          <h1 className="text-2xl font-bold mb-1">質問一覧</h1>
          <div className="my-2 top-0">
          <button
            onClick={fetchQuestions}
            className="text-gray-500 bg-gray-100 text-lg p-1 rounded hover:text-gray-900"
            title="質問一覧を再読み込み"
          >
            <FontAwesomeIcon icon={faSync} className="mr-2" />
          </button>
        <ScrollToBottomButton />
        </div>
      </div>
        {questions.length === 0 ? (
          <p>質問がありません。</p>
        ) : (
          <div className="space-y-4 text-md">
            {questions.map((question) => {
              const sanitizedDescription = DOMPurify.sanitize(question.description);
              const username = usernames[question.user_id] || 'ユーザー名取得中...';

            return (
              <>
                <Card
                  key={`質問ID:${question.id}`}
                  title={question.title}
                  categoryId={question.category_id}
                  footer={<a
                    href="#"
                    className="transition transform hover:scale-110 duration-300 ease-in-out px-3 py-1 rounded-md text-md inline-block"
                    style={{ willChange: 'transform', transformOrigin: 'center' }}
                    onClick={(e) => handleViewDetails(e, question)}
                  >
                    詳細を見る
                  </a>}
                  showMenuButton={false}
                >
                  <div className='text-md'>
                    <div
                      className={styles.questionBody}
                      dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                  </div>
                  <div className="flex flex-wrap mt-4">
                    {question.tags?.map((tag, index) => (
                      <span key={index} className="bg-blue-500 text-white text-xs py-1 px-4 rounded-full mr-2 mb-2">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center mt-4">
                    <ProfileImageDisplay />

                    <div className="ml-4">
                      <p className="text-sm">{username}</p>

                      <div className="text-left text-xs mt-2 text-gray-900">
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
                  <Modal
                    isOpen={isLoginPromptOpen}
                    onClose={() => setLoginPromptOpen(false)}
                    title="ログインしますか？"
                  >

                    <div
                      className="p-4"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        maxWidth: '50%',
                        margin: '0 auto',
                        zIndex: 1500,
                      }}
                    >

                      <div className="flex justify-center space-x-5">
                        <button
                          className="bg-blue-500 text-white px-4 py-3 m-6 rounded-md hover:bg-blue-600"
                          onClick={async () => {
                            setLoginPromptOpen(false);
                            setTimeout(() => {
                              router.push('/users/login');
                            }, 1000);
                          }}
                        >
                          ログインする
                        </button>
                        <button
                          className="bg-gray-500 text-white px-4 py-3 m-6 rounded-md hover:bg-gray-600"
                          onClick={handleContinueWithoutLogin}
                        >
                          閉じる
                        </button>
                      </div>
                      {/* <p className="mb-4 text-sm text-gray-500 font-semibold">※ 投稿にはログインが必要です。</p> */}
                    </div>
                    <p className='flex justify-end text-sm text-semibold'>※ 詳細を見るにはログインが必要です。</p>
                  </Modal>

                </>
              );
            })}
          </div>
        )}
        {/* スクロールボタンの追加 */}
        {/* {isBottomVisible && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-10 right-10 bg-white-500 text-gray-500 p-4 rounded-full shadow-lg hover:text-gray-700"
            title="ページの下部に移動"
          >
            <FontAwesomeIcon icon={faArrowDown} size="lg" />
          </button>
        )} */}
      </div>
    </>
  );
}
