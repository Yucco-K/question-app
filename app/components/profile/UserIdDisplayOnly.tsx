'use client';

import { useUser } from '../../context/UserContext';

export default function UserIdDisplay() {
  const { userId } = useUser();

  // userId が存在しない場合に "未登録" を表示
  const displayUserId = userId || '未登録';

  return (
    <div>
      <p>{displayUserId}</p>
    </div>
  );
}
