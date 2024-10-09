'use client';

import { SetStateAction, useCallback, useEffect, useState } from 'react';
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
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import ProfileImageDisplay from '../profile/ProfileImageDisplay';




interface Answer {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  is_best_answer: boolean;
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
  const [isBottomVisible, setIsBottomVisible] = useState(false);

  const router = useRouter();

  const sanitizedDescription = question ? DOMPurify.sanitize(question.description) : '';

  const handleResetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setSelectedTags([]);
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

        if (data.user_id) {
          console.log('User ID:', data.user_id);
          fetchUsername(data.user_id);
        }
        setError(null);
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


  const fetchUsername = async (userId: string) => {
    if (!userId || username) return;
    console.log('User ID:', userId);
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/name`);
      const data = await response.json();

      if (response.ok) {
        setUsername(data.username);
        setError(null);
        setShowNotification(false);

      } else {
        setError(data.message || 'ユーザー名の取得に失敗しました');
        setShowNotification(true);
        setUsername(null);
      }
    } catch (err) {
      setError('ユーザー名の取得中にエラーが発生しました');
      setShowNotification(true);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionDetail();
    console.log('categoryId:', categoryId);
  }, [fetchQuestionDetail])


  const handleUpdate = async () => {

    // const selectedTagIds = selectedTags;

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
    <div className="flex items-center justify-center my-4">
      <h1 className="text-2xl font-bold my-6 mx-auto flex items-center justify-center">質問詳細画面</h1>
      <button
        onClick={fetchQuestionDetail}
        className="text-gray-500 bg-gray-100 text-md p-1 rounded hover:text-gray-900 ml-4 mr-10"
        title="質問詳細を再読み込み"
      >
        <FontAwesomeIcon icon={faSync} className="m-1" />
      </button>
    </div>


    <ScrollToBottomButton />
    <div className="container mx-auto px-4 py-8 ">


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

          <div className="mx-auto w-3/4">
            <TagInput
              tagLabel="タグ"
              availableTags={availableTags}
              initialTags={question.tags.map(tag => tag.name)}
              onTagsChange={setSelectedTags}
            />
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
              categoryId={question.category_id}
              onEdit={() => {
                setQuestionModalOpen(true);
              }}
              onDelete={handleDelete}
            >
              <div className="text-blue-900 text-xs mb-4">
                質問ID: {questionId}
              </div>
              <div className="flex flex-wrap mb-4">
                {question.tags?.map((tag, index) => (
                  <span key={index} className="bg-blue-500 text-white px-4 py-1 rounded-full mr-2 mb-2 text-xs">
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center mt-4">
                    <ProfileImageDisplay />

                    <div className="ml-4">
                      <p className="text-gray-900 text-sm">
                        {username ? username : 'ユーザー名登録なし'}
                      </p>

                      <div className="text-left text-xs mt-2 text-gray-900">
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
              <hr className="my-4 border-gray-300" />

              <div className="text-gray-700 text-md mb-4">
                <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
              </div>

            </Card><div className='flex flex-start h-30'>
                <div className="my-6 text-right">
                  <button
                    className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 ml-10 transition-transform duration-300 ease-in-out transform hover:scale-105"

                    onClick={() => setAnswerModalOpen(true)}
                  >
                    <span className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-2xl">
                      ⊕
                    </span>
                    回答を投稿
                  </button>
                </div>

                {answerModalOpen && (
                <AnswerForm questionId={questionId} fetchAnswers={fetchAnswers} />
                )}
              </div>

              <AnswerList questionId={questionId} answers={answers} categoryId={categoryId} />
            </>
          )}

    </div>
  </>
  );
}
