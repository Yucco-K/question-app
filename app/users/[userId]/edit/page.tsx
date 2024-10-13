// app/users/[userId]/edit/page.tsx
'use client';

import EditUserProfile from '@/app/components/profile/EditUserProfile';

export default function EditUserProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = params;

  return (
    <div>
      <EditUserProfile userId={userId} />
    </div>
  );
}
