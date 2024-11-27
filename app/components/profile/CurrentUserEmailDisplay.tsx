'use client';

export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import Notification from '../ui/Notification';
import useAuth from '@/app/lib/useAuth';
import { useLoading } from '@/app/context/LoadingContext';

export default function CurrentUserEmailDisplay() {
  const { session, loading: userLoading } = useAuth();
  const { isLoading, setLoading } = useLoading();
  const userId: string | null = (session?.user as { id?: string })?.id ?? null;
  const [email, setEmail] = useState<string | null>(null);
  const displayEmail = email || '未登録';
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

          const response = await fetch(`/api/users/${userId}/profile`, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
            cache: 'no-store',
          });

          if (response.ok) {
            const data = await response.json();
            if (data.email) {
              setEmail(data.email);
              setSuccess("メールアドレスが正常に取得されました。");
            } else {
              setError("メールアドレスが取得できませんでした。");
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
  }, [userId, setLoading]);

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className='text-center'>
        <p>{displayEmail}</p>
      </div>
    </>
  );
}
