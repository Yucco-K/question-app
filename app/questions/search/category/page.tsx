'use client';

export const fetchCache = 'force-no-store';

import CategorySearchWithSelect from '../../../components/ui/CategorySearchWithSelect';
import ScrollToBottomButton from '../../../components/ui/ScrollToBottomButton';

export default function CategorySearchPage() {
  return (
    <>
      <div className="container flex flex-col w-full mx-auto mt-16">
          <h1 className="text-xl text-center">カテゴリ検索</h1>
          <CategorySearchWithSelect />
          <ScrollToBottomButton isModalOpen={false} />
        </div>
    </>
  );
}
