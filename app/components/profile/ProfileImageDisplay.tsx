'use client';

import { useUser } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function ProfileImageDisplay() {
  const { profileImage, username } = useUser() as { profileImage: string; username: string };
  const displayName = username || 'ゲスト';

  return (
    <div>
      {/* <p>{displayName} さんのプロフィール画像</p> */}
      {profileImage ? (
        <Image
          src={profileImage}
          alt={`${displayName}のプロフィール画像`}
          className="rounded-sm object-cover"
          width={20}
          height={20}
        />
      ) : (
        <div className="w-8 h-8 border bg-white border-gray-300 rounded-sm flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} className="text-gray-500" size="1x" />
        </div>
      )}
    </div>
  );
}
