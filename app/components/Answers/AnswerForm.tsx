'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import ButtonGroup from '../ui/ButtonGroup';
import Form from '../ui/Form';
import useAuth from '../../lib/useAuth';
import { useRouter } from 'next/navigation';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import { toast } from 'react-toastify';
import DefaultHeader from '../Layout/header/DefaultHeader';

interface Answer {
  id: string;
  user_id: string;
  content: string;
}

interface AnswerFormProps {
  questionId: string;
  initialAnswer?: string;
  isEditing?: boolean;
  answerId?: string;
  fetchAnswers: () => Promise<void>;
}

export default function AnswerForm({
  questionId,
  initialAnswer = '',
  isEditing = false,
  answerId,
  fetchAnswers,
  }: AnswerFormProps) {

  const [answerModalOpen, setAnswerModalOpen] = useState(true);
  const [initialBody, setInitialBody] = useState('');
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [content, setContent] = useState('');
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const [answers, setAnswers] = useState<Answer[]>([]);


  useEffect(() => {
    if (!userLoading && !userId) {
      router.push('/users/login');
    }
  }, [isLoading, userId, router]);


  useEffect(() => {
    if (isEditing && initialAnswer) {
      setInitialBody(initialAnswer);
    }
  }, [isEditing, initialAnswer]);


  const handleBodyChange = useCallback((newBody: string) => {
    if (newBody !== initialBody) {
      setInitialBody(newBody);
    }
  }, [initialBody]);


  const handleSubmit = async () => {

    if (!questionId) {
      console.log("質問IDが指定されていません");
      toast.error('質問IDが指定されていません', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (!userId) {
      console.error("ユーザーがログインしていません");
      toast.error('ログインしてください', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (!initialBody.trim()) {
      console.error("回答の内容が空です。");
      toast.error('回答を入力してください。', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const url = isEditing ? `/api/answers/${answerId}` : '/api/answers';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      setLoading(true);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isEditing
            ? { content: initialBody }
            : {
                questionId: questionId,
                content: initialBody,
                userId: userId
              }
        ),
      });

      if (response.ok) {
        const result = await response.json();
        setInitialBody(result.content);

        await fetchAnswers();
        setLoading(false);

        toast.success(isEditing ? '回答が更新されました' : '回答が保存されました', {
          position: "top-center",
          autoClose: 2000,
        });

        setAnswerModalOpen(false);

        setTimeout(() =>
          window.location.reload()
        , 1000);

      } else {
        const error = await response.json();
        console.error("保存エラー:", error.message);
        toast.error('保存中にエラーが発生しました', {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      toast.error('エラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
    }finally {
      setLoading(false);
      setInitialBody('');
      setAnswerModalOpen(false);
    }
  };


  const handleCancel = () => {
    setInitialBody('');
    setLoading(false);
    setAnswerModalOpen(false);
  };

  const buttonData = [
    { label: isEditing ? '更新' : '投 稿', className: 'bg-blue-600 text-white text-sm whitespace-nowrap', onClick: handleSubmit },
    { label: 'キャンセル', className: 'bg-gray-400 text-white text-sm whitespace-nowrap', onClick: () => handleCancel() },
  ];


  return (
    <>
      {/* <DefaultHeader style={{ display: 'none' }} /> */}


      <ScrollToBottomButton isModalOpen={answerModalOpen} />

      <Modal isOpen={answerModalOpen} onClose={() => setAnswerModalOpen(false)} title={isEditing ? '回答を編集' : '回答を投稿'}>
        <div className="sm:px-0 md:px-8">

          <Form
            titleLabel="タイトル"
            titlePlaceholder="タイトルを入力"
            bodyLabel="本文"
            bodyPlaceholder="ここに本文を入力"
            initialTitle=""
            initialBody={initialBody}
            onTitleChange={() => console.log('タイトルは使用しません')}
            onBodyChange={handleBodyChange}
            showTitle={false}
          />

          <div className="mx-auto w-1/2">
            <ButtonGroup
              pattern={2}
              buttons={buttonData}
              buttonsPerRow={[2]}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
