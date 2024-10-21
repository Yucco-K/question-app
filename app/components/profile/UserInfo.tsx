'use client';

import UserIdDisplay from './UserIdDisplay';
import UserNameDisplay from './UserNameDisplay';
import UserEmailDisplay from './UserEmailDisplay';
import Spinner from '../ui/Spinner';
import Notification from '../ui/Notification';
import { useState } from 'react';
import useAuth from '@/app/lib/useAuth';

export default function UserInfo() {
  const [showNotification, setShowNotification] = useState(false);
  const { session, loading: userLoading, error } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;


  if (userLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {showNotification && error && (
        <Notification
          message={error ??  ""}
          type={error ? 'error' : undefined}
          onClose={() => setShowNotification(false)}
        />
      )}
      <h1>ユーザー情報</h1>
      <UserIdDisplay />
      <UserNameDisplay userId={''} />
      <UserEmailDisplay />
    </div>
  );
}
