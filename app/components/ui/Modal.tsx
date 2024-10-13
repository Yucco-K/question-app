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

      <div className="fixed inset-0 bg-black opacity-90" onClick={onClose}></div>

      <div className="modal relative">

        <button
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-3xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl text-blue-900 mt-20 mb-20 text-center">{title}</h2>

        <div>{children}</div>
      </div>
    </div>
  );
}
