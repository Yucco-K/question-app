'use client';

import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import DOMPurify from 'dompurify';
import BestAnswer from './BestAnswer';
import CommentList from '../comments/CommentList';
import Notification from '../ui/Notification';
import AnswerForm from './AnswerForm';
import Vote from '../ui/Vote';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import { useUser } from '../../context/UserContext';
import useAuth from '@/app/lib/useAuth';
import styles from './AnswerList.module.css';
import UserProfileImage from '../profile/UserProfileImage';
import UserNameDisplay from '../profile/UserNameDisplay';

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
}

export default function AnswerList({ questionId, categoryId, answers: initialAnswers }: AnswerListProps){
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [answerUsers, setAnswerUsers] = useState<AnswerUser[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | undefined>(undefined);
  const [selectedAnswerContent, setSelectedAnswerContent] = useState<string | undefined>(undefined);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | undefined>(undefined);
  const { userId } = useUser();
  const { loading, session } = useAuth();

  const fetchAnswers = async () => {

    setLoading(true);
    try {
      const response = await fetch(`/api/questions/${questionId}/answers`);
      if (!response.ok) {
        throw new Error('回答データの取得に失敗しました');
      }
      const data = await response.json();
      setAnswers(data.answers);
      setAnswerUsers(data.answerUsersData || []);
      setError(null);

    } catch (err) {
      setError('回答の取得中にエラーが発生しました');
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (answerId: string) => {
    console.log('Deleting answer with ID:', answerId);

    if (!userId) {
      setError('ログインしてください。');
      setShowNotification(true);
      return;
    }

    const answer = answers.find((a) => a.id === answerId);
    if (!answer || answer.user_id !== userId) {
      setError('この投稿を削除する権限がありません。');
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
      setSuccess('回答が削除されました');
      await fetchAnswers();

    } catch (err) {
      console.error('Error deleting answer:', err);
      setError('回答の削除中にエラーが発生しました');
    }finally {
      setLoading(false);
      setShowNotification(true);
    }
  };


  useEffect(() => {
    fetchAnswers();
  }, [questionId]);


  const handleEditClick = (answerId: string, content: string) => {
    console.log('Editing answer with ID:', answerId);
    setEditingAnswerId(answerId);
    setSelectedAnswerContent(content);
    setIsEditing(true);
    setAnswerModalOpen(true);
  }


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
      <ScrollToBottomButton />
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
                title=""
                ownerId={answer.user_id}
                categoryId={categoryId}
                onRefresh={fetchAnswers}
                onEdit={() => handleEditClick(answer.id, answer.content)}
                onDelete={() => handleDelete(answer.id)}
                isResolved={false}
                className="mb-5"
              >
                {/* <div className="mb-4">
                  <button
                    onClick={fetchAnswers}
                    className="text-gray-500 bg-gray-100 p-1 text-md rounded hover:text-gray-900"
                    title="コメントを再読み込み"
                  >
                    <FontAwesomeIcon icon={faSync} className="mr-2" />
                  </button>
                </div> */}
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

                <div className={`mt-8 mb-12 ${styles.answerBody}`}>
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

                <div className="absolute bottom-4 right-20 flex items-center justify-end gap-x-20">
                  <Vote
                    answerId={answer.id}
                    userId={userId ?? ''}
                    answerUserId={answer.user_id}
                  />


                    <div className="mt-6">
                      <CommentList
                        questionId={questionId}
                        answerId={answer.id}
                        categoryId={categoryId}
                        selectedAnswerId={selectedAnswerId}
                        setSelectedAnswerId={setSelectedAnswerId}
                      />
                  </div>
                </div>

              </Card>
            );
          })
        ) : (
          <p className='text-blue-900'>まだ回答がありません。</p>
        )}
      </div>
    </>
  );
}
