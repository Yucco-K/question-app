'use client';

import CategorySearchWithSelect from '../../../components/ui/CategorySearchWithSelect';
import ScrollToBottomButton from '../../../components/ui/ScrollToBottomButton';

export default function CategorySearchPage() {
  return (
    <>
      <div className="flex container mx-auto w-[1200px]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-xl text-center mb-4">カテゴリ検索</h1>
          <CategorySearchWithSelect />
          <ScrollToBottomButton isModalOpen={false} />
        </div>
      </div>
    </>
  );
}
