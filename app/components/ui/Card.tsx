'use client';

import { ReactNode, useEffect, useState } from 'react';
import Notification from './Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEllipsisV, faSync, faEye, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../context/UserContext';

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
  isPublicScreen?: boolean;
  onOpenLoginModal?: () => void;
  id?: string;
  ownerId?: string;
  onRefresh?: () => void;
  isResolved: boolean;
  isDraft: boolean;
  showReadMoreButton?: boolean;
  viewCount?: number;
  type: 'questions' | 'answers' | 'comments' | "drafts";
  showViewCount?: boolean;
  questionId?: string;
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
  ownerId,
  onRefresh,
  isResolved,
  isDraft,
  showReadMoreButton = true,
  viewCount = 0,
  type,
  id,
  showViewCount = true,
  questionId,
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

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const { userId } = useUser();


    const fetchBookmark = async () => {
      setLoading(true);
      const questionId = id;

      console.log('fetchBookmark');
      console.log('id:', id);
      console.log('userId:', userId);
      console.log('questionId:', questionId);
      console.log(`/api/bookmarks?question_id=${questionId}&user_id=${userId}`);

      if (!loading && !userId) {
        setError('ログインしてください。');
        setShowNotification(true);
        return false;
      }

      try {

        const response = await fetch(`/api/bookmarks?question_id=${questionId}&user_id=${userId}`);
        const data = await response.json();

        if (data.success && data.bookmarks.length > 0) {
          // ブックマークを配列として状態に保存
          setBookmarks(data.bookmarks);
          console.log('ブックマークを取得しました:', data.bookmarks);

          // 各質問IDに対応するブックマークIDをオブジェクトとして保存
          // const bookmarkMap: { [key: string]: any } = {};
          // data.bookmarks.forEach((bookmark: { question_id: string | number; id: any; }) => {
          //   bookmarkMap[bookmark.question_id] = bookmark.id;
          // });
          // setBookmarkIds(bookmarkMap);
        } else {
          // ブックマークがない場合、空配列として設定
          setBookmarks([]);
          // setBookmarkIds({});
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

    }, [userId, questionId, id]);


    const toggleBookmark = async () => {
      const questionId = id;
      setLoading(true);

      if (!loading && !userId) {
        setError('ログインしてください。');
        setShowNotification(true);
        return false;
      }

      console.log('toggleBookmark');
      console.log('userId:', userId);
      console.log('questionId:', questionId);

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

        console.log('APIレスポンスのデータ:', data);
        // if (response.ok && data && data.data) {
        //   setBookmarkId(data.data.id);
        //   setIsBookmarked(!isBookmarked);
        // }
        if (data.success) {
          // 最新のブックマーク状態を取得して更新
          fetchBookmark();
        }
      }
      setLoading(false);};


  const fetchViewCount = async () => {
    try {
      const response = await fetch(`/api/${type}/${id}/increment-view`);

      const data = await response.json();
      if (response.ok) {
        setViewCounter(data.data.view_count);
        console.log('閲覧数を取得しました:', viewCounter);
      } else {
        console.error('閲覧数の取得に失敗しました');
      }
    } catch (error) {
      console.error('閲覧数の取得中にエラーが発生しました:', error);
    }
  };

  useEffect(() => {
    fetchViewCount();
  }, [viewCount]);


  const incrementViewCount = async () => {
    try {
      const response = await fetch(`/api/${type}/${id}/increment-view`, {
        method: 'POST',
      });
      if (response.ok) {
        setViewCounter(viewCounter + 1);
      } else {
        console.error('閲覧数の増加に失敗しました');
      }
    } catch (error) {
      console.error('閲覧数の増加中にエラーが発生しました:', error);
    }
  };


  const toggleExpand = () => {
    console.log('ここは奇数回と偶数回の両方が通ります');
    if (!isExpanded ) {
      incrementViewCount();
      console.log('閲覧数を増加させました');
      console.log('viewCounter ここは奇数回のみ通ります:', viewCounter);
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
      console.log('categoryIdが指定されていません');
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
        console.log('data:', data);
        if (response.ok) {
          setCategoryName(data.name);
          console.log('カテゴリ名を取得しました:', data.name);
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
      <div className="relative border rounded-lg shadow-md overflow-hidden bg-white max-w-[1400px]">
        <div className="p-10">
          <div className={`card-base-styles ${className}`}>
            <div className="absolute top-4 right-4 flex items-center space-x-10">
              <span className=" text-blue-900 text-sm font-semibold">
                {categoryName || 'カテゴリなし'}
              </span>

              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="text-gray-500 bg-gray-100 p-1 text-sm rounded hover:text-gray-900"
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
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
              )}

              {isMenuOpen && (
                <div className="absolute right-0 top-10 bg-white border shadow-md rounded-md z-50">
                  <ul className="flex flex-col space-y-2 p-2">
                  {!isResolved && onEdit && (
                      <li>
                        <button
                          onClick={onEdit}
                          className="text-gray-500 hover:text-gray-700 text-lg cursor-pointer flex items-center space-x-2 p-2"
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
                          className="text-gray-500 hover:text-gray-700 text-lg cursor-pointer flex items-center space-x-2 p-2"
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

            {type === 'questions' && (
              <button onClick={toggleBookmark} className="absolute top-4 left-4">

                {bookmarks.some(bookmark => bookmark.question_id === id && bookmark.is_bookmark) ? (
                  <FontAwesomeIcon icon={faBookmark} className="text-blue-300" />
                ) : (
                  <p className="transition transform hover:scale-110 duration-300 ease-in-out px-3 py-1 rounded-md text-xs text-semibold">ブックマークに登録</p>
                )}
              </button>
            )}


            {isConfirmingDelete && (
              <div
                className="absolute inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
                onClick={handleCancelDelete}
              >
                <div className="bg-white p-10 rounded shadow-md" onClick={(e) => e.stopPropagation()}>
                  <p className="text-center mb-6">本当に削除しますか？</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      className="py-2 px-6 bg-red-500 text-white rounded"
                      onClick={handleDelete}
                    >
                      削除
                    </button>
                    <button
                      className="py-2 px-6 bg-gray-300 text-black rounded"
                      onClick={handleCancelDelete}
                    >
                      キャンセル
                    </button>
                  </div>
                <p className='text-red-500 text-sm mt-4'>※ この操作は元に戻せません。</p>
                </div>
              </div>
            )}

            <h3 className="text-lg mt-6 mb-4 font-bold">{title}</h3>

              <>
              <div className="relative">
                <div
                  className={`relative transition-all duration-300 ${
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
                  className="text-gray-500 text-sm mt-2 hover: transition transform hover:scale-110 duration-300 ease-in-out px-3 py-1 rounded-md text-md text-semibold"
                >
                    {isExpanded ? '折りたたむ' : '… 続きを読む'}
                </button>
                )}
              </>

              {footer && <div className="text-sm text-bold text-blue-900 border-t pt-4">{footer}</div>}

              {showViewCount && (
                <div className="absolute bottom-4 right-10 flex items-center text-gray-500 text-sm">
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
