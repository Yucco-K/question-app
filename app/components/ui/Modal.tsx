'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* モーダルコンテンツ */}
      <div className="bg-white shadow-lg z-50 p-8 mx-auto relative" style={{ width: '80%', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* タイトル */}
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

        {/* コンテンツ（子要素） */}
        <div>{children}</div>
      </div>
    </div>
  );
}
