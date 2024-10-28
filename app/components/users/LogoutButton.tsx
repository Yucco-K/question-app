'use client';

import { useRouter } from 'next/navigation';
import { useState, FC } from 'react';
import { toast } from 'react-toastify';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton: FC<LogoutButtonProps> = ({ className }) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleLogout = async () => {

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
        console.log(errorData.message || 'ログアウトに失敗しました。');
        toast.error('ログアウトに失敗しました。', {
          position: "top-center",
          autoClose: 2000,
        });

      } else {

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
        const projectId = new URL(supabaseUrl).hostname.split('.')[0]; // プロジェクトIDを取得

        const accessTokenKey = `sb-${projectId}-auth-token`;
        const refreshTokenKey = `sb-${projectId}-refresh-token`;

        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(refreshTokenKey);
        sessionStorage.removeItem(accessTokenKey);
        sessionStorage.removeItem(refreshTokenKey);

        toast.success('ログアウトしました。', {
          position: "top-center",
          autoClose: 2000,
        });

        setTimeout(() => {
          window.location.reload();

          if (isMobile()) {
            router.push('/questions/public/mobile');
          } else {
            router.push('/questions/public');
          }
        }, 1000);
      }

    } catch (err) {
      console.log('予期しないエラーが発生しました。');
      toast.error('予期しないエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
    }finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <button
        onClick={handleLogout}
        className={className || "block w-full text-center py-2 px-4 text-gray-700 hover:bg-gray-100"}
      >
        ログアウト
      </button>
    </div>
  );
}
export default LogoutButton;
