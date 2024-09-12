'use client';

import { useState } from 'react';

export default function TagFilter() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const addTag = (tag: string) => {
    setSelectedTags([...selectedTags, tag]);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h3 className="font-bold mb-2">フィルター</h3>
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-semibold mb-2">ステータス</label>
        <select id="status" className="block w-full border rounded-md p-2">
          <option value="all">全て</option>
          <option value="open">オープン</option>
          <option value="closed">クローズ</option>
        </select>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">タグ</h4>
        <input
          type="text"
          placeholder="追加するタグを検索できます"
          className="w-full border rounded-md p-2"
          onKeyDown={(e) => e.key === 'Enter' && addTag(e.currentTarget.value)}
        />
        <div className="mt-2">
          {selectedTags.map((tag, index) => (
            <span key={index} className="bg-blue-500 text-white px-2 py-1 rounded-full inline-block mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
