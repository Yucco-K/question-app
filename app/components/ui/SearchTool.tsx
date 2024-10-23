import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TagSearch from '@/app/components/ui/TagSearch';
import { FaSearch, FaTags } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

interface SearchToolProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  setLoginPromptOpen: (open: boolean) => void;
  setSelectedTags: (tags: string[]) => void;
  isPublicScreen: boolean;
  handleFilteredQuestions: () => void;
  handleSearchCategory: () => void;
  handleSortQuestions: () => void;
}

export default function SearchTool({
  isSearchOpen,
  setIsSearchOpen,
  setLoginPromptOpen,
  setSelectedTags,
  isPublicScreen,
  handleSortQuestions,
  handleFilteredQuestions,
  handleSearchCategory,
}: SearchToolProps) {
  const [startY, setStartY] = useState<number | null>(null);
  const router = useRouter();

  const animationClass = isSearchOpen ? 'translate-y-0' : 'translate-y-full';

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY && e.touches[0].clientY - startY > 50) {
      setIsSearchOpen(false);
    }
  };

  const handleTouchEnd = () => {
    setStartY(null);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 bg-neutral-100 opacity-90 rounded-t-3xl z-5000 transition-transform duration-300 ease-in-out ${animationClass} md:hidden`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2"></div>

        <button
          className="absolute top-4 right-4 text-gray-700"
          onClick={() => setIsSearchOpen(false)}
          title="Close"
        >
          <AiOutlineClose size={24} />
        </button>

      {/* <h2 className="text-xl p-4 text-center">検索ツール</h2> */}

      <div className="flex flex-col items-center space-y-6 px-4 mt-4">

        <div className="flex justify-center px-4 mt-4">
          <div className="w-full max-w-lg">
            <TagSearch onTagsSelected={setSelectedTags} />
          </div>
        </div>

        <div className="flex justify-between gap-4 px-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isPublicScreen) {
                console.log('isPublicScreen', isPublicScreen);
                setIsSearchOpen(false);
                setLoginPromptOpen(true);
              } else {
                console.log('isNotPublicScreen');
                router.push('/questions/search/sort');
              }
            }}
            className="flex-1 text-gray-700 border border-gray-500 bg-gray-200 rounded-md p-3 hover:scale-105 transition-transform duration-300 ease-in-out text-center whitespace-nowrap"
          >
          <span className='flex items-center'>
            <FaSearch size={20} className='text-gray-400 text-xs mr-2' />
            ソート
          </span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              if (isPublicScreen) {
                setIsSearchOpen(false);
                setLoginPromptOpen(true);
              } else {
                router.push('/questions/search/filter');
              }
            }}
            className="flex-1 text-gray-700 border border-gray-500 bg-gray-200 rounded-md p-3 hover:scale-105 transition-transform duration-300 ease-in-out text-center whitespace-nowrap"
          >
          <span className='flex items-center'>
            <FaSearch size={20} className='text-gray-400 text-xs mr-2' />
            フィルタ
          </span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            if (isPublicScreen) {
              setIsSearchOpen(false);
              setLoginPromptOpen(true);
            } else {
              router.push('/questions/search/category');
            }
          }}
            className="flex-1 text-gray-700 border border-gray-500 bg-gray-200 rounded-md p-3 hover:scale-105 transition-transform duration-300 ease-in-out text-center whitespace-nowrap"
        >
            <span className='flex items-center'>
              <FaSearch size={20} className='text-gray-400 text-xs mr-2'/>
              カテゴリ
          </span>
        </button>
        </div>
      </div>
    </div>
  );
}
