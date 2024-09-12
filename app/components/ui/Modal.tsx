// ui/Modal.tsx
'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  buttons?: ReactNode[]; // ボタンを複数受け取ることができるように
}

export default function Modal({ isOpen, onClose, title, children, buttons }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* モーダルコンテンツ */}
      <div className="bg-white rounded-lg shadow-lg z-50 p-6 max-w-lg mx-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        <div>{children}</div>

        {/* ボタンのセクション */}
        {buttons && (
          <div className="mt-4 flex justify-center space-x-4">
            {buttons.map((button, index) => (
              <div key={index}>{button}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
