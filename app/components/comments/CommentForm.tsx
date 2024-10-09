'use client';

import React, { useState } from 'react';
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
  openCommentListModal?: () => void;
}


export default function CommentForm({ questionId,
  answerId,
  commentId,
  userId: propUserId,
  onCancel,
  onSubmit,
  fetchComments,
  }: CommentFormProps) {

  const [initialBody, setInitialBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

  const { userId: contextUserId } = useUser();
  const userId = propUserId || contextUserId;

  const handleCancel = () => {
    setSelectedCommentId(null);
    setInitialBody('');
    onCancel();
  };


  const handleSubmit = async () => {

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
            fetchComments && fetchComments();
            setSuccess('コメントが投稿されました');
            setShowNotification(true);

          console.log('コメント送信', data);

        } else {
          setError(data.message || 'コメントの投稿に失敗しました');
          setShowNotification(true);
        }
      } catch (error) {
        setError('コメントの投稿中にエラーが発生しました');
        setShowNotification(true);
      } finally {
        setLoading(false);
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
