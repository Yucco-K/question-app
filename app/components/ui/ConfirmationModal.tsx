import React from 'react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex flex-col items-center justify-center" onClick={onCancel}>
      <div className="bg-white p-10 rounded shadow-md" onClick={(e) => e.stopPropagation()}>
        <p className="text-center mb-6">{message}</p>
        <div className="flex space-x-4 justify-center">
          <button
            className="py-2 px-6 mr-4 bg-red-400 text-white rounded"
            onClick={onConfirm}
          >
            確認
          </button>
          <button
            className="py-2 px-6 bg-gray-300 text-black rounded"
            onClick={onCancel}
          >
            キャンセル
          </button>
        </div>
        <p className="text-red-400 text-sm mt-4">※ この操作は元に戻せません。</p>
      </div>
    </div>
  );
}
