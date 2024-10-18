
'use client';

import { useUser } from '../../context/UserContext';
import { useState } from 'react';
import Notification from '../ui/Notification';

export default function CurrentUserNameDisplay() {
  const { username } = useUser() as { username: string };
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
      <div>
        <p>{displayName} さん</p>
      </div>
    </>
  );
}
