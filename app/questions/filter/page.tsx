'use client';

import { useEffect, useState } from 'react';
import FilteredQuestions from '../../components/ui/FilteredQuestions';
import Pagination from '@/app/components/ui/Pagination';
import ScrollToBottomButton from '@/app/components/ui/ScrollToBottomButton';

export default function FilteredQuestionsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

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


  const fetchFilteredQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/questions/filter?filter=${filter}`);
      const data = await response.json();

      if (response.ok) {
        setQuestions(data);
        setError(null);
      } else {
        setError(data.message || 'データの取得に失敗しました');
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredQuestions();
  }, [filter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mt-8 mb-4">質問リストのフィルタリング</h1>

      <div className="mb-4">
        <label htmlFor="status" className="block font-bold text-md mb-4">フィルターを選択</label>
        <select
          id="status"
          className="block w-full border rounded-md p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">全て</option>
          <option value="open">未解決</option>
          <option value="closed">解決済み</option>
          <option value="no_answer">回答なし</option>
          <option value="has_answer">回答あり</option>
        </select>
      </div>

      <FilteredQuestions questions={paginatedQuestions} isLoading={isLoading} error={error} />
      <ScrollToBottomButton />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
