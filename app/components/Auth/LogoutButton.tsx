'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Notification from '../Layout/Notification';

export default function LogoutButton() {
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    setError(null);
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'ログアウトに失敗しました。');
        setShowNotification(true);
      } else {
        setSuccess('ログアウトしました。');
        setShowNotification(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
        setTimeout(() => {
          window.location.reload();
        }, 3100);
      }
    } catch (err) {
      setError('予期しないエラーが発生しました。');
      setShowNotification(true);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <button
        onClick={handleLogout}
        className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        ログアウト
      </button>
    </div>
  );
}
