'use client';

import { useUser } from '../../context/UserContext';

export default function UserIdDisplay() {
  const { userId } = useUser();

  const displayUserId = userId || '未登録';

  return (
    <div>
      <p>{displayUserId}</p>
    </div>
  );
}
