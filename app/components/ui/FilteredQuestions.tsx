'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '@/app/context/LoadingContext';
import { toast } from 'react-toastify';

interface Question {
  id: string;
  title: string;
  description: string;
  created_at: string;
  view_count: number;
  bookmark_count: number;
  is_resolved: boolean;
  answer_count: number;
}

interface FilteredQuestionsProps {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}

const FilteredQuestions: React.FC<FilteredQuestionsProps> = ({ questions, isLoading, error: propError }) => {
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return <p>データを読み込み中です...</p>;
  }

  if (error) {
    setError(propError);
    console.error(error);

    toast.error('エラーが発生しました', {
      position: "top-center",
      autoClose: 2000,
    });

  }

  if (questions.length === 0) {
    return <p>質問が見つかりませんでした。</p>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="gap-4 bg-white p-4 rounded shadow flex items-center justify-between">
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
                  })
                  ) : (
                    '作成日登録なし'
                  )}
                </p>
                <div className="flex">
                  <p className="mt-4">回答数: {question.answer_count}</p>
                  <p className="mt-4 ml-4">ステータス: {question.is_resolved ? '解決済み' : '未解決'}</p>
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
          ))}
        </div>
      </div>
    </>
  );
};

export default FilteredQuestions;
