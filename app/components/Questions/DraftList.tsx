// components/ui/DraftList.tsx
'use client';

import { useState } from 'react';

interface DraftItem {
  title: string;
  content: string;
  tags: string[];
}

const drafts: DraftItem[] = [
  {
    title: 'ここにタイトルが入ります。',
    content: 'ここに本文が入ります。',
    tags: ['タグ1', 'タグ2', 'タグ3'],
  },
  // 他の下書きも追加できます
];

export default function DraftList() {
  const [selectedDraft, setSelectedDraft] = useState<DraftItem | null>(null);

  const handleSelectDraft = (draft: DraftItem) => {
    setSelectedDraft(draft);
  };

  return (
    <div className="space-y-4">
      {drafts.map((draft, index) => (
        <div
          key={index}
          className="border p-4 rounded cursor-pointer"
          onClick={() => handleSelectDraft(draft)}
        >
          <h3 className="text-lg font-bold">タイトル: {draft.title}</h3>
          <p className="text-sm">本文: {draft.content}</p>
          <p className="text-xs text-gray-500">タグ: {draft.tags.join(', ')}</p>
        </div>
      ))}

      {selectedDraft && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-bold">選択された下書き</h3>
          <p>タイトル: {selectedDraft.title}</p>
          <p>本文: {selectedDraft.content}</p>
          <p>タグ: {selectedDraft.tags.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
