import { MouseEvent as ReactMouseEvent, useCallback, useEffect, useState } from 'react';
import Card from '../ui/Card';
import Notification from '../ui/Notification';
import Modal from '../ui/Modal'; // Add this line to import Modal
import DOMPurify from 'dompurify';
import styles from './QuestionList.module.css';
import { useLoading } from '../../context/LoadingContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import { useRouter, usePathname } from 'next/navigation';
import useAuth from '@/app/lib/useAuth';
import UserProfileImage from '../profile/UserProfileImage';
import UserNameDisplay from '../profile/UserNameDisplay';


interface Question {
  id: string;
  title: string;
  description: string;
  user_id: string;
  category_id: string;
  file_id: string;
  is_draft: boolean;
  is_resolved?: boolean;
  created_at: string;
  tags: string[];
}

export default function PublicQuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { setLoading } = useLoading();
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const [isLoginPromptOpen, setLoginPromptOpen] = useState(false);
  const router = useRouter();
  const { session } = useAuth(false);


  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      console.log('questions:',data);

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
  }, [setLoading]);


  useEffect(() => {
    fetchQuestions();

  }, [fetchQuestions]);



  const handleContinueWithoutLogin = () => {
    setLoginPromptOpen(false);
  };

  const handleViewDetails = (e: ReactMouseEvent<HTMLAnchorElement>, question: Question) => {
    e.preventDefault();

    const pathname = usePathname();
    const isPublicScreen = pathname === '/questions/public';

    if (isPublicScreen || !session) {

      setLoginPromptOpen(true);
    } else {

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
          <h1 className="mb-1 mx-auto flex items-center justify-center text-blue-900">質問一覧</h1>
          {/* <div className="my-2 top-0">
          <button
            onClick={fetchQuestions}
            className="text-gray-500 bg-gray-100 text-lg p-1 rounded hover:text-gray-900"
            title="質問一覧を再読み込み"
          >
            <FontAwesomeIcon icon={faSync} className="mr-2" />
          </button> */}
        {/* </div> */}
        <ScrollToBottomButton />
      </div>
        {questions.length === 0 ? (
          <p>質問がありません。</p>
        ) : (
          <div className="space-y-4 text-md">
            {questions.map((question) => {
              const sanitizedDescription = DOMPurify.sanitize(question.description);
              const pathname = usePathname();
              const isPublicScreen = pathname === '/questions/public';

            return (
              <>
                <Card
                  key={`質問ID:${question.id}`}
                  title={question.title}
                  categoryId={question.category_id}
                  onRefresh={fetchQuestions}
                  isResolved={false}
                  showReadMoreButton={false}
                  footer={
                    <a
                      href="#"
                      className={`${styles.link} transition transform hover:scale-110 duration-300 ease-in-out px-3 py-1 rounded-md text-md text-semibold inline-block`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isPublicScreen) {
                          setLoginPromptOpen(true);
                        } else {
                          router.push(`/questions/${question.id}`);
                        }
                      }}
                    >
                      詳細を見る
                    </a>
                  }
                  showMenuButton={false}
                >

                {question.is_resolved && (
                  <div className="absolute top-0 right-4 font-semibold text-pink-500 px-4 transition-transform duration-300 ease-in-out transform hover:scale-105">
                    <FontAwesomeIcon icon={faAward} className="mr-2 text-3xl text-yellow-300" />解決済み
                  </div>
                )}

                  <div className='my-10'>
                    <div
                      className={styles.questionBody}
                      dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                  </div>
                  <div className="flex flex-wrap mt-4">
                    {question.tags?.map((tag, index) => (
                      <span key={index} className="bg-blue-500 text-white text-sm py-1 px-4 rounded-full mr-2 mb-2">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center mt-4">
                  <UserProfileImage userId={question.user_id} />

                    <div className="ml-4">
                    <UserNameDisplay userId={question.user_id} />

                      <div className="text-left text-sm mt-2">
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
                        backgroundColor: 'rgb(176, 224, 230,0.5)',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        maxWidth: '50%',
                        margin: '0 auto',
                        zIndex: 1500,
                      }}
                    >

                      <div className="flex justify-center space-x-5">
                        <button
                          className="bg-sky-500 text-white px-4 py-3 m-6 rounded-md hover:bg-blue-600"
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
                    </div>
                    <p className='flex justify-end text-sm text-semibold mt-3'>※ 詳細を見るにはログインが必要です。</p>
                  </Modal>

                </>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
