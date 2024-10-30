'use client';

import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import DOMPurify from 'dompurify';
import BestAnswer from './BestAnswer';
import CommentList from '../comments/CommentList';
import AnswerForm from './AnswerForm';
import Vote from '../ui/Vote';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import useAuth from '@/app/lib/useAuth';
import styles from './AnswerList.module.css';
import UserProfileImage from '../profile/UserProfileImage';
import UserNameDisplay from '../profile/UserNameDisplay';
import { toast } from 'react-toastify';

interface Answer {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface AnswerUser {
  id: string;
  username: string;
}

interface AnswerListProps {
  questionId: string;
  categoryId: string;
  answers: Answer[];
  fetchAnswers: () => void;
  isResolved: boolean;
}

export default function AnswerList({ questionId, categoryId, answers: initialAnswers, isResolved }: AnswerListProps){
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [answerUsers, setAnswerUsers] = useState<AnswerUser[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | undefined>(undefined);
  const [selectedAnswerContent, setSelectedAnswerContent] = useState<string | undefined>(undefined);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | undefined>(undefined);
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;

  const fetchAnswers = async () => {

    try {
      setLoading(true);

      const response = await fetch(`/api/questions/${questionId}/answers`);
      if (!response.ok) {
        throw new Error('回答データの取得に失敗しました');
      }
      const data = await response.json();
      setAnswers(data.answers);
      setAnswerUsers(data.answerUsersData || []);

    } catch (err) {
      console.log('回答の取得中にエラーが発生しました');
      toast.error('回答の取得中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (answerId: string) => {

    if (!userId) {
      console.log('ログインしてください。');
      toast.error('ログインしてください。', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const answer = answers.find((a) => a.id === answerId);
    if (!answer || answer.user_id !== userId) {
      console.log('この投稿を削除する権限がありません。');
      toast.error('この投稿を削除する権限がありません。', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/answers/${answerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('回答の削除に失敗しました');
      }
      setAnswers(answers.filter((answer) => answer.id !== answerId));
      toast.success('回答が削除されました', {
        position: "top-center",
        autoClose: 2000,
      });
      await fetchAnswers();

    } catch (err) {
      console.error('Error deleting answer:', err);
      toast.error('回答の削除中にエラーが発生しました。', {
        position: "top-center",
        autoClose: 2000,
      });
    }finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAnswers();
  }, [questionId]);


  const handleEditClick = (answerId: string, content: string) => {
    setEditingAnswerId(answerId);
    setSelectedAnswerContent(content);
    setIsEditing(true);
    setAnswerModalOpen(true);
  }


  if (isLoading) return <p>読み込み中...</p>;

  return (
    <>
      <ScrollToBottomButton isModalOpen={answerModalOpen} />
      <h2 className="text-lg my-4 flex items-center justify-center mr-10 text-blue-900">
        全{answers ? answers.length : 0 }件の回答
      </h2>
      <div className="space-y-5">
        {answers && answers.length > 0 ? (
          answers.map((answer) => {
            const sanitizedDescription = DOMPurify.sanitize(answer.content);

            return (
              <Card
                key={answer.id}
                id={answer.id}
                type="answers"
                title=""
                ownerId={answer.user_id}
                categoryId={categoryId}
                onRefresh={fetchAnswers}
                onEdit={() => handleEditClick(answer.id, answer.content)}
                onDelete={() => handleDelete(answer.id)}
                isResolved={isResolved}
                isDraft={false}
                showViewCount={false}
                className="mb-5"
                footer={(
                  <div className="bottom-0 flex sm:flex-row flex-col justify-center items-center sm:gap-x-2 gap-y-2">
                    <Vote
                      answerId={answer.id}
                      userId={userId ?? ''}
                      answerUserId={answer.user_id}
                    />
                      <div className="bottom-0 flex justify-center items-center sm:mt-0 mt-4">
                        <CommentList
                          questionId={questionId}
                          answerId={answer.id}
                          categoryId={categoryId}
                          selectedAnswerId={selectedAnswerId}
                          setSelectedAnswerId={setSelectedAnswerId}
                          isResolved={isResolved}
                        />
                    </div>
                  </div>
                )}
              >

                <div className="text-blue-900 text-sm mb-1">
                  回答ID: {answer.id}
                </div>

                {answer.user_id !== userId && (
                  <BestAnswer questionId={questionId} answerId={answer.id} />
                )}

                <div className="flex items-center mt-4">
                  <UserProfileImage userId={answer.user_id} />

                  <div className="ml-4">
                    <p className="text-sm">
                      <UserNameDisplay userId={answer.user_id} />
                    </p>
                    <p className="text-sm my-2">
                      {answer.created_at ? (
                        new Date(answer.created_at).toLocaleString('ja-JP', {
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
                    </p>
                  </div>
                </div>

                <hr className="my-4 border-gray-300" />

                <div className={`my-4 ${styles.answerBody}`}>
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                </div>

                {answerModalOpen && (
                  <AnswerForm
                    questionId={questionId}
                    fetchAnswers={fetchAnswers}
                    answerId={editingAnswerId}
                    initialAnswer={selectedAnswerContent}
                    isEditing={true}
                  />
                )}

              </Card>
            );
          })
        ) : (
          <div>
            <p className='text-blue-900'>まだ回答がありません。</p>
            <p className='text-blue-900 text-sm mt-4'>この質問に回答して、この質問の初めての回答者になりましょう！</p>
          </div>
        )}
      </div>
    </>
  );
}
