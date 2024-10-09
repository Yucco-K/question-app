'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Notification from '../ui/Notification';

export default function LogoutButton() {
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setError(null);
    try {
      setLoading(true);
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

        // setTimeout(() => {
        //   router.push('/users/login');
        // }, 3000);
        // localStorage.removeItem('sb-access-token');
        // localStorage.removeItem('sb-refresh-token');
        // Supabase URLからプロジェクトIDを取得
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
        const projectId = new URL(supabaseUrl).hostname.split('.')[0]; // プロジェクトIDを取得

        // ローカルストレージとセッションストレージからトークンを削除
        const accessTokenKey = `sb-${projectId}-auth-token`;
        const refreshTokenKey = `sb-${projectId}-refresh-token`;
        // localStorage.removeItem('sb-guybpovnywktuxzvnran-auth-token');
        // sessionStorage.removeItem('sb-access-token');
        // sessionStorage.removeItem('sb-refresh-token');

        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(refreshTokenKey);
        sessionStorage.removeItem(accessTokenKey);
        sessionStorage.removeItem(refreshTokenKey);

        setSuccess('ログアウトしました。');
        setShowNotification(true);

        setTimeout(() => {
          window.location.reload();
        }, 3100);
      }
    } catch (err) {
      setError('予期しないエラーが発生しました。');
      setShowNotification(true);
    }finally {
      setLoading(false);
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
        className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100"
      >
        ログアウト
      </button>
    </div>
  );
}
