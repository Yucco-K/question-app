'use client';

export const fetchCache = 'force-no-store';

import { ReactNode, useEffect, useState } from 'react';
import Notification from './Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEllipsisV, faSync, faEye, faBookmark, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import useAuth from '@/app/lib/useAuth';

interface CardProps {
  title?: string;
  categoryId?: string | null;
  children: ReactNode;
  category?: string;
  imageUrl?: string;
  footer?: ReactNode;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  showMenuButton?: boolean;
  onOpenLoginModal?: () => void;
  id?: string;
  ownerId?: string;
  onRefresh?: () => void;
  isResolved: boolean;
  isDraft: boolean;
  showReadMoreButton?: boolean;
  showViewCount?: boolean;
  viewCount?: number;
  type: 'questions' | 'answers' | 'comments' | "drafts" | "bookmarks";
  questionId?: string;
  isPublic?: boolean;
  isPublicScreen?: boolean;
  createdAt?: string;
}

interface Bookmark {
  question_id: string;
  is_bookmark: boolean;
}

export default function Card({
  title,
  categoryId,
  category,
  children,
  footer,
  className = '',
  onEdit,
  onDelete,
  showMenuButton = true,
  showViewCount = true,
  ownerId,
  onRefresh,
  isResolved,
  isDraft,
  showReadMoreButton = true,
  viewCount = 0,
  type,
  id,
  isPublic,
  isPublicScreen,
  createdAt,
}: CardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [viewCounter, setViewCounter] = useState(viewCount);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;


  const isNewPost = (): boolean => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    return currentDate.getTime() - createdDate.getTime() < oneWeekInMilliseconds;
  };


  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };


  const fetchBookmark = async () => {

    const questionId = id;

    if (isPublic || isPublicScreen) {
      console.log('公開ページのため、ブックマークの取得をスキップします。');
      setLoading(false);
      return;
    }

    if (!userId) {
    console.log('ユーザーがログインしていないため、ブックマークの取得をスキップします。');
    setLoading(false);
    return;
  }

    if (!loading && !userId) {
      setError('ログインしてください。');
      setShowNotification(true);
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/bookmarks?question_id=${questionId}&user_id=${userId}`);
      const data = await response.json();

      if (data.success && data.bookmarks.length > 0) {

        setBookmarks(data.bookmarks);

      } else {
        setBookmarks([]);
      }
    } catch (error) {
      console.error('ブックマークの取得に失敗しました:', error);
      setError('ブックマークの取得に失敗しました');
    }finally {
      setLoading(false);
      setShowNotification(true);
    }
  };

  useEffect(() => {
      fetchBookmark();

  }, [userId, id]);


  const toggleBookmark = async () => {
    const questionId = id;
    setLoading(true);

  if (!loading && !userId) {
    setError('ログインしてください。');
    setShowNotification(true);
    return false;
  }

  if (bookmarkId) {

    await fetch(`/api/bookmarks/${bookmarkId}`, {
      method: 'PATCH',
    });
  } else {

    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, question_id: questionId }),
    });

    const data = await response.json();

    if (data.success) {
      fetchBookmark();
      // window.location.reload();
    }
  }
  setLoading(false);};



  const fetchViewCount = async () => {
    try {
      if (type !== 'comments' && type !== 'answers' && type !== 'bookmarks') {
        const endpoint = `/api/questions/${id}/increment-view`;
        const response = await fetch(endpoint);

        if (response.ok) {
          const data = await response.json();
          setViewCounter(data.data.view_count);
        } else {
          console.error('閲覧数の取得に失敗しました');
        }
      }
    } catch (error) {
      console.error('閲覧数の取得中にエラーが発生しました:', error);
    }
  };

  useEffect(() => {
    fetchViewCount();
  }, []);


  const incrementViewCount = async () => {
    try {
      if (type !== 'comments' && type !== 'answers' && type !== 'bookmarks') {
        const endpoint = `/api/questions/${id}/increment-view`;
        const response = await fetch(endpoint, {
          method: 'PATCH',
        });

        if (response.ok) {
          setViewCounter(viewCounter + 1);
        } else {
          console.error('閲覧数の増加に失敗しました');
        }
      } else {
        console.log('このタイプの投稿では閲覧数を増加しません');
      }
    } catch (error) {
      console.error('閲覧数の増加中にエラーが発生しました:', error);
    }
  };


  const toggleExpand = () => {
    if (!isExpanded && (type === 'questions' )) {
      incrementViewCount();
    }

    setIsExpanded(!isExpanded);
  }


  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };


  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };


  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsConfirmingDelete(false);
  };


  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isMenuOpen) {
      timer = setTimeout(() => {
        setIsMenuOpen(false);
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isMenuOpen]);


  useEffect(() => {

    if (!categoryId) {
      return;
    }

    const fetchCategoryName = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCategoryName(data.name);
        } else {
          setCategoryName('カテゴリ不明');
        }
      } catch (error) {
        console.error('カテゴリ名の取得に失敗しました:', error);
        setCategoryName('カテゴリ不明');
      }
    };

    if (categoryId && !category) {
      fetchCategoryName();
    }
  }, [categoryId, category]);


  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="relative border rounded-lg shadow-md overflow-hidden bg-white max-w-[1200px]">
        {isNewPost() && (
          <div className="absolute left-20 top-4 text-yellow-500 px-1 py-1 rounded-b-md text-sm font-bold">
            NEW
          </div>
        )}

        <div className="p-4 mt-4">
          <div className={`card-base-styles ${className}`}>
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <span className=" text-blue-900 text-sm font-semibold">
                {categoryName || 'カテゴリなし'}
              </span>

              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="text-gray-500 bg-gray-100 p-1 text-lg rounded hover:text-gray-900"
                  title="最新の情報を取得"
                >
                  <FontAwesomeIcon icon={faSync} />
                </button>
              )}

              {showMenuButton && userId === ownerId && (
                <button
                  onClick={toggleMenu}
                  onMouseEnter={() => setIsMenuOpen(true)}
                  className="text-blue-700 hover:text-blue-900 text-lg cursor-pointer"
                  title="More Options"
                >
                  <FontAwesomeIcon icon={faEllipsisV} className='text-xl ml-4' />
                </button>
              )}

              {isMenuOpen && (
                <div className="absolute right-0 top-0 bg-white border shadow-md rounded-md z-50">
                  <ul className="flex flex-col space-y-2 p-2">
                  {!isResolved && onEdit && (
                      <li>
                        <button
                          onClick={onEdit}
                          className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer flex items-center space-x-2 p-2"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </li>
                    )}
                    {onDelete && (
                      <li>
                        <button
                          onClick={handleDeleteClick}
                          className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer flex items-center space-x-2 p-2"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {!isPublic && (type === 'questions' || type === 'bookmarks') && (
              <button onClick={toggleBookmark} className="absolute top-4 left-4">

                {bookmarks.some(bookmark => bookmark.question_id === id && bookmark.is_bookmark) ? (
                  <FontAwesomeIcon icon={faBookmark} className="text-lg text-blue-400" />
                ) : (
                  <FontAwesomeIcon icon={faBookmark} className="text-lg text-gray-300" />
                )}
              </button>
            )}


            {isConfirmingDelete && (
              <div
                className="absolute inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
                onClick={handleCancelDelete}
              >
                <div className="bg-white p-10 rounded shadow-md z-60" onClick={(e) => e.stopPropagation()}>
                  <p className="text-center mb-6 z-70">本当に削除しますか？</p>
                  <div className="flex justify-center space-x-4 z-70">
                    <button
                      className="py-2 px-6 bg-red-400 text-white rounded hover:bg-red-400 whitespace-nowrap"
                      onClick={handleDelete}
                    >
                      削除
                    </button>
                    <button
                      className="py-2 px-6 bg-gray-300 text-black rounded hover:bg-gray-400 whitespace-nowrap"
                      onClick={handleCancelDelete}
                    >
                      キャンセル
                    </button>
                  </div>
                  <p className='text-red-500 text-sm mt-4'>※ この操作は元に戻せません。</p>
                </div>
              </div>
            )}

            <h3 className="text-lg mt-8 mb-4 break-words whitespace-normal">{title}</h3>

              <>
              <div className="relative">
                <div
                  className={`relative transition-all duration-10 ${
                    isExpanded ? 'max-h-full' : 'max-h-[300px]'
                  } overflow-hidden`}
                  style={{ lineHeight: '1.5rem' }}
                >
                  {children}
                </div>

                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                )}
              </div>

                {showReadMoreButton && (
                <button
                  onClick={() => {
                    toggleExpand();
                  }}
                  className="text-gray-500 text-md font-bold mt-2 hover: transition transform hover:scale-110 duration-300 ease-in-out px-3 py-1 rounded-md text-md font-bold"
                >
                    {isExpanded ? (
                      <>
                        <FontAwesomeIcon icon={faChevronUp} className="mr-2 text-sm text-gray-300" />
                        <span className="ml-2">折りたたむ</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faChevronDown} className="mr-2 text-sm text-gray-300" />
                        <span className="ml-2">… 続きを読む</span>
                      </>
                    )}
                </button>
                )}
              </>

              {footer && <div className="text-sm text-bold text-blue-900 border-t pt-4">{footer}</div>}

              {showViewCount && (
                <div className="absolute bottom-4 right-4 flex items-center text-gray-500 text-sm">
                  <FontAwesomeIcon icon={faEye} className="mr-2" />
                  <span>ViewCount: {viewCounter}</span>
                </div>
              )}

          </div>
        </div>
      </div>
    </>
  );
}
