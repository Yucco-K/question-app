'use client';

import { useEffect, useState } from 'react';
import Notification from '../../components/ui/Notification';
import { useRouter } from 'next/navigation';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface UserData {
  profileImage?: string;
  email?: string;
  username?: string;
}

interface UserProfilePageProps {
  params: {
    userId: string;
  };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = params;
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) throw new Error('ユーザー情報の取得に失敗しました');
        const data = await response.json();
        setUserData(data);
        setProfileImage(data.publicUrl);
        console.log('UserData data:', data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleEditClick = () => {
    router.push(`/users/${userId}/edit`);
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <>
    {showNotification && (error || success) && (
      <Notification
        message={error ?? success ?? ""}
        type={error ? "error" : "success"}
        onClose={() => setShowNotification(false)}
      />
    )}
    <div className="p-8 bg-white rounded-md shadow-md mx-auto w-full lg:w-2/3 mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-500">プロフィール</h2>
        <button
          className="border border-sky-700 font-bold text-blue-900 px-4 py-2 rounded-sm"
          onClick={handleEditClick}
        >
          編集
        </button>
      </div>

      <div className="border-t border-gray-300 text-md pt-6">
        <div className="flex items-center mb-6 gap-10">
          <label className="w-32 font-bold text-blue-900 whitespace-nowrap text-md">プロフィール画像</label>

          {userData?.profileImage ? (
            <img
              src={userData.profileImage}
              alt="Profile"
              className="w-16 h-16"
            />
          ) : (
            <div className="flex items-center justify-center w-16 h-16 border border-gray-300 round-sm">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" size="2x" />
            </div>
          )}

        </div>

        <div className="flex items-center mb-6 gap-10">
          <label className="w-32 font-bold text-blue-900 whitespace-nowrap text-sm">メールアドレス</label>
          <p className='text-blue-900 text-md'>{userData?.email || 'メールアドレスが登録されていません'}</p>
        </div>

        <div className="flex items-center mb-6 gap-10">
          <label className="w-32 font-bold text-blue-900 text-sm">名前</label>
          <p className='text-blue-900 text-md'>{userData?.username || '名前が登録されていません'}</p>
        </div>
      </div>
    </div>
    </>
  );
}
