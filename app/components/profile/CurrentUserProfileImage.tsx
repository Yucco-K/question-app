
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Notification from '../ui/Notification';
import { useLoading } from '../../context/LoadingContext';
import useAuth from '@/app/lib/useAuth';

export default function CurrentUserProfileImage() {
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const username = (session?.user as { name?: string })?.name ?? null;
  const displayName = username || 'ゲスト';
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const profileImage = (session?.user as { image?: string })?.image ?? null;
  const [showNotification, setShowNotification] = useState(false);

  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('ユーザー情報の取得に成功しました');
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading]);

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="hover:scale-150 transition-transform duration-300 cursor-pointer">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={`${displayName}のプロフィール画像`}
            className="rounded-sm object-cover m-1"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-10 h-10 border bg-white border-gray-300 rounded-sm flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-500" size="lg" />
          </div>
        )}
      </div>
    </>
  );
}
