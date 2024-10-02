'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import Notification from '../ui/Notification';
import { useLoading } from '../../context/LoadingContext';

interface BestAnswerProps {
  questionId: string;
  answerId: string;
}

export default function BestAnswer({ questionId, answerId }: BestAnswerProps) {
  const [bestAnswerId, setBestAnswerId] = useState<string | null>(null);
  const [bestAnswerUserData, setBestAnswerUserData] = useState<{ id: string; username: string } | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);


  const fetchBestAnswer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/questions/${questionId}/best-answer`);
      const data = await response.json();

      if (response.ok) {
        setBestAnswerId(data.bestAnswerId);
        setBestAnswerUserData(data.bestAnswerUserData);
      } else {
        setError(data.message || 'ベストアンサーの取得に失敗しました');
      }
    } catch (err) {
      setError('ベストアンサーの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const setBestAnswer = async () => {
    try {
      const response = await fetch(`/api/questions/${questionId}/best-answer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ answerId }),
      });

      if (!response.ok) {
        throw new Error('ベストアンサーの設定に失敗しました');
      }

      console.log('ベストアンサーが設定されました');
      fetchBestAnswer();
    } catch (error) {
      console.error('ベストアンサーの設定中にエラーが発生しました', error);
    }
  };


  useEffect(() => {
    fetchBestAnswer();
  }, [questionId]);

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="flex items-center justify-start my-3">
        {bestAnswerId === answerId ? (
          <>
            <FontAwesomeIcon icon={faCrown} className="text-yellow-500 text-xl mr-2" />
            <span className="text-green-500 text-xl font-bold">ベストアンサー</span>
          </>
        ) : (
          <div className="mt-4">
            <button onClick={setBestAnswer} className="text-sm text-blue-900 px-4 py-2  hover:underline">
              ベストアンサーに選択する
            </button>
          </div>
        )}
      </div>
    </>
  );
}
