'use client';

import React, { useState, useEffect } from 'react';
import styles from './CommentList.module.css';
import Modal from '../ui/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import Card from '../ui/Card';
import CommentForm from './CommentForm';
import Notification from '../ui/Notification';
import Form from '../ui/Form';
import ButtonGroup from '../ui/ButtonGroup';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import UserProfileImage from '../profile/UserProfileImage';
import useAuth from '@/app/lib/useAuth';
import DOMPurify from 'dompurify';
import DefaultHeader from '../Layout/header/DefaultHeader';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  question_id: string;
  answer_id?: string;
  username?: string;
}

interface CommentListProps {

  questionId: string;
  answerId?: string;
  categoryId: string;
  isResolved?: boolean;
  selectedAnswerId: string | undefined;
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function CommentList({ questionId, answerId, categoryId, selectedAnswerId, setSelectedAnswerId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedCommentId,setSelectedCommentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [commentListModalOpen, setCommentListModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [initialBody, setInitialBody] = useState<string>('');
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const [isModalOpen, setIsModalOpen] = useState(false);


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/comments');
      const data = await response.json();

      if (response.ok) {

        const filteredComments = data.comments.filter((comment: Comment) => {
          if (answerId) {
            return comment.question_id === questionId && comment.answer_id === answerId;
          }
          return comment.question_id === questionId && !comment.answer_id;
        });

        const commentsWithUsername = await Promise.all(
          filteredComments.map(async (comment: { user_id: string }) => {
            const username = await fetchUsername(comment.user_id);
            return { ...comment, username };
          })
        );

        setComments(commentsWithUsername);

      } else {
        setError('コメントの取得に失敗しました');
        setShowNotification(true);
      }
    } catch (err) {
      setError('エラーが発生しました');
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchCommentCount = async () => {

      try {
        const response = await fetch(`/api/comments/count?answerId=${answerId}`);
        const data = await response.json();
        if (response.ok) {
          setCommentCount(data.commentCount || 0);
          console.log('data.commentCount:', data.commentCount);
        } else {
          setError('コメント数の取得に失敗しました');
        }
      } catch (err) {
        setError('コメント数の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchCommentCount();
  }, [answerId]);


  useEffect(() => {
    if (commentListModalOpen) {
      fetchComments();
    }
  }, [commentListModalOpen, questionId, answerId]);


  const fetchUsername = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/profile`);
      const data = await response.json();
      if (response.ok) {
        return data.username;
      } else {
        return 'ユーザー名の取得に失敗しました';
      }
    } catch (err) {
      return 'エラーが発生しました';
    }
  };

  const handleEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    setIsEditing(true);
    setCommentListModalOpen(true);
    setInitialBody(content);
  };

  const handleEditSubmit = async (commentId: string) => {
      setError(null);
      setSuccess(null);
      setShowNotification(false);

      if (!userId) {
        console.error("ユーザーがログインしていません");
        setError("ログインしてください");
        setShowNotification(true);
        return;
      }

      const comment = comments.find(c => c.id === commentId);

      if (comment?.user_id !== userId) {
        setError('この投稿を編集する権限がありません。');
        setShowNotification(true);
        return;
      }

    try {
      setLoading(true);

      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newContent: editingContent,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        const updatedComments = comments.map(comment =>
          comment.id === commentId ? { ...comment, content: editingContent } : comment
        );
        setComments(updatedComments);
        setSuccess('コメントが更新されました');
        fetchComments();
      } else {
        setError(data.message || 'コメントの更新に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました');
    }finally {
      setLoading(false);
      setShowNotification(true);
      setIsEditing(false);
      setSelectedCommentId(null);
      setEditingContent('');
      setInitialBody('');
    }
  };

  const handleCancel = () => {
    setSelectedCommentId(null);
    setEditingContent('');
    setInitialBody('');
    fetchComments();
  };

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(`/api/comments/count?answerId=${answerId}`);
      const data = await response.json();
      if (response.ok) {
        setCommentCount(data.commentCount || 0);
      } else {
        setError('コメント数の取得に失敗しました');
      }
    } catch (err) {
      setError('コメント数の取得中にエラーが発生しました');
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId));
        setSuccess('コメントが削除されました');
        setShowNotification(true);
        fetchCommentCount();
        fetchComments();

      } else {
        setError('コメントの削除に失敗しました');
        setShowNotification(true);
      }
    } catch (err) {
      setError('エラーが発生しました');
      setShowNotification(true);
    }
  };

  const openCommentModal = () => {
    setSelectedAnswerId(answerId);
    setCommentModalOpen(true);
  };

  useEffect(() => {
    if (commentListModalOpen) {
      fetchComments();
    }
  }, [commentListModalOpen, questionId, answerId]);


  return (
    <>

      <DefaultHeader style={{ display: 'none' }} />

      <ScrollToBottomButton isModalOpen={commentListModalOpen} />
      {!commentListModalOpen && (
        <div className="flex ml-2">
          <button
            onClick={() => {
              setCommentListModalOpen(true);
              setShowNotification(false);
            }}
            className="text-green-500 text-xs font-bold px-4 rounded whitespace-nowrap hover:text-green-600 transition-transform duration-300 ease-in-out transform hover:scale-105"
          >
            <FontAwesomeIcon
              icon={faComments}
              className={`mr-2 transition-transform duration-300 ease-in-out transform ${
                commentCount >= 1 ? 'scale-150' : 'scale-100'
              }`}
            />
            <span className='mx-2 sm:mt-4'>コメント:</span>
            <span className="text-lg font-bold">{commentCount}</span>
          </button>
        </div>
      )}

      {commentListModalOpen && (
        <Modal onClose={() => setCommentListModalOpen(false)} isOpen={true} title="コメント一覧">
          <div className="mb-4 flex relative">
            {showNotification && (
              <Notification
                message={error ?? success ?? ""}
                type={error ? "error" : "success"}
                onClose={() => setShowNotification(false)}
              />
            )}
          </div>
          <div className='flex flex-col items-center mb-16'>
            <h2 className="text-lg mb-4 text-blue-900">
              全{comments ? comments.length : 0}件のコメント
            </h2>

            <div className="space-y-5 flex flex-col w-full sm:w-4/5 lg:w-3/5">
              {isLoading ? (
                null
              ) : comments.length > 0 ? (
                comments.map((comment: Comment) => {
                  const sanitizedDescription = DOMPurify.sanitize(comment.content);
                  return (
                    <Card
                      key={comment.id}
                      id={comment.id}
                      type="comments"
                      ownerId={comment.user_id}
                      categoryId={categoryId}
                      onRefresh={fetchComments}
                      isResolved={false}
                      className="mb-5 w-full"
                      onEdit={() => handleEdit(comment.id, comment.content)}
                      onDelete={() => handleDelete(comment.id)}
                      isDraft={false}
                      showViewCount={false}
                    >
                      <div className="text-sm text-blue-900 mb-2">コメントID: {comment.id}</div>
                      {isEditing && editingCommentId === comment.id ? (
                        <div className="px-4 sm:px-1">
                          <Form
                            titleLabel="タイトル"
                            titlePlaceholder="タイトルを入力"
                            bodyLabel="本文"
                            bodyPlaceholder="ここに本文を入力"
                            initialTitle=""
                            initialBody={initialBody}
                            onTitleChange={() => console.log('タイトルは使用しません')}
                            onBodyChange={(value: string) => setEditingContent(value)}
                            showTitle={false}
                          />
                          <div className="mx-auto w-full sm:w-2/3">
                            <ButtonGroup
                              pattern={2}
                              buttons={[
                                {
                                  label: '更 新', className: 'bg-blue-600 text-white text-sm w-1/3', onClick: () => handleEditSubmit(comment.id),
                                },
                                {
                                  label: 'キャンセル', className: 'bg-gray-400 text-white text-sm w-1/3 whitespace-nowrap', onClick: () => setIsEditing(false),
                                }
                              ]}
                              buttonsPerRow={[2]}
                            />
                          </div>
                        </div>
                      ) : (
                        <div key={comment.id} className="p-2 mb-2">

                          <div className="flex items-center mt-4">
                          <UserProfileImage userId={comment.user_id} />
                            <div className="ml-4">
                              <p className="text-sm mb-2">{comment.username}</p>
                              <p className="text-sm ">
                                {comment.created_at ? (
                                  new Date(comment.created_at).toLocaleString('ja-JP', {
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

                          <div className={`mt-4 mb-4 ${styles.commentBody}`}>
                            <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                          </div>
                      </div>
                      )}
                    </Card>
                  );
                })
              ) : (
                <p className='text-blue-900'>まだコメントはありません。</p>
              )}
              <div className="fixed bottom-16 right-40">
                    <button
                      className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 ml-10 transition-transform duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap"
                      onClick={() => setCommentModalOpen(true)}
                    >
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 py-1 text-3xl">
                        ⊕
                      </span>
                      コメントを投稿
                    </button>
                  </div>
              </div>

            {commentModalOpen && (
              <>
                {showNotification && (error || success) && (
                  <Notification
                    message={error ?? success ?? ""}
                    type={error ? "error" : "success"}
                    onClose={() => setShowNotification(false)}
                  />
                )}
                <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto">
                  <div
                    className="fixed inset-0 bg-black opacity-40 backdrop-blur-xl"
                    onClick={() => setCommentModalOpen(false)}
                  ></div>

                  <div className="modal relative bg-white w-full h-full">
                    <button
                      className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-3xl"
                      onClick={() => setCommentModalOpen(false)}
                    >
                      ×
                    </button>

                    {selectedAnswerId && (
                      <div className="text-blue-900 text-sm mb-4">
                        回答ID: {selectedAnswerId}
                      </div>
                    )}

                    <CommentForm
                      questionId={questionId}
                      userId={userId}
                      answerId={answerId ?? ''}
                      onSubmit={(title: any, body: any) => {
                        console.log('コメント送信:', title, body);
                        setCommentModalOpen(false);
                      } }
                      onCancel={() => {
                        setCommentModalOpen(false);
                        setSelectedAnswerId(undefined);
                      } }
                      fetchComments={fetchComments}
                      fetchCommentCount={fetchCommentCount}
                      commentListModalOpen={false}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
