// components/Notification.tsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Notification({ message, type = 'info', onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-12 left-1/2 transform -translate-x-1/2 z-2000 p-4 rounded-lg shadow-lg flex items-center ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red-400 text-white'}`}>
      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white">
        &times;
      </button>
    </div>
  );
}
