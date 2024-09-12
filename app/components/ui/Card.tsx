// ui/Card.tsx
'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

interface CardProps {
  title: string;
  children: ReactNode;
  imageUrl?: string;  // オプションで画像を追加
  footer?: ReactNode; // フッターをカスタマイズ可能
}

export default function Card({ title, children, imageUrl, footer }: CardProps) {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      {/* {imageUrl && (
        <Image className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      )} */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="text-gray-700 mb-4">{children}</div>
        {footer && <div className="border-t pt-4">{footer}</div>}
      </div>
    </div>
  );
}
