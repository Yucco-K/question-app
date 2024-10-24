import { useCallback, useEffect, useState } from 'react';
import Card from '../ui/Card';
import Notification from '../ui/Notification';
import DOMPurify from 'dompurify';
import styles from './QuestionList.module.css';
import { useLoading } from '../../context/LoadingContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import UserProfileImage from '../profile/UserProfileImage';
import UserNameDisplay from '../profile/UserNameDisplay';
import Pagination from '../ui/Pagination';
import KeywordSearch from '../ui/KeywordSearch';
import useAuth from '@/app/lib/useAuth';


interface Question {
  id: string;
  title: string;
  description: string;
  user_id: string;
  category_id: string;
  file_id: string;
  is_draft: boolean;
  is_resolved: boolean;
  created_at: string;
  tags: string[];
}

interface QuestionListProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

export default function QuestionList({ selectedTags, setSelectedTags }: QuestionListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { isLoading, setLoading } = useLoading();
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const isPublic = false;
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const itemsPerPage = 8;


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();

      if (response.ok) {
        setQuestions(data);
        setFilteredQuestions(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
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


  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((question) =>
        selectedTags.every((tag) => question.tags.includes(tag))
      );
      setFilteredQuestions(filtered);
    }
  }, [selectedTags, questions]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredQuestions.length / itemsPerPage));
  }, [filteredQuestions.length]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchResults = (searchResults: Question[]) => {
      setFilteredQuestions(searchResults);
      setCurrentPage(1);
      setTotalPages(Math.ceil(searchResults.length / itemsPerPage));
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
          <h1 className="mx-auto my-4 flex items-center justify-center text-blue-900">質問一覧</h1>

        <ScrollToBottomButton isModalOpen={false} />
      </div>

      <KeywordSearch data={questions} onSearchResults={handleSearchResults} />

        {filteredQuestions.length === 0 ? (
          <p className="text-blue-900">質問がありません。</p>
        ) : paginatedQuestions.length === 0 ? (
          <p className="text-blue-900">このページには質問がありません。</p>
        ) : (
          <div className="space-y-4 text-md mt-4">
          {paginatedQuestions.map((question) => {
            const sanitizedDescription = DOMPurify.sanitize(question.description);

            return (
              <Card
                key={question.id}
                id={question.id}
                type="questions"
                title={question.title}
                categoryId={question.category_id}
                onRefresh={fetchQuestions}
                isResolved={false}
                isPublic={false}
                showReadMoreButton={false}
                footer={<a href={`/questions/${question.id}`}
                className={`${styles.link} font-bold transition transform hover:scale-110 duration-300 ease-in-out px-3 py-1 rounded-md text-md font-semibold inline-block`}
                >
                  詳細を見る
                </a>}
                showMenuButton={false}
                isDraft={false}
                createdAt={question.created_at}
              >
              <div className="text-blue-900 text-sm mb-4">
                質問ID: {question.id}
              </div>
              {question.is_resolved && (
                <div className="absolute top-6 right-0 font-semibold text-sm text-red-400">
                  <FontAwesomeIcon icon={faAward} className="mr-2 text-xl text-yellow-300" />解決済み
                </div>
              )}

                <div className='my-10'>
                  <div
                    className={styles.questionBody}
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
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
              );
            })}
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

    </>
  );
}
