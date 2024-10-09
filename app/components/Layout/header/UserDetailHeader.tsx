import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/app/lib/useAuth';
import Notification from '@/app/components/ui/Notification';
import LogoutButton from '@/app/components/users/LogoutButton';
import UserNameDisplay from '@/app/components/profile/UserNameDisplayOnly';

export default function UserDetailHeader() {
  const { session, loading } = useAuth(false);
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');

  if (loading) {
    return <div>Loading...</div>;
  }


  if (!session && !showNotification) {
    setNotificationMessage('ログインが必要です。');
    setNotificationType('info');
    setShowNotification(true);
  }

  return (
    <header className="bg-blue-900 text-white py-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto">
        <h1 className="text-xl font-bold">Profile Page</h1>

        {showNotification && (
          <Notification
            message={notificationMessage}
            type={notificationType}
            onClose={() => setShowNotification(false)}
          />
        )}

        {session ? (
          <>
            <LogoutButton />
            <p>ようこそ、<UserNameDisplay /> さん</p>
          </>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => router.push('/users/login')}
          >
            ログイン
          </button>
        )}
      </div>
    </header>
  );
}
