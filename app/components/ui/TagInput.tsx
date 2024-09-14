import React, { useState } from 'react';

interface TagInputProps {
  tagLabel: string;
  tagPlaceholder: string;
}

const TagInput: React.FC<TagInputProps> = ({ tagLabel, tagPlaceholder }) => {
  const [tags, setTags] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      e.currentTarget.value = ''; // 入力フィールドをクリア
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold">{tagLabel}</label>
      <textarea
        placeholder={tagPlaceholder}
        className="w-full border px-3 py-4 mb-6 text-lg"
        style={{ height: '400px', fontSize: '1.25rem' }} // 高さと文字サイズを設定
        rows={10} // 初期の高さ設定
        onKeyDown={handleKeyDown}
      ></textarea>
      {/* 入力されたタグを表示 */}
      <div className="mt-2">
        {tags.map((tag, index) => (
          <span key={index} className="tag bg-gray-200 px-2 py-1 rounded mr-2">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
