'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Notification from '../ui/Notification';

interface UserProfileImageProps {
  userId: string;
}

export default function UserProfileImage({ userId }: UserProfileImageProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('ゲスト');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/profile`);
        const data = await response.json();

        if (response.ok) {
          setProfileImage(data.profileImage || null);
          setUsername(data.username || 'ゲスト');
        } else {
          setError(data.message || 'ユーザー情報の取得に失敗しました');
        }
      } catch (err) {
        setError('ユーザー情報の取得中にエラーが発生しました');
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <>
      {showNotification && (error !== null || success !== null) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div>
        {profileImage ? (
          <Image
            src={profileImage}
            alt={`${username}のプロフィール画像`}
            className="rounded-sm object-cover m-1"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-10 h-10 border bg-white border-gray-300 rounded-sm flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-500" size="lg" />
          </div>
        )}
        {/* <p className="text-sm">{username}</p> */}
      </div>
    </>
  );
}
