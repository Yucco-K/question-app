import { useEffect, useState } from 'react';
import Card from '../ui/Card';
import DOMPurify from 'dompurify';
import { useLoading } from '../../context/LoadingContext';
import styles from '../Questions/QuestionList.module.css';
import Pagination from './Pagination';
import { toast } from 'react-toastify';

interface Question {
  id: string;
  title: string;
  description: string;
  user_id: string;
  category_id: string;
  is_draft: boolean;
  is_resolved: boolean;
  created_at: string;
  tags: string[];
}

interface CategorySearchProps {
  categoryId: string | null;
}

const CategorySearch: React.FC<CategorySearchProps> = ({ categoryId = null }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { isLoading, setLoading } = useLoading();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(questions.length / itemsPerPage));
  }, [questions]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = questions.slice(startIndex, startIndex + itemsPerPage);


  useEffect(() => {

    if (!categoryId) return;

    const fetchQuestionsByCategory = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/categories/${categoryId}/search`);
        const data = await response.json();

        if (response.ok) {
          setQuestions(data);
          console.error(null);
        } else {
          console.error(data.message || '質問の取得に失敗しました');
          toast.error('質問の取得に失敗しました', {
            position: "top-center",
            autoClose: 2000,
          });
        }
      } catch (err) {
        console.error('データの取得中にエラーが発生しました');
        toast.error('データの取得中にエラーが発生しました', {
          position: "top-center",
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsByCategory();
  }, [categoryId, setLoading]);

  return (
    <>
      <div className={styles.questionBody}>
          {questions.length === 0 ? (
            <p className='text-blue-900'>このカテゴリに質問がありません。</p>
          ) : paginatedQuestions.length === 0 ? (
            <p className='text-blue-900'>このページには質問がありません。</p>
          ) : (
            <div className="space-y-4 text-md">
              {paginatedQuestions.map((question) => {
                const sanitizedDescription = DOMPurify.sanitize(question.description);

              return (
                <Card
                  key={question.id}
                  id={question.id}
                  type="questions"
                  title={question.title}
                  categoryId={question.category_id}
                  isResolved={question.is_resolved}
                  showReadMoreButton={false}
                  footer={<a href={`/questions/${question.id}`} className="hoverScale px-3 py-1 rounded-md text-md text-semibold inline-block">
                    詳細を見る
                  </a>}
                  isDraft={false}
                >
                  <div className="text-blue-900 text-sm mb-4">質問ID: {question.id}</div>
                  <div className="text-blue-900 text-left text-sm mt-2">
                    投稿日時:{' '}
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
                  <div className='my-10'>
                    <div
                      className={styles.questionBody}
                      dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                    />
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
};

export default CategorySearch;
