import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface KeywordSearchProps {
  data: any[] | undefined;
  onSearchResults: (filteredData: any[]) => void;
  placeholderText?: string;
}

const KeywordSearch: React.FC<KeywordSearchProps> = ({ data = [], onSearchResults, placeholderText = "キーワードを入力してください" }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (data) {
        const searchWords = searchQuery
          .toLowerCase()
          .trim()
          .split(/\s+/)
          .map((word) => word.normalize("NFKC"));

        const updatedFilteredData = await Promise.all(data.map(async (item) => {
          const normalizedTitle = (item.title ?? "").normalize("NFKC").toLowerCase();
          const normalizedDescription = (item.description ?? "").normalize("NFKC").toLowerCase();
          const normalizedId = (item.id ?? "").normalize("NFKC").toLowerCase();
          const normalizedCategory = (item.category ?? "").normalize("NFKC").toLowerCase();
          const dateFormatted = new Date(item.created_at).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          let normalizedUsername = "";

          if (item.user_id) {
            try {
              const response = await fetch(`/api/users/${item.user_id}/profile`);
              if (response.ok) {
                const userData = await response.json();
                normalizedUsername = (userData.username ?? "").normalize("NFKC").toLowerCase();
              }
            } catch (error) {
              console.error("Error fetching username:", error);
            }
          }

          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const itemDate = new Date(item.created_at);

          const matches = searchWords.every((word) => {
            const regex = new RegExp(word, "i");
            return (
              (word === "new" && itemDate >= oneWeekAgo) ||
              (word === "解決済み" && item.is_resolved === true) ||
              regex.test(normalizedTitle) ||
              regex.test(normalizedDescription) ||
              regex.test(normalizedId) ||
              regex.test(normalizedUsername) ||
              regex.test(normalizedCategory) ||
              regex.test(dateFormatted)
            );
          });

          return matches ? item : null;
        }));

        // フィルタリング結果を設定し、`null`を除外
        const filteredResults = updatedFilteredData.filter((item) => item !== null);
        onSearchResults(filteredResults);
      }
    };

    fetchFilteredData();
  }, [searchQuery, data]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative flex items-center max-w-[1200px]  mb-4">
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
