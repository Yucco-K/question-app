'use client';

import { useUser } from '../../context/UserContext';

export default function UserEmailDisplay() {
  const { email } = useUser();

  // email が存在しない場合に "未登録" を表示
  const displayEmail = email || '未登録';

  return (
    <div>
      <p>メール: {displayEmail}</p>
    </div>
  );
}
