'use client';

import { SetStateAction, useCallback, useEffect, useState } from 'react';
import styles from './QuestionDetail.module.css';
import DOMPurify from 'dompurify';
import { useLoading } from '../../context/LoadingContext';
import AnswerForm from '../Answers/AnswerForm';
import AnswerList from '../Answers/AnswerList';
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
import useAuth from '@/app/lib/useAuth';
import { toast } from 'react-toastify';
import { set } from 'lodash';


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
  is_draft: boolean;
}

export default function QuestionDetail({ questionId }: { questionId: string }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [tags, setTags] = useState<{ id: string, name: string }[]>([])
  const { setLoading } = useLoading();
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isConfirmingResolved, setIsConfirmingResolved] = useState(false);
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const isPublic = false;

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
      setLoading(true);

      const response = await fetch(`/api/questions/${questionId}/answers`);
      const data = await response.json();

      setAnswers(data.answers);

    } catch (error) {
      console.error('回答の取得に失敗しました', error);
      toast.error('回答の取得に失敗しました', {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchAnswers();
  }, [setLoading, setAnswerModalOpen]);


  const fetchQuestionDetail = useCallback(async () => {

    const tags = question?.tags?.map(tag => tag.name) || [];

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
        console.error(data.message || 'データの取得に失敗しました');
        toast.error('データの取得に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
      }

    } catch (err) {
      console.error('データの取得中にエラーが発生しました');
      toast.error('データの取得中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });

    } finally {
      setLoading(false);
    }

  }, []);


  useEffect(() => {
    fetchQuestionDetail();
  }, [fetchQuestionDetail])


  const handleResolved = async () => {
    if (!userId || question?.user_id !== userId) {
      console.error('解決済みフラグを変更する権限がありません');
      toast.error('解決済みを変更する権限がありません', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/questions/${questionId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_resolved: !question?.is_resolved }),
      });

      if (response.ok) {
        toast.success('解決済み状態が更新されました', {
          position: "top-center",
          autoClose: 2000,
        });
        setIsConfirmingResolved(false);
        fetchQuestionDetail();

      } else {
        console.error('解決済み状態の更新に失敗しました');
        toast.error('更新に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
      }

    } catch (err) {
      console.error('解決済み状態の更新中にエラーが発生しました');
      toast.error('更新中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
    }finally {
      setLoading(false);
    }
  };


  const handleUpdate = async () => {



      if (!userId) {
        setQuestionModalOpen(false);
        console.error('ログインしてください。');
        toast.error('ログインしてください。', {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      if (question?.user_id !== userId) {
        setQuestionModalOpen(false);
        console.error('この投稿を編集する権限がありません。');
        toast.error('この投稿を編集する権限がありません。', {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      if (!newTitle) {
        console.error('タイトルを入力してください');
        toast.error('タイトルを入力してください', {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      if (!newDescription) {
        console.error('本文を入力してください');
        toast.error('本文を入力してください', {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      if (selectedTags.length === 0) {
        console.error('タグを1つ以上 あらためて指定してください');
        toast.error('タグを1つ以上 あらためて指定してください', {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

    try {
      setLoading(true);

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

        toast.success('質問が更新されました', {
          position: "top-center",
          autoClose: 2000,
        });

        setLoading(false);
        fetchQuestionDetail();
        setQuestionModalOpen(false);
        router.push(`/questions/${questionId}`);

      } else {
        console.error(data.message || '更新に失敗しました');
        toast.error('更新に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('更新中にエラーが発生しました');
      toast.error('更新中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
      setLoading(false);
    }finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {

    if (!userId) {
      console.error('ログインしてください。');
      toast.error('ログインしてください。', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (question?.user_id !== userId) {
      console.error('この投稿を削除する権限がありません。');
      toast.error('この投稿を削除する権限がありません。', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('質問が削除されました', {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
        router.push('/questions');
      } , 1000);

      } else {
        console.error('削除に失敗しました');
        toast.error('削除に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error('削除中にエラーが発生しました');
      toast.error('削除中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
    }finally {
      setLoading(false);
    };
  }

  const handleCancel = () => {
    setNewTitle(question?.title || '');
    setNewDescription(question?.description || '');
    setSelectedTags(question?.tags.map(tag => tag.name) || []);
    setQuestionModalOpen(false);
  };


  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/tags');
        const data = await response.json();
        setAvailableTags(data);

      } catch (error) {
        console.error('タグの取得に失敗しました:', error);
        toast.error('タグの取得に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
      }finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);


  const buttons = [
    {
      label: '更新',
      className: 'bg-blue-500 text-white text-sm whitespace-nowrap',
      onClick: handleUpdate,
    },
    {
      label: 'キャンセル',
      className: 'bg-blue-500 text-white text-sm whitespace-nowrap',
      onClick: handleCancel,
    },
  ];


  const openAnswerModal = () => {
    setAnswerModalOpen(false);
    setTimeout(() => setAnswerModalOpen(true), 50);
  };


  if (!question) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-center mt-16">
        <h1 className="mx-auto flex items-center justify-center text-blue-900">質問詳細ページ</h1>
      </div>

      <div className="container mx-auto px-4 py-8 sm:w-[95%] lg:w-[1200px]">

        {questionModalOpen ? (
          <Modal isOpen={questionModalOpen} onClose={handleCancel} title="質問を編集">
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
                onCancel={handleCancel}
              />

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
            id={question.id}
            type="questions"
            title={question.title}
            ownerId={question.user_id}
            categoryId={question.category_id}
            onRefresh={fetchQuestionDetail}
            isResolved={question.is_resolved}
            isDraft={question.is_draft}
            createdAt={question.created_at}
            isPublic={false}
            onEdit={() => {
              setQuestionModalOpen(true);
            }}
            onDelete={handleDelete}
          >
            {/* <div className="text-blue-900 text-sm mb-4">
              質問ID: {questionId}
            </div> */}

            {question.is_resolved && (
              <div className="absolute top-8 right-2 font-semibold text-sm text-red-400 py-2">
                <FontAwesomeIcon icon={faAward} className="mr-2 text-xl text-yellow-300" />解決済み
              </div>
            )}

          <div>
            {userId === question.user_id && !question.is_resolved && (
              <button
                onClick={triggerConfirmResolved}
                className="absolute top-8 right-0 mb-4 ml-2 text-white text-xs px-3 py-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105 bg-gray-400"
              >
                解決済みにする
              </button>
            )}

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

            <div className="flex flex-wrap mt-8">
              {question.tags?.map((tag, index) => (
                <span key={index} className="bg-blue-500 text-white px-4 py-1 rounded-full mr-2 mb-2 text-sm">
                  {tag.name}
                </span>
              ))}
            </div>

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
              {!question.is_resolved && userId !== question.user_id && (
                <button
                  className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600 ml-10 transition-transform duration-300 ease-in-out transform hover:scale-105"
                  onClick={openAnswerModal}
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

            <AnswerList
              questionId={questionId}
              answers={question.answers}
              categoryId={categoryId}
              fetchAnswers={fetchAnswers}
              isResolved={question.is_resolved}
            />
          </>
        )}
      </div>
    </>
  );
}
