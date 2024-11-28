'use client';

export const fetchCache = 'force-no-store';

import { useState } from 'react';
import CategorySelect from './CategorySelect';
import CategorySearch from './CategorySearch';

export default function CategorySearchWithSelect() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div>
      <CategorySelect onSelect={handleCategorySelect} />

      {selectedCategoryId && <CategorySearch categoryId={selectedCategoryId} />}
    </div>
  );
}
