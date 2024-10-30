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

      <div className="fixed inset-0 bg-black opacity-70  sm:opacity-70 sm:block hidden" onClick={onClose}></div>

      <div
      className="
        relative bg-white
          w-full h-full p-8
          sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] 2xl:w-[75%]
          max-w-7xl lg:rounded-xl overflow-y-auto
    "
      >

        <button
          className="absolute top-16 mt-8 right-6 text-gray-500 hover:text-gray-700 text-2xl Z-200"
          onClick={onClose}
        >
          ×<span className='text-sm flex items-center hover:underline'>close</span>
        </button>

        <h2 className="text-xl text-blue-900 mt-20 mb-10 text-center">{title}</h2>

        <div>{children}</div>
      </div>
    </div>
  );
}
