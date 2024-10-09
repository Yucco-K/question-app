'use client';

import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import DOMPurify from 'dompurify';
import BestAnswer from './BestAnswer';
import CommentList from '../comments/CommentList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import Notification from '../ui/Notification';
import { useLoading } from '../../context/LoadingContext';
import AnswerForm from './AnswerForm';
import Vote from '../ui/Vote';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import ProfileImageDisplay from '../profile/ProfileImageDisplay';

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
}

export default function AnswerList({ questionId, categoryId, answers: initialAnswers }: AnswerListProps){
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [answerUsers, setAnswerUsers] = useState<AnswerUser[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | undefined>(undefined);
  const [selectedAnswerContent, setSelectedAnswerContent] = useState<string | undefined>(undefined);
  const [commentModalOpen, setCommentModalOpen] = useState<boolean>(false);
  const [answerListModalOpen, setAnswerListModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | undefined>(undefined);
  const userId = "someUserId"; // Define the userId variable

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (answerId: string) => {
    console.log('Deleting answer with ID:', answerId);
    try {
      const response = await fetch(`/api/answers/${answerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('回答の削除に失敗しました');
      }
      setAnswers(answers.filter((answer) => answer.id !== answerId));
      setSuccess('回答が削除されました');
      setShowNotification(true);
      fetchAnswers();

    } catch (err) {
      setError('回答の削除中にエラーが発生しました');
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
    setAnswerListModalOpen(true);
  }

  useEffect(() => {
    console.log('answerListModalOpen state:', answerListModalOpen);
  }, [answerListModalOpen]);

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
      <h2 className="text-lg my-6 flex items-center justify-center mr-10 ">
        全{answers ? answers.length : 0 }件の回答
      </h2>
      <div className="space-y-5">
        {answers && answers.length > 0 ? (
          answers.map((answer) => {
            const sanitizedDescription = DOMPurify.sanitize(answer.content);

            const answerUser = answerUsers.find((user) => user.id === answer.user_id);
            return (
              <Card
                key={answer.id}
                title=""
                categoryId={categoryId}
                onEdit={() => handleEditClick(answer.id, answer.content)}
                onDelete={() => handleDelete(answer.id)}
                className="mb-5"
              >
                <div className="mb-4">
                  <button
                    onClick={fetchAnswers}
                    className="text-gray-500 bg-gray-100 p-1 text-md rounded hover:text-gray-900"
                    title="コメントを再読み込み"
                  >
                    <FontAwesomeIcon icon={faSync} className="mr-2" />
                  </button>
                </div>
                <div className="text-blue-900 text-xs mb-1">
                  回答ID: {answer.id}
                </div>
                <BestAnswer questionId={questionId} answerId={answer.id} />

                <div className="flex items-center mt-4">
                  <ProfileImageDisplay />

                  <div className="ml-4">
                    <p className="text-sm text-gray-900">
                      {answerUser ? answerUser.username : 'ユーザー名登録なし'}
                    </p>
                    <p className="text-xs text-gray-900 my-2">
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
                <div className="text-gray-700 text-md">
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                </div>

                {answerListModalOpen && (
                  <AnswerForm
                    questionId={questionId}
                    fetchAnswers={fetchAnswers}
                    answerId={editingAnswerId}
                    initialAnswer={selectedAnswerContent}
                    isEditing={true}
                  />
                )}

                <div className="flex items-center justify-end mb-4 gap-x-20">
                  <Vote
                    answerId={answer.id}
                    userId={userId}
                    answerUserId={answer.user_id}
                  />

                {/* {userId && ( */}
                <CommentList
                  questionId={questionId}
                  answerId={answer.id}
                  categoryId={categoryId}
                  selectedAnswerId={selectedAnswerId}
                  setSelectedAnswerId={setSelectedAnswerId}
                />
              </div>
                {/* )} */}
                {/* <div className='flex items-center justify-center relative h-20'>
                  <button
                    className="text-center text-gray-900 text-lg hover:bg-sky-100 rounded px-4 py-2 absolute bottom-0"
                    onClick={() => {
                      setCommentModalOpen(true);
                      setSelectedAnswerId(answer.id);
                    }}
                  >
                    この回答にコメントする
                  </button>
                </div> */}
              </Card>
            );
          })
        ) : (
          <p>まだ回答がありません。</p>
        )}
      </div>
    </>
  );
}
