import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import Notification from './Notification';

interface VoteProps {
  answerId: string;
  userId: string;
  answerUserId: string;
}

export default function Vote({ answerId, userId, answerUserId }: VoteProps) {
  const [voteType, setVoteType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState<number>(0);
  const [downvoteCount, setDownvoteCount] = useState<number>(0);

  useEffect(() => {

    const fetchVoteStatus = async () => {
      try {
        const response = await fetch(`/api/votes?answerId=${answerId}&userId=${userId}`);
        const data = await response.json();
        if (response.ok && data.vote) {
          setVoteType(data.vote.type);
          setUpvoteCount(data.vote.upvoteCount || 0);
          setDownvoteCount(data.vote.downvoteCount || 0);
        }else{
          setVoteType(null);
          setUpvoteCount(0);
          setDownvoteCount(0);
        }
      } catch (error) {
        setError('評価の取得に失敗しました');
        setShowNotification(true);
      }
    };

    fetchVoteStatus();
  }, [answerId, userId]);


  const handleVote = async (type: 'up' | 'down') => {
    if (isLoading || userId === answerUserId) return;

    setIsLoading(true);
    setError(null);

    try {

      const existingVoteResponse = await fetch(`/api/votes?answerId=${answerId}&userId=${userId}`);
      const existingVoteData = await existingVoteResponse.json();

      if (existingVoteResponse.ok && existingVoteData.vote) {

        if (existingVoteData.vote.type === type) {
          const deleteResponse = await fetch(`/api/votes/${existingVoteData.vote.id}`, {
            method: 'DELETE',
          });
          const deleteResult = await deleteResponse.json();

          if (deleteResponse.ok) {
            setVoteType(null);
            if (type === 'up') setUpvoteCount((prevCount) => Math.max(prevCount - 1, 0));
            if (type === 'down') setDownvoteCount((prevCount) => Math.max(prevCount - 1, 0));
          } else {
            setError(deleteResult.message || '評価の削除に失敗しました');
            setShowNotification(true);
          }
        } else {

          const updateResponse = await fetch(`/api/votes/${existingVoteData.vote.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type }),
          });
          const updateResult = await updateResponse.json();

          if (updateResponse.ok) {
            setVoteType(type);
            if (type === 'up') {
              setUpvoteCount((prevCount) => prevCount + 1);
              setDownvoteCount((prevCount) => Math.max(prevCount - 1, 0));

            } else {
              setDownvoteCount((prevCount) => prevCount + 1);
              setUpvoteCount((prevCount) => Math.max(prevCount - 1, 0));
            }
          } else {
            setError(updateResult.message || '評価の更新に失敗しました');
            setShowNotification(true);
          }
        }
      } else {

        const postResponse = await fetch('/api/votes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answer_id: answerId, user_id: userId, type, answer_user_id: answerUserId }),
        });
        const postResult = await postResponse.json();

        if (postResponse.ok) {
          setVoteType(type);
          if (type === 'up') {
            setUpvoteCount((prevCount) => prevCount + 1);

          } else {
            setDownvoteCount((prevCount) => prevCount + 1);
          }
        } else {
          setError(postResult.message || '評価の送信に失敗しました');
          setShowNotification(true);
        }
      }

      fetchVoteStatus();

    } catch (error) {
      setError('評価の送信中にエラーが発生しました');
      setShowNotification(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVoteStatus = async () => {
    try {

      const countResponse = await fetch(`/api/countVotes?answerId=${answerId}`);
      const countData = await countResponse.json();

      if (countResponse.ok && countData) {
        setUpvoteCount(countData.upvoteCount || 0);
        setDownvoteCount(countData.downvoteCount || 0);
      }
    } catch (error) {
      setError('評価の取得に失敗しました');
    }
  };

  useEffect(() => {
    fetchVoteStatus();
  }, [answerId]);


  return (
    <>
      {(error !== null || success !== null) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 text-sm">
          <button
            onClick={() => handleVote('up')}
            className={`px-4 rounded whitespace-nowrap transition-all duration-300 ease-in-out transform ${
              voteType === 'up'
              ? 'text-red-600 scale-125'
              : upvoteCount >= 1
              ? 'text-orange-600'
              : 'text-gray-400'
              } hover:bg-gray-100`}
            disabled={isLoading || userId === answerUserId}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="mr-1" /> いいね:
          </button>
          <span className="font-semibold">{upvoteCount}</span>
        </div>

        <div className="flex items-center space-x-1 text-sm  whitespace-nowrap">
          <button
            onClick={() => handleVote('down')}
            className={`px-4 py-2 rounded ${
              voteType === 'down'
              ? 'text-gray-800 scale-125'
              : 'text-gray-400'
            } hover:bg-gray-100`}
            disabled={isLoading || userId === answerUserId}
          >
            <FontAwesomeIcon icon={faThumbsDown} className="mr-1" /> 低評価:
          </button>
          <span className="font-semibold">{downvoteCount}</span>
        </div>
      </div>
    </>
  );
}
