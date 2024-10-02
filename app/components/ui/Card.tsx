'use client';

import { ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

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
}

export default function Card({
  title,
  categoryId,
  category,
  children,
  imageUrl,
  footer,
  className = '',
  onEdit,
  onDelete,
  onClick,
}: CardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isMenuOpen) {
      timer = setTimeout(() => {
        setIsMenuOpen(false);
      }, 3000); // 5秒後にメニューを閉じる
    }

    // クリーンアップでタイマーをクリア
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

    if (categoryId && !category) {  // 直接カテゴリ名が指定されていない場合のみAPIから取得
      fetchCategoryName();
    }
  }, [categoryId, category]);

  return (
    <div className="relative border rounded-lg shadow-md overflow-hidden bg-white max-w-[1400px]">
      <div className="p-10">
        <div className={`card-base-styles ${className}`}>

          <div className="absolute top-4 right-4 flex items-center space-x-10">
            <span className="text-gray-600 font-semibold">
              {categoryName || 'カテゴリなし'}
            </span>

            <button
              onClick={toggleMenu}
              onMouseEnter={() => setIsMenuOpen(true)}
              // onMouseLeave={() => setIsMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
              title="More Options"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-10 bg-white border shadow-md rounded-md">
                <ul className="flex flex-col space-y-2 p-2">
                  {onEdit && (
                    <li>
                      <button
                        onClick={onEdit}
                        className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer flex items-center space-x-2 p-2"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </li>
                  )}
                  {onDelete && (
                    <li>
                      <button
                        onClick={onDelete}
                        className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer flex items-center space-x-2 p-2"
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

          <h3 className="text-2xl font-bold mb-4">{title}</h3>

          <div className="text-xl text-gray-700 mb-4">{children}</div>

          {footer && <div className="text-lg border-t pt-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
