'use client';

import { useUser } from '../../context/UserContext';

export default function UserNameDisplay() {
  const { username } = useUser();

  // username が存在しない場合に "ゲスト" を表示
  const displayName = username || 'ゲスト';

  return (
    <div>
      <p>ユーザー名: {displayName}</p>
    </div>
  );
}
