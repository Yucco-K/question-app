'use client';

import { ReactNode, useEffect, useState } from 'react';
import Notification from './Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEllipsisV, faSync } from '@fortawesome/free-solid-svg-icons';
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
  showReadMoreButton?: boolean;
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
  onClick,
  showMenuButton = true,
  isPublicScreen = false,
  onOpenLoginModal,
  ownerId,
  onRefresh,
  isResolved,
  showReadMoreButton = true,
}: CardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const { userId } = useUser();

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };

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
                  className="text-gray-500 bg-gray-100 p-1 text-md rounded hover:text-gray-900"
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
                  onClick={toggleExpand}
                  className="text-gray-500 text-sm mt-2 hover: transition transform hover:scale-110 duration-300 ease-in-out px-3 py-1 rounded-md text-md text-semibold"
                >
                    {isExpanded ? '↑ 閉じる' : '… 続きを読む'}
                </button>
                )}
              </>

            {footer && <div className="text-sm text-bold text-blue-900 border-t pt-4">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
