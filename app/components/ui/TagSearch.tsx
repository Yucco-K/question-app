import { useEffect, useState } from 'react';

export default function TagSearch({ onTagsSelected }: { onTagsSelected: (tags: string[]) => void }) {
  const [tags, setTags] = useState<string[]>([]);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) throw new Error('タグの取得に失敗しました');
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error('タグ取得エラー:', error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTags(tags);
    } else {
      const filtered = tags.filter((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [searchTerm, tags]);


  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      onTagsSelected(newTags);
      setSearchTerm('');
    }
  };

  const handleTagRemove = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    onTagsSelected(newTags);
  };

  return (
    <div>
      <h3 className="font-bold mb-2">タグ</h3>

      <input
        type="text"
        placeholder="追加するタグを検索できます"
        className="w-full border rounded-md p-2 mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex flex-wrap mb-4">
        {selectedTags.map((tag, index) => (
          <div
            key={index}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center mr-2 mb-2"
          >
            <span>{tag}</span>
            <button
              onClick={() => handleTagRemove(tag)}
              className="ml-2 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap">
        {filteredTags.map((tag, index) => (
          <button
            key={index}
            className={`bg-blue-500 text-white text-sm px-4 py-1 rounded-full mr-2 mb-2 ${selectedTags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !selectedTags.includes(tag) && handleTagClick(tag)}
            disabled={selectedTags.includes(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
