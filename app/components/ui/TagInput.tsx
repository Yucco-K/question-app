import { useEffect, useState } from 'react';
import Notification from '../ui/Notification';
import { on } from 'events';

interface TagInputProps {
  tagLabel: string;
  tagPlaceholder: string;
  suggestions: string[]; // オートコンプリート候補のリスト
  initialTags: string[];
  onTagsChange: (newTags: string[]) => void;
}

export default function TagInput({ tagLabel, tagPlaceholder, suggestions, initialTags, onTagsChange }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const validTagFormat = /^[ぁ-んァ-ン一-龯a-zA-Z0-9]+$/;

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && input.trim() !== '') {
      event.preventDefault();
      const formattedTag = input.trim();

      if (!validTagFormat.test(formattedTag)) {
        setError('タグには日本語または英数字のみ使用できます。');
        setShowNotification(true);
        return;
      }

      if (!tags.includes(formattedTag)) {
        setTags([...tags, formattedTag]);
        onTagsChange([...tags, formattedTag]);
      } else {
        setError('すでに追加されているタグです。');
        setShowNotification(true);
      }
      setInput('');
      setFilteredSuggestions([]);
    }
  };

  const handleTagChange = (newTags: string[]) => {
    setTags(newTags);
    onTagsChange(newTags);
  };


  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() !== '') {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {

    if (!tags.includes(suggestion)) {
      setTags([...tags, suggestion]);
    } else {
      setError('すでに追加されているタグです');
      setShowNotification(true);
    }
    setInput('');
    setFilteredSuggestions([]);
  };

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="max-w-[1400px] mx-auto mb-10">
        <label className="block text-xl font-semibold text-gray-700 my-6">{tagLabel} <span className="text-sm text-gray-600">   ※ 必須 : 1つ以上指定してください。</span></label>
        <div className="border border-gray-300 p-2">
          <ul className="flex flex-wrap">
            {tags.map((tag, index) => (
              <li key={index} className="bg-blue-600 text-white text-xl px-3 py-1 rounded-full mr-2 mb-2">
                {tag}
                <button onClick={() => removeTag(index)} className="ml-5 text-white text-xl" style={{ padding: '0', lineHeight: '1' }}>
                  <span className="inline-block align-middle" style={{ lineHeight: '1.2', marginTop: '0.1em' }}>
                    ×
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={input}
            placeholder={tagPlaceholder}
            onChange={handleInputChange}
            onKeyDown={addTag}
            className="border-none text-xl outline-none w-full py-2 my-2"
          />

          {/* オートコンプリート候補の表示 */}
          {filteredSuggestions.length > 0 && (
            <ul className="border bg-white my-2 max-h-40 overflow-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-2 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
