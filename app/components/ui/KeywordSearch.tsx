import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div className="relative flex items-center w-full mb-4">
      <input
        type="text"
        className="w-full p-2 text-md rounded-md border-2 border-solid border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
        placeholder={placeholderText}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute right-4 text-gray-300"
      />
    </div>
  );
};

export default KeywordSearch;
