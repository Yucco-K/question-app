'use client';

import { SetStateAction, useCallback, useEffect, useState } from 'react';
import styles from './QuestionDetail.module.css';
import DOMPurify from 'dompurify';
import Notification from '../ui/Notification';
import { useLoading } from '../../context/LoadingContext';
import AnswerForm from '../answers/AnswerForm';
import AnswerList from '../answers/AnswerList';
import { useUser } from '../../context/UserContext';
import Form from '../ui/Form';
import Card from '../ui/Card';
import ButtonGroup from '../ui/ButtonGroup';
import TagInput from '../ui/TagInput';
import Modal from '../ui/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import UserProfileImage from '../profile/UserProfileImage';
import UserNameDisplay from '../profile/UserNameDisplay';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../ui/ConfirmationModal';


interface Answer {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  is_best_answer: boolean;
  fetchAnswers: () => void;
}

interface Tag {
  id: string;
  name: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  user_name: string;
  created_at: string;
  answers: Answer[];
  tags: Tag[];
  user_id: string;
  category_id: string;
  is_resolved: boolean;
  fetchAnswers: () => void;
}

export default function QuestionDetail({ questionId }: { questionId: string }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [tags, setTags] = useState<{ id: string, name: string }[]>([])
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { setLoading } = useLoading();
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const { userId } = useUser();
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isConfirmingResolved, setIsConfirmingResolved] = useState(false);


  const router = useRouter();

  const sanitizedDescription = question ? DOMPurify.sanitize(question.description) : '';

  const handleResetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setSelectedTags([]);
  };

  const handleCancelResolved = () => {
    setIsConfirmingResolved(false);
  };

  const triggerConfirmResolved = () => {
    setIsConfirmingResolved(true);
  };


  const fetchAnswers = useCallback(async () => {
    try {
      const response = await fetch(`/api/questions/${questionId}/answers`);
      const data = await response.json();
      setAnswers(data.answers);
    } catch (error) {
      console.error('回答の取得に失敗しました', error);
    }
  }, [questionId]);

  useEffect(() => {
    fetchAnswers();
  }, []);


  const fetchQuestionDetail = useCallback(async () => {

    const tags = question?.tags?.map(tag => tag.name) || [];
    console.log('Question ID:', questionId);

    setLoading(true);
    try {
      const response = await fetch(`/api/questions/${questionId}`);
      const data = await response.json();

      if (response.ok) {
        setQuestion(data);
        setTags(data.tags);
        setCategoryId(data.category_id);
        setNewTitle(data.title);
        setNewDescription(data.description);

      } else {
        setError(data.message || 'データの取得に失敗しました');
        setShowNotification(true);
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました');
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchQuestionDetail();
    console.log('categoryId:', categoryId);
  }, [fetchQuestionDetail])


  const handleResolved = async () => {
    if (!userId || question?.user_id !== userId) {
      setError('解決済みフラグを変更する権限がありません');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setShowNotification(false);

      const response = await fetch(`/api/questions/${questionId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_resolved: !question?.is_resolved }),
      });

      if (response.ok) {
        setSuccess('解決済み状態が更新されました');
        setIsConfirmingResolved(false);
        fetchQuestionDetail();
      } else {
        setError('解決済み状態の更新に失敗しました');
      }
    } catch (err) {
      setError('解決済み状態の更新中にエラーが発生しました');
    }finally {
      setLoading(false);
    }
  };


  const handleUpdate = async () => {

    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowNotification(false);

    try {

      if (!userId) {
        setQuestionModalOpen(false);
        setError('ログインしてください。');
        setShowNotification(true);
        setLoading(false);
        return;
      }

      if (question?.user_id !== userId) {
        setQuestionModalOpen(false);
        setError('この投稿を編集する権限がありません。');
        setShowNotification(true);
        setLoading(false);
        return;
      }

      if (!newTitle) {
        setError('タイトルを入力してください');
        setShowNotification(true);
        setLoading(false);
        return;
      }

      if (!newDescription) {
        setError('本文を入力してください');
        setShowNotification(true);
        setLoading(false);
        return;
      }

      if (selectedTags.length === 0) {
        setError('タグを1つ以上指定してください');

        setShowNotification(true);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/questions/${questionId}`, {


        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          tags: selectedTags,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setQuestionModalOpen(false);
        setSuccess('質問が更新されました');
        setShowNotification(true);
        setLoading(false);
        fetchQuestionDetail();
        router.push(`/questions/${questionId}`);

      } else {
        setQuestionModalOpen(false);
        setError(data.message || '更新に失敗しました');
        setShowNotification(true);
        setLoading(false);
      }
    } catch (err) {
      setQuestionModalOpen(false);
      setError('更新中にエラーが発生しました');
      setShowNotification(true);
      setLoading(false);
    }finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {

    if (!userId) {
      setError('ログインしてください。');
      setShowNotification(true);
      return;
    }

    if (question?.user_id !== userId) {
      setError('この投稿を削除する権限がありません。');
      setShowNotification(true);
      return;
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('質問が削除されました');
        setShowNotification(true);
        setTimeout(() => {
        router.push('/questions');
      } , 1000);

      } else {
        setError('削除に失敗しました');
        setShowNotification(true);
      }
    } catch (err) {
      setError('削除中にエラーが発生しました');
      setShowNotification(true);
    }
  };

  const handleCancel = () => {
    setNewTitle(question?.title || '');
    setNewDescription(question?.description || '');

    setSelectedTags(question?.tags.map(tag => tag.name) || []);
    setQuestionModalOpen(false);
  };


  const buttons = [
    {
      label: '更新',
      className: 'bg-blue-500 text-white text-sm',
      onClick: handleUpdate,
    },
    {
      label: 'キャンセル',
      className: 'bg-blue-500 text-white text-sm',
      onClick: handleCancel,
    },
  ];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        setAvailableTags(data);
      } catch (error) {
        console.error('タグの取得に失敗しました:', error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    console.log('Selected Tags updated:', selectedTags);
  }, [selectedTags]);


  if (!question) {
    return null;
  }

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="flex items-center justify-center mt-4">
        <h1 className="mx-auto flex items-center justify-center text-blue-900">質問詳細ページ</h1>
        {/* <button
          onClick={fetchQuestionDetail}
          className="text-gray-500 bg-gray-100 text-md p-1 rounded hover:text-gray-900 ml-4 mr-10"
          title="質問詳細を再読み込み"
        >
          <FontAwesomeIcon icon={faSync} className="m-1" />
        </button> */}
      </div>

    {/* <ScrollToBottomButton /> */}

      <div className="container mx-auto px-4 py-8 w-[1200px] mx-auto">

        {questionModalOpen ? (
          <Modal isOpen={questionModalOpen} onClose={handleCancel} title="質問を編集">
            {showNotification && (error || success) && (
              <Notification
                message={error ?? success ?? ""}
                type={error ? "error" : "success"}
                onClose={() => setShowNotification(false)}
              />
            )}
            <Form
              titleLabel="タイトル"
              titlePlaceholder="質問のタイトルを入力してください。"
              bodyLabel="質問内容"
              bodyPlaceholder="質問の内容を入力してください。"
              initialTitle={newTitle}
              initialBody={newDescription}
              onTitleChange={setNewTitle}
              onBodyChange={setNewDescription}
              showTitle={true}
              onSubmit={(title: SetStateAction<string>, body: SetStateAction<string>) => {
                handleUpdate();
                setNewTitle(title);
                setNewDescription(body);
                console.log('Title:', title, 'Body:', body);} }
              onCancel={handleCancel} />

            <div className="mx-auto w-4/5">
              <TagInput
                tagLabel="タグ"
                availableTags={availableTags}
                initialTags={question.tags.map(tag => tag.name)}
                onTagsChange={setSelectedTags}
              />
            </div>
            <div className='mx-auto w-1/2'>
              <ButtonGroup
                pattern={2}
                buttons={buttons}
                buttonsPerRow={[2]}
              />
            </div>

          </Modal>
        ) : (
        <>
          <Card
            key={question.id}
            title={question.title}
            ownerId={question.user_id}
            categoryId={question.category_id}
            onRefresh={fetchQuestionDetail}
            isResolved={question.is_resolved}
            onEdit={() => {
              setQuestionModalOpen(true);
            }}
            onDelete={handleDelete}
            // className="relative"
          >
            <div className="text-blue-900 text-sm mb-4">
              質問ID: {questionId}
            </div>
            <div className="flex flex-wrap mb-4">
              {question.tags?.map((tag, index) => (
                <span key={index} className="bg-blue-500 text-white px-4 py-1 rounded-full mr-2 mb-2 text-sm">
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex items-center mt-4">
              <UserProfileImage userId={question.user_id} />

              <div className="ml-4">
                <UserNameDisplay userId={question.user_id} />


                <div className="text-left text-sm mt-2">
                {question.created_at ? (
                  new Date(question.created_at).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                  ) : (
                    '作成日登録なし'
                  )}
                </div>
              </div>
            </div>

            {question.is_resolved && (
              <div className="absolute top-4 right-20 font-semibold text-pink-500 px-4 py-2 transition-transform duration-300 ease-in-out transform hover:scale-105">
                <FontAwesomeIcon icon={faAward} className="mr-2 text-3xl text-yellow-300" />解決済み
              </div>
            )}

          <div>
            {userId === question.user_id && !question.is_resolved && (
              <button
                onClick={triggerConfirmResolved}
                className="absolute top-20 right-10 ml-2 text-white text-sm px-3 py-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105 bg-gray-400"
              >
                解決済みにする
              </button>
            )}

            {isConfirmingResolved && (
              <ConfirmationModal
                message="この質問を解決済みに設定しますか？"
                onConfirm={handleResolved}
                onCancel={handleCancelResolved}
              />
            )}
          </div>


            <hr className="my-4 border-gray-300 text-bold" />

            <div className={`my-8 ${styles.questionBody}`}>
              <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
            </div>

          </Card>
            <div className='flex flex-start h-30'>
              <div className="my-6 text-right">
              {!question.is_resolved && (
                <button
                  className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 ml-10 transition-transform duration-300 ease-in-out transform hover:scale-105"

                  onClick={() => setAnswerModalOpen(true)}
                >
                  <span className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-2xl">
                    ⊕
                  </span>
                  回答を投稿
                </button>
              )}
              </div>

              {answerModalOpen && (
              <AnswerForm questionId={questionId} fetchAnswers={fetchAnswers} />
              )}
            </div>

            <AnswerList questionId={questionId} answers={answers} categoryId={categoryId} fetchAnswers={function (): void {
                throw new Error('Function not implemented.');
              }} />
          </>
        )}
      </div>
    </>
  );
}
