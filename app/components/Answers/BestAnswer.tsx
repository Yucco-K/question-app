'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import Notification from '../ui/Notification';
import { useLoading } from '../../context/LoadingContext';
import useAuth from '@/app/lib/useAuth';

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
  const [questionOwnerId, setQuestionOwnerId] = useState<string | null>(null);
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;


  const fetchBestAnswer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/questions/${questionId}/best-answer`);
      const data = await response.json();

      if (response.ok) {
        setBestAnswerId(data.bestAnswerId);
        setQuestionOwnerId(data.questionOwnerId);
      } else {
        setError(data.message || 'ベストアンサーの取得に失敗しました');
      }
    } catch (err) {
      setError('ベストアンサーの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
      setShowNotification(true);
    }
  };

  const setBestAnswer = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/questions/${questionId}/best-answer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answerId, userId }),
      });

      const data = await response.json();

      if (!response.ok) {

        const errorMessage = data.message || 'ベストアンサーの設定に失敗しました';
        throw new Error(errorMessage);
      }

      setSuccess('ベストアンサーが設定または変更されました');
      setBestAnswerId(answerId);
      setQuestionOwnerId(data.questionOwnerId);
      // fetchBestAnswer();
      // setTimeout(() => {
      //   window.location.reload();
      // } , 1000);

    } catch (error) {
      console.error('ベストアンサーの設定中にエラーが発生しました:', error);
      setError((error as Error).message);

    } finally {
      setLoading(false);
      setShowNotification(true);
    }
  };

  useEffect(() => {
    fetchBestAnswer();
  }, [questionId]);

  if (isLoading) return <p>読み込み中...</p>;

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

          userId === questionOwnerId && (
            <div className="mt-4">
              <button onClick={setBestAnswer} className="text-sm text-blue-900 px-4 py-2 hover:underline">
                ベストアンサーに選択する
              </button>
            </div>
          )
        )}
      </div>
    </>
  );
}
