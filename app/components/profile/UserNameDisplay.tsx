'use client';

import React, { useEffect, useState } from 'react';
import Notification from '../ui/Notification';
import { useLoading } from '../../context/LoadingContext';
import { set } from 'lodash';

interface UserNameDisplayProps {
  userId: string;
}

const UserNameDisplay: React.FC<UserNameDisplayProps> = ({ userId }) => {
  const [username, setUsername] = useState<string>('ゲスト');
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {

    if (!userId && !isLoading) {
      console.log('ユーザーIDが無効です');
      return;
    }

    const fetchUsername = async () => {
      try {

        setError(null);
        setShowNotification(false);
        setLoading(true);

        const response = await fetch(`/api/users/${userId}/profile`);
        const data = await response.json();

        if (response.ok) {
          setUsername(data.username || 'ゲスト');
        } else {
          setError(data.message || 'ユーザー名の取得に失敗しました');
          setShowNotification(true);
        }
      } catch (err) {
        setError('ユーザー名の取得中にエラーが発生しました');
        setShowNotification(true);
      }finally{
        setLoading(false);
      }
    };

    fetchUsername();
  }, [userId]);

  return (
    <>
      {showNotification && error && (
        <Notification
          message={error}
          type="error"
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className='text-blue-900 text-sm mb-2'>
        {username}
      </div>
    </>
  );
};

export default UserNameDisplay;
