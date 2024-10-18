'use client';

import { useUser } from '../../context/UserContext';

export default function UserEmailDisplay() {
  const { email } = useUser();

  const displayEmail = email || '未登録';

  return (
    <div>
      <p>メール: {displayEmail}</p>
    </div>
  );
}
