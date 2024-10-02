'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '../../context/LoadingContext';

export default function MaintenanceBoard() {
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    // APIまたは状態によってメンテナンス情報を取得
    const fetchMaintenanceInfo = async () => {
      // 仮のメンテナンス情報
      const message = '現在、システムメンテナンス中です。終了予定時刻は16:00です。';
      setMaintenanceMessage(message);
    };

    fetchMaintenanceInfo();
  }, []);

  if (!maintenanceMessage) return null;

  return (

    <>
      <div className="bg-yellow-500 text-white p-4 rounded-lg mb-4">
        <h2 className="text-lg">メンテナンス情報:</h2>
        <p className="font-bold text-xl my-6">{maintenanceMessage}</p>
      </div>
      <div className="flex flex-grow justify-center items-center my-10">
        <h1 className="text-4xl font-bold text-center">Engineers Q&A Board</h1>
      </div>
      <div>
        <p className="text-lg flex flex-grow justify-center items-center text-gray-700"> ―  ご不便をおかけいたしますが、ご理解とご協力をお願いいたします  ―</p>
      </div>
    </>
  );
}
