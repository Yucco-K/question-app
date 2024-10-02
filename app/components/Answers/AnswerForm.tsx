'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import ButtonGroup from '../ui/ButtonGroup';
import Form from '../ui/Form';
import { useUser } from '../../context/UserContext';
import Notification from '../ui/Notification';
import { useLoading } from '../../context/LoadingContext';
import useAuth from '../../lib/useAuth';
import { useRouter } from 'next/navigation';

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
  }: AnswerFormProps) {

  const [answerModalOpen, setAnswerModalOpen] = useState(true);
  const [initialBody, setInitialBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { loading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState('');
  const { userId, loading: userLoading, error: userError } = useUser();
  const [answers, setAnswers] = useState([]);


  useEffect(() => {
    if (!loading && !userId) {
      router.push('/users/login');
    }
  }, [loading, userId, router]);


  useEffect(() => {
    if (isEditing && initialAnswer) {
      setInitialBody(initialAnswer);
    }
  }, [isEditing, initialAnswer]);


  const fetchAnswers = useCallback(async () => {
    try {
      const response = await fetch(`/api/questions/${questionId}/answers`);
      if (response.ok) {
        const data = await response.json();
        setAnswers(data);
        console.log('answers:', data);
      } else {
        console.error("Failed to fetch answers");
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  }, [questionId]);


  const handleBodyChange = useCallback((newBody: string) => {
    if (newBody !== initialBody) {
      setInitialBody(newBody);
    }
  }, [initialBody]);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setShowNotification(false);
    setLoading(true);

    console.log("投稿内容: ", initialBody, "質問ID: ", questionId);
    console.log("ユーザーID: ", userId);
    console.log("content情報: ", initialBody);
    console.log("answerId: ", answerId);

    if (!questionId) {
      console.error("質問IDが指定されていません");
      setError("質問IDが存在しません。");
      setShowNotification(true);
      setLoading(false);
      return;
    }

    if (!userId) {
      console.error("ユーザーがログインしていません");
      setError("ログインしてください");
      setShowNotification(true);
      setLoading(false);
      return;
    }

    if (!initialBody.trim()) {
      console.error("回答の内容が空です。");
      setError("回答を入力してください。");
      setShowNotification(true);
      setLoading(false);
      return;
    }

    const url = isEditing ? `/api/answers/${answerId}` : '/api/answers';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      console.log("URL: ", url);
      console.log("メソッド: ", method);
      console.log("質問ID: ", questionId);
      console.log("answerId: ", answerId);
      console.log("content: ", initialBody);

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
        // setContent(result);
        setInitialBody(result.content);
        setLoading(false);
        fetchAnswers();
        console.log(isEditing ? '回答が更新されました:' : '回答が保存されました:', result);
        setSuccess(isEditing ? '回答が更新されました' : '回答が保存されました');
        setShowNotification(true);
        setAnswerModalOpen(false);
        setTimeout(() =>
        window.location.reload()
        , 2000);
      } else {
        const error = await response.json();
        console.error("保存エラー:", error.message);
        setError(error.message);
        setShowNotification(true);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      setError("エラーが発生しました");
      setShowNotification(true);
    }finally {
      setLoading(false);
      setAnswerModalOpen(false);
    }
  };

  const handleCancel = () => {
    setInitialBody('');
    setSuccess(null);
    setError(null);
    setShowNotification(false);
    setLoading(false);
    setAnswerModalOpen(false);
  };

  const buttonData = [
    { label: isEditing ? '更新' : '投稿', className: 'bg-blue-600 text-white', onClick: handleSubmit },
    { label: 'キャンセル', className: 'bg-gray-400 text-white', onClick: () => handleCancel() },
  ];


  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <Modal isOpen={answerModalOpen} onClose={() => setAnswerModalOpen(false)} title={isEditing ? '回答を編集' : '回答を投稿'}>
        <div className="px-8">
          {showNotification && (error || success) && (
            <Notification
              message={error ?? success ?? ""}
              type={error ? "error" : "success"}
              onClose={() => setShowNotification(false)}
            />
          )}
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
