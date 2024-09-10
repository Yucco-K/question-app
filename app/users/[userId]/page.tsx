'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function UserDetail() {
  const pathname = usePathname();
  const userId = pathname.split('/').pop();
  const [user, setUser] = useState({ name: '', email: '', username: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/users/${userId}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'ユーザーが見つかりませんでした');
          }

          setUser(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }else {
      setError('ユーザーIDが無効です');
      setLoading(false);
    }
  }, [userId]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div>
      {user ? (
        <>
          <h1>{user.name}さんのプロフィール</h1>
          <p>メールアドレス: {user.email}</p>
          <p>ユーザー名: {user.username}</p>
        </>
      ) : (
        <p>ユーザーが見つかりませんでした。</p>
      )}
    </div>
  );
}
