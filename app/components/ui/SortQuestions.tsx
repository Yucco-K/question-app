'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '@/app/context/LoadingContext';
import Notification from '@/app/components/ui/Notification';
import Pagination from './Pagination';

interface Question {
  id: string;
  title: string;
  description: string;
  created_at: string;
  view_count: number;
  bookmark_count: number;
}

export default function SortQuestions() {
  const { isLoading } = useLoading();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sort, setSort] = useState<string>('newest');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedQuestions = questions.slice(startIndex, startIndex + itemsPerPage);

useEffect(() => {
  setTotalPages(Math.ceil(questions.length / itemsPerPage));
}, [questions]);


  const fetchSortedQuestions = async () => {
    try {
      setError(null);
      setSuccess(null);
      setShowNotification(false);

      const response = await fetch(`/api/questions/sort?sort=${sort}`);
      const data = await response.json();

      if (response.ok) {
        setQuestions(data);
        setError(null);
      } else {
        setError(data.message || 'データの取得に失敗しました');
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました');
    }finally{
      setShowNotification(true);
    }
  };

  useEffect(() => {
    fetchSortedQuestions();
  }, [sort]);

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mt-8 mb-4">質問のソート</h1>

        <div className="mb-4">
          <label htmlFor="sort" className="block font-bold text-md my-4">ソート順を選択</label>
          <select
            id="sort"
            className="block w-full border rounded-md p-2"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">新着順</option>
            <option value="views_desc">閲覧数降順</option>
            <option value="bookmarks_desc">ブックマーク数降順</option>
            <option value="created_asc">作成日時昇順</option>
          </select>
        </div>

        <div className="space-y-4">
          {isLoading ? (
              <p>読み込み中です...</p>

            ) : paginatedQuestions.length === 0 && !error ? (
              <p>質問が見つかりませんでした。</p>

            ) : (
            paginatedQuestions.map((question) => (
              <div key={question.id} className="gap-4 bg-white p-4 rounded shadow flex items-center justify-between"> {/* 全体をflexで配置 */}
                <div>
                <div className="text-blue-900 text-sm mb-4">
                  質問ID: {question.id}
                </div>
                <h2>
                  <span className="question-label text-lg">質問タイトル: </span>{question.title}
                </h2>
                <p className="text-gray-600 mt-4">投稿日時: {question.created_at ? (
                  new Date(question.created_at).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    // second: '2-digit',
                  })
                  ) : (
                    '作成日登録なし'
                  )}
                </p>
                <div className='flex'>
                  <p className="mt-4 mr-4">閲覧数: {question.view_count}</p>
                  <p className="mt-4">ブックマーク数: {question.bookmark_count}</p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => window.location.href = `/questions/${question.id}`}
                  className="items-center hoverScale border border-blue-500 text-blue-800 px-4 py-2 rounded-md text-md font-semibold transition-transform duration-300 ease-in-out transform hover:scale-105"
                >
                  詳細を見る
                </button>
              </div>
            </div>

            ))
          )}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
