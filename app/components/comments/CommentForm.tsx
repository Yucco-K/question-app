'use client';

import React, { useEffect, useState } from 'react';
import Form from '../ui/Form';
import ButtonGroup from '../ui/ButtonGroup';
import { useLoading } from '../../context/LoadingContext';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import useAuth from '@/app/lib/useAuth';
import { toast } from 'react-toastify';
import DefaultHeader from '../Layout/header/DefaultHeader';

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
  commentListModalOpen: boolean;
}


export default function CommentForm({ questionId,
  answerId,
  commentId: propCommentId,
  userId: propUserId,
  onCancel,
  onSubmit,
  fetchComments,
  fetchCommentCount,
  commentListModalOpen,
  }: CommentFormProps) {

  const [initialBody, setInitialBody] = useState('');
  const [comments, setComments] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [commentId, setCommentId] = useState<string | null>(null);
  const { session, loading: userLoading } = useAuth();
  const contextUserId = (session?.user as { id?: string })?.id ?? null;
  const userId = propUserId || contextUserId;


  const handleCancel = () => {
    setSelectedCommentId(null);
    setInitialBody('');
    onCancel();
    };


  const fetchCommentsData = async () => {

    try {
      setLoading(true);

      const response = await fetch(`/api/comments?answerId=${answerId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
      } else {
        console.log(data.message || 'コメントの取得に失敗しました');
        toast.error('コメントの取得に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.log('コメントの取得中にエラーが発生しました');
      toast.error('コメントの取得中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {

    if (!userId) {
      console.log("ユーザーがログインしていません");
      toast.error('コメントの取得中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
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

          setCommentId(data.id);

          toast.success('コメントが投稿されました!', {
            position: "top-center",
            autoClose: 2000,
          });

          onSubmit('', initialBody);

          setSelectedCommentId(null);

          fetchComments && fetchComments();
          fetchCommentCount && fetchCommentCount();

        } else {
          console.log(data.message || 'コメントの投稿に失敗しました');
          toast.error('コメントの投稿に失敗しました', {
            position: "top-center",
            autoClose: 2000,
          });
        }

      } catch (error) {
        console.log('コメントの投稿中にエラーが発生しました');
        toast.error('コメントの投稿中にエラーが発生しました', {
          position: "top-center",
          autoClose: 2000,
        });

      } finally {
        setLoading(false);
        setInitialBody('');
      }
    }else {
      console.log('コメントが入力されていません');
      toast.error('コメントを入力してください', {
        position: "top-center",
        autoClose: 2000,
      });
    };
  }


  const buttons = [
    {
      label: '送 信',
      className: 'bg-blue-500 text-white text-sm whitespace-nowrap',
      onClick: handleSubmit,
    },
    {
      label: 'キャンセル',
      className: 'bg-gray-400 text-white text-sm whitespace-nowrap',
      onClick: handleCancel,
    },
  ];

  return (
    <>
      <DefaultHeader style={{ display: 'none' }} />

      <div>
        <ScrollToBottomButton isModalOpen={false} />
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
