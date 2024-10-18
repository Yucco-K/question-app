'use client';

import React, { useEffect, useState } from 'react';
import Form from '../ui/Form';
import ButtonGroup from '../ui/ButtonGroup';
import { useUser } from '../../context/UserContext';
import Notification from '../ui/Notification';
import { useLoading } from '../../context/LoadingContext';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';

interface CommentFormProps {
  initialComment?: string;
  answerId: string;
  questionId: string;
  commentId?: string | null;
  userId: string | null;
  onSubmit: (title: string, body: string) => void;
  onCancel: () => void;
  fetchComments?: () => void;
  fetchCommentCount?: () => void;
  openCommentListModal?: () => void;
}


export default function CommentForm({ questionId,
  answerId,
  commentId: propCommentId,
  userId: propUserId,
  onCancel,
  onSubmit,
  fetchComments,
  fetchCommentCount,
  }: CommentFormProps) {

  const [initialBody, setInitialBody] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentId, setCommentId] = useState<string | null>(null);

  const { userId: contextUserId } = useUser();
  const userId = propUserId || contextUserId;

  const handleCancel = () => {
    setSelectedCommentId(null);
    setInitialBody('');
    onCancel();
  };


  const fetchCommentsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments?answerId=${answerId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
        setError(null);
      } else {
        setError(data.message || 'コメントの取得に失敗しました');
      }
    } catch (err) {
      setError('コメントの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setShowNotification(false);

    if (!userId) {
      console.error("ユーザーがログインしていません");
      setError("ログインしてください");
      setShowNotification(true);
      return;
    }

    if (initialBody) {
      setLoading(true);
      try {

        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question_id: questionId,
            answer_id: answerId,
            content: initialBody,
            user_id: contextUserId,
          }),
        });

          const data = await response.json();

        if (response.ok) {

            setLoading(false);
            setInitialBody('');
            onSubmit('', initialBody);
            setSuccess('コメントが投稿されました');
            setSelectedCommentId(null);

            setCommentId(data.id);

            fetchComments && fetchComments();
            fetchCommentCount && fetchCommentCount();

        } else {
          setError(data.message || 'コメントの投稿に失敗しました');

        }
      } catch (error) {
        setError('コメントの投稿中にエラーが発生しました');

      } finally {
        setLoading(false);
        setShowNotification(true);

      }
    } else {
      setError('コメントを入力してください');
      setShowNotification(true);

    }
  };


  const buttons = [
    {
      label: '送信',
      className: 'bg-blue-500 text-white text-sm',
      onClick: handleSubmit,
    },
    {
      label: 'キャンセル',
      className: 'bg-blue-500 text-white text-sm',
      onClick: handleCancel,
    },
  ];

  return (
    <>
      <div>
        {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
        )}
        <ScrollToBottomButton />
        <Form
          titleLabel="コメントタイトル"
          titlePlaceholder="コメントタイトルを入力"
          bodyLabel="コメント内容"
          bodyPlaceholder="コメントを入力してください"
          initialTitle=""
          initialBody={initialBody}
          onTitleChange={() => {}}
          onBodyChange={setInitialBody}
          showTitle={false}
          onSubmit={(title, body) => onSubmit(title, body)}
          onCancel={handleCancel}
        />
        <div className="mx-auto w-1/2">
          <ButtonGroup
            pattern={2}
            buttons={buttons}
            buttonsPerRow={[2]}
          />
        </div>
      </div>
    </>
  );
}
