'use client';

export const fetchCache = 'force-no-store';

import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryProps {
  onCategorySelect: (categoryId: string) => void;
  onSelect: (category: string) => void;
  initialCategoryId?: string | null;

}
  const Category: React.FC<CategoryProps> = ({ onSelect, initialCategoryId, ...props }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null | undefined>(initialCategoryId || null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {

    async function fetchCategories() {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      } else {
        console.error('カテゴリの取得に失敗しました');
      }
    }

    fetchCategories();
  }, []);


  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onSelect(categoryId);
    setIsOpen(false);
  };

  return (
    <div className="relative category-dropdown w-64 max-w-[1400px] mx-auto">
      <label htmlFor="category" className="block text-lg text-gray-600 font-semibold my-8 flex flex-start">
        カテゴリを選択
        <span className="text-sm text-gray-600">   ※ 必須 </span>
      </label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 px-3 py-2 text-md focus:outline-none focus:border-blue-600"
        >
        {selectedCategory
          ? categories.find((category) => category.id === selectedCategory)?.name || 'カテゴリを選択'
          : 'カテゴリを選択'}
        <span className="absolute inset-y-0 top-10 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className={`h-5 w-5 text-gray-500 transform ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
          {categories.map((category) => (
            <li
              key={category.id}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white ${
                selectedCategory === category.id ? 'text-white bg-indigo-500' : 'text-gray-900'
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
              {selectedCategory === category.id && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                  ✓
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .category-dropdown button {
          transition: border-color 0.3s ease;
        }
        .category-dropdown button:hover {
          border-color: #a0aec0;
        }
        .category-dropdown ul {
          animation: dropdown 0.2s ease-out;
        }
        @keyframes dropdown {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
export default Category;
