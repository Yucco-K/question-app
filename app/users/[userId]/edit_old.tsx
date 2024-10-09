'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Params {
  userId: string;
}

export default function EditUserProfile({ params }: { params: Params }) {
  const { userId } = params;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) throw new Error('ユーザー情報の取得に失敗しました');
        const data = await response.json();
        setEmail(data.email);
        setName(data.name);
        setProfileImage(data.profileImage);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, profileImage }),
      });
      if (!response.ok) throw new Error('プロフィールの更新に失敗しました');
      router.push(`/users/${userId}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setError('ファイルが選択されていません');
      return;
    }

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setProfileImage(data.publicUrl);
    } catch (err) {
      setError('画像のアップロードに失敗しました');
    }
  };

  const handleCancel = () => {
    router.push(`/users/${userId}`);
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div className="p-8 bg-white rounded-md shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">プロフィール編集</h2>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={handleCancel}
        >
          戻る
        </button>
      </div>

      <div className="border-t border-gray-300 pt-6">
        <div className="flex items-center mb-6">
          <label className="w-32 font-bold text-gray-600">プロフィール画像</label>
          <div className="flex items-center">
            <img
              src={profileImage || "/profile-placeholder.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
            <input type="file" onChange={handleFileChange} title="プロフィール画像を選択" />
          </div>
        </div>

        <div className="flex items-center mb-6">
          <label className="w-32 font-bold text-gray-600">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2 rounded-md w-full"
            placeholder="メールアドレスを入力"
          />
        </div>

        <div className="flex items-center mb-6">
          <label className="w-32 font-bold text-gray-600">名前</label>
          <input
          title='名前を入力'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded-md w-full"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={handleCancel}
          >
            保存せず戻る
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
