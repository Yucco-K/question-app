

import CategorySearchWithSelect from '../../../components/ui/CategorySearchWithSelect';

export default function CategorySearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">カテゴリ検索</h1>
      <CategorySearchWithSelect />
    </div>
  );
}
