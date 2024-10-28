'use client';

import CategorySearchWithSelect from '../../../components/ui/CategorySearchWithSelect';
import ScrollToBottomButton from '../../../components/ui/ScrollToBottomButton';

export default function CategorySearchPage() {
  return (
    <>
      <div className="container max-w-[1200px] mt-16">
          <h1 className="text-xl text-center">カテゴリ検索</h1>
          <CategorySearchWithSelect />
          <ScrollToBottomButton isModalOpen={false} />
        </div>
    </>
  );
}
