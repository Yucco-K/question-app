import { useEffect, useState } from 'react';

interface TagInputProps {
  tagLabel: string;
  availableTags: string[];
  initialTags: string[];
  onTagsChange?: (newTags: string[]) => void;
}

export default function TagInput({
  tagLabel,
  availableTags,
  initialTags,
  onTagsChange,
}: TagInputProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [tags, setTags] = useState(initialTags || []);

  useEffect(() => {
    setTags(initialTags || []);
  }, [initialTags]);



  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);

      onTagsChange && onTagsChange(newTags);
    } else {
      const newTags = selectedTags.filter((t) => t !== tag);
      setSelectedTags(newTags);
      onTagsChange && onTagsChange(newTags);
    }
  };


  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      onTagsChange && onTagsChange(updatedTags);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto mb-15">
      <label className="block text-md font-semibold text-gray-700 m-6">
        {tagLabel}
      </label>
      <div className="flex flex-wrap gap-2">

        {availableTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(tag)}
            className={`px-5 py-1 m-2 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
