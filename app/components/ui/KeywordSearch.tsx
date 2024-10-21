import { useEffect, useState } from "react";

interface KeywordSearchProps {
  data: any[] | undefined;
  onSearchResults: (filteredData: any[]) => void;
  placeholderText?: string;
}

const KeywordSearch: React.FC<KeywordSearchProps> = ({ data = [],  onSearchResults, placeholderText = "キーワードを入力してください" }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (data) {
      const searchWords = searchQuery
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .map((word) => word.normalize('NFKC'));

        const filteredData = data.filter((item) => {
        const normalizedTitle = (item.title ?? "").normalize('NFKC').toLowerCase();
        const normalizedDescription = (item.description ?? "").normalize('NFKC').toLowerCase();
        const normalizedId = (item.id ?? "").normalize('NFKC').toLowerCase();
        const normalizedUsername = (item.username ?? "").normalize('NFKC').toLowerCase();
        const normalizedCategory = (item.category ?? "").normalize('NFKC').toLowerCase();
        const dateFormatted = new Date(item.created_at).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return searchWords.every((word) => {
          const regex = new RegExp(word, 'i');

          return (
            regex.test(normalizedTitle) ||
            regex.test(normalizedDescription) ||
            regex.test(normalizedId) ||
            regex.test(normalizedUsername) ||
            regex.test(normalizedCategory) ||
            regex.test(dateFormatted)
          );
        });
      });

      onSearchResults(filteredData);
    }
  }, [searchQuery, data]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-3">
      <input
        type="text"
        className="w-full p-3 text-md rounded-md border-2 border-solid border-gray-200"
        placeholder={placeholderText}
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default KeywordSearch;
