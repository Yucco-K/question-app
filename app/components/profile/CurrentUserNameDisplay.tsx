
'use client';

import { useState } from 'react';
import Notification from '../ui/Notification';
import useAuth from '@/app/lib/useAuth';


export default function CurrentUserNameDisplay() {
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const username = (session?.user as { username?: string })?.username ?? null;
  const displayName = username || 'ゲスト';
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

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
        <p>{displayName} さん</p>
      </div>
    </>
  );
}