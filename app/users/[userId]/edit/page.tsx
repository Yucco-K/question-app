// app/users/[userId]/edit/page.tsx
'use client';

import EditUserProfile from '@/app/components/profile/EditUserProfile';

export default function EditUserProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = params;

  return (
    <div>
      <h1>ユーザー情報編集</h1>
      <EditUserProfile userId={userId} />
    </div>
  );
}
