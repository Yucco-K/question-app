'use client';

import { useState, useEffect } from 'react';
import Notification from '../ui/Notification';
import useAuth from '@/app/lib/useAuth';
import { useLoading } from '@/app/context/LoadingContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';


interface CurrentUserProfileImageProps {
  size?: number;
}

export default function CurrentUserProfileImage({ size = 40 }: CurrentUserProfileImageProps) {
  const { session, loading: userLoading } = useAuth();
  const { setLoading } = useLoading();
  const userId: string | null = (session?.user as { id?: string })?.id ?? null;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const displayUsername = username || 'ゲスト';
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (userId) {
        try {
          setError(null);
          setSuccess(null);
          setShowNotification(false);
          setLoading(true);

          const response = await fetch(`/api/users/${userId}/profile`);
          if (response.ok) {
            const data = await response.json();
            if (data) {
              setProfileImage(data.profileImage);
              setUsername(data.username);
              setSuccess("プロフィール画像が正常に取得されました。");
              // setShowNotification(true);
            
            } else {
              setError("プロフィール画像を取得できませんでした。");
              setShowNotification(true);
            }
          } else {
            const errorData = await response.json();
            setError(errorData.message || "プロファイルデータの取得に失敗しました。");
            setShowNotification(true);
          }
        } catch (error) {
          console.error("Error fetching email:", error);
          setError("エラーが発生しました。再度お試しください。");
          setShowNotification(true);
        }finally{
          setLoading(false);

        }
      }
    };

    fetchProfileData();
  }, [userId, profileImage]);

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={`${displayUsername}のプロフィール画像`}
            className="rounded-sm object-cover m-1"
            width={size}
            height={size}
          />
        ) : (
          <div
            className="border bg-white border-gray-300 rounded-sm flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <FontAwesomeIcon icon={faUser} className="text-gray-500" size="lg" />
          </div>
        )}
      </div>
    </>
  );
}
