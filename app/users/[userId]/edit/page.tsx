'use client';

import EditUserProfile from '@/app/components/profile/EditUserProfile';

export default function EditUserProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = params;

  return (
    <div className='z-0'>
      <EditUserProfile userId={userId} />
    </div>
  );
}
