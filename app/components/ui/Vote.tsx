'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';


interface VoteProps {
  answerId: string;
  userId: string;
  answerUserId: string;  // 回答者のID
}

export default function Vote({ answerId, userId, answerUserId }: VoteProps) {
  const [voteType, setVoteType] = useState<string | null>(null);  // 'up' または 'down'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upvoteCount, setUpvoteCount] = useState<number>(0);  // いいねのカウント
  const [downvoteCount, setDownvoteCount] = useState<number>(0);  // 反対のカウント

  useEffect(() => {
    // 初期状態でこのユーザーの評価状況を取得する
    const fetchVoteStatus = async () => {
      try {
        const response = await fetch(`/api/votes?answerId=${answerId}&userId=${userId}`);
        const data = await response.json();
        if (response.ok && data.vote) {
          setVoteType(data.vote.type);
          setUpvoteCount(data.vote.upvoteCount || 0);  // いいね数を取得
          setDownvoteCount(data.vote.downvoteCount || 0);  // 反対数を取得
        }
      } catch (error) {
        console.error('評価の取得に失敗しました', error);
        setError('評価の取得に失敗しました');
      }
    };

    fetchVoteStatus();
  }, [answerId, userId]);

  const handleVote = async (type: 'up' | 'down') => {
    if (isLoading || userId === answerUserId) return;  // 回答者本人は投票できない

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer_id: answerId,
          user_id: userId,
          type,  // 'up' か 'down'
          answer_user_id: answerUserId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVoteType(type);  // 投票タイプを設定
        if (type === 'up') {
          setUpvoteCount((prevCount) => prevCount + 1);  // いいねのカウントを増やす
        } else {
          setDownvoteCount((prevCount) => prevCount + 1);  // 反対のカウントを増やす
        }
      } else {
        setError(data.message || '評価の送信に失敗しました');
      }
    } catch (error) {
      setError('評価の送信中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-8 mt-12">
  {error && <p className="text-red-500">{error}</p>}

  {/* いいねボタンとカウント表示の間を狭く */}
  <div className="flex items-center space-x-1 text-xs">
    <button
      onClick={() => handleVote('up')}
      className={`px-4 py-2 rounded ${
        voteType === 'up' ? 'bg-yellow-300 text-black' : 'bg-white text-black'
      } hover:bg-gray-100`}
      disabled={isLoading || voteType === 'up' || userId === answerUserId}
    >
      <FontAwesomeIcon icon={faThumbsUp} className="mr-1" /> いいね
    </button>
    <span className="font-semibold">{upvoteCount}</span>
  </div>

  <div className="flex items-center space-x-1 text-xs">
    <button
      onClick={() => handleVote('down')}
      className={`px-4 py-2 rounded ${
        voteType === 'down' ? 'bg-gray-300 text-black' : 'bg-white text-black'
      } hover:bg-gray-100`}
      disabled={isLoading || voteType === 'down' || userId === answerUserId}
    >
      <FontAwesomeIcon icon={faThumbsDown} className="mr-1" /> 低評価
    </button>
    <span className="font-semibold">{downvoteCount}</span>
  </div>
</div>
  );
}
