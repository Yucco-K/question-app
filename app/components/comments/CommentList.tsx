'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faComments, faSync } from '@fortawesome/free-solid-svg-icons';
import Card from '../ui/Card';
import CommentForm from './CommentForm';
import Notification from '../ui/Notification';
import Form from '../ui/Form';
import ButtonGroup from '../ui/ButtonGroup';
import Category from '../ui/Category';
import ScrollToBottomButton from '../ui/ScrollToBottomButton';
import ProfileImageDisplay from '../profile/ProfileImageDisplay';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

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
  selectedAnswerId: string | undefined;
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function CommentList({ questionId, answerId, categoryId, selectedAnswerId, setSelectedAnswerId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [commentListModalOpen, setCommentListModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [initialBody, setInitialBody] = useState<string>('');
  const [isBottomVisible, setIsBottomVisible] = useState(true);
  const userId = 'someUserId';


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

  const fetchUsername = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/name`);
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
    try {
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
        setShowNotification(true);
        setIsEditing(false);
        // setCommentListModalOpen(false);
      } else {
        setError(data.message || 'コメントの更新に失敗しました');
        setShowNotification(true);
      }
    } catch (err) {
      setError('エラーが発生しました');
      setShowNotification(true);
    }
  };

  const handleCancel = () => {
    setSelectedCommentId(null);
    setEditingContent('');
    setInitialBody('');
    fetchComments();
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
        // setCommentListModalOpen(false);
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
      <ScrollToBottomButton />
      {!commentListModalOpen && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setCommentListModalOpen(true);
              setShowNotification(false);
              // openCommentModal();
            }}
            className="text-green-500 px-4 py-2 rounded hover:text-green-600"
          >
            <FontAwesomeIcon icon={faComments} className="mr-2" />
            {comments.length}
          </button>
        </div>
      )}

      {commentListModalOpen && (
        <Modal onClose={() => setCommentListModalOpen(false)} isOpen={true} title="コメント一覧">
          <div className="mb-4 flex relative">
            {showNotification && (error || success) && (
              <Notification
                message={error ?? success ?? ""}
                type={error ? "error" : "success"}
                onClose={() => setShowNotification(false)}
              />
            )}

            {/* <button
              className="text-blue-500 hover:text-blue-700 px-4 py-2 rounded bg-gray-100 ml-20"
              onClick={() => setCommentModalOpen(true)}
            >
              コメントを投稿
            </button> */}

            <button
              onClick={fetchComments}
              className="text-gray-500 bg-gray-100 px-4 py-2 rounded hover:text-gray-900 ml-20"
              title="コメントを再読み込み"
            >
              <FontAwesomeIcon icon={faSync} className="mr-4 ml-2"/>リストを更新
            </button>
          </div>
          <div className='flex flex-col items-center mb-16'>
            <h2 className="text-lg mb-4">
              全{comments ? comments.length : 0}件のコメント
            </h2>

            <div className="space-y-5 flex flex-col w-4/5">
              {isLoading ? (
                <p>読み込み中...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : comments.length > 0 ? (
                comments.map((comment: Comment) => (
                  <Card
                    key={comment.id}
                    categoryId={categoryId}
                    className="mb-5 w-full"
                    onEdit={() => handleEdit(comment.id, comment.content)}
                    onDelete={() => handleDelete(comment.id)}
                  >
                    <div className="text-xs text-blue-900 mb-2">コメントID: {comment.id}</div>
                    {isEditing && editingCommentId === comment.id ? (
                      <div className="px-8">
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
                        <div className="mx-auto w-1/2">
                          <ButtonGroup
                            pattern={2}
                            buttons={[
                              {
                                label: '更 新', className: 'bg-blue-600 text-white text-sm w-1/4', onClick: () => handleEditSubmit(comment.id),
                              },
                              {
                                label: 'キャンセル', className: 'bg-gray-400 text-white text-sm w-1/4', onClick: () => setIsEditing(false),
                              }
                            ]}
                            buttonsPerRow={[2]}
                          />
                        </div>
                      </div>
                    ) : (
                      <div key={comment.id} className="bg-gray-100 p-2 rounded mb-2">

                        <div className="flex items-center mt-4">
                          <ProfileImageDisplay />
                          <div className="ml-4">
                            <p className="text-sm text-gray-900 mb-2">{comment.username}</p>
                            <p className="text-xs text-gray-900">
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
                        <hr className="m-4 border-gray-300" />
                        <div className="text-gray-700 mb-4 text-md">
                          <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                        </div>
                    </div>
                    )}
                  </Card>
                ))
              ) : (
                <p>コメントはまだありません。</p>
              )}
              <div className="my-6 text-right">
                    <button
                      className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 ml-10 transition-transform duration-300 ease-in-out transform hover:scale-105"
                      onClick={() => setCommentModalOpen(true)}
                    >
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-2xl">
                        ⊕
                      </span>
                      コメントを投稿
                    </button>
                  </div>
              </div>

            {commentModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto">
                <div
                  className="fixed inset-0 bg-black opacity-70 backdrop-blur-xl"
                  onClick={() => setCommentModalOpen(false)}
                ></div>

                <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 relative">
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
                      setSuccess('コメントが送信されました。');
                      setShowNotification(true);
                    }}
                    onCancel={() => {
                      setCommentModalOpen(false);
                      setSelectedAnswerId(undefined);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
