'use client';

import { useEffect, useState } from 'react';
import UsersLayout from '../../components/Layout/main/UsersLayout';
import Notification from '../ui/Notification';
import { useLoading } from '../../context/LoadingContext';

export default function ChangePasswordForm() {
  const [email, setEmail] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSendDisabled, setIsSendDisabled] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const [isSendVisible, setIsSendVisible] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);
  const [resetUrl, setResetUrl] = useState('');
  const { isLoading, setLoading } = useLoading();


  useEffect(() => {
    // クライアントサイドで window.location.origin を使用して URL を生成
    const origin = window.location.origin;
    setResetUrl(`${origin}/users/set-new-password`);
  }, []);

  useEffect(() => {
    return () => {
      setAttemptCount(0);
    };
  }, []);

  const checkEmailExists = async (email: string): Promise<boolean> => {

    setError(null);
    setSuccess(null);
    setShowNotification(false);
    setIsSendDisabled(true);
    setLoading(true);

    try {
      const response = await fetch(`/api/users/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      return result.exists;

    } catch (err) {
      console.error('Email存在チェックエラー:', err);
      return false;

    }finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {

    setError(null);
    setSuccess(null);
    setIsSendDisabled(true);
    setShowNotification(false);
    setLoading(true);

    const emailExists = await checkEmailExists(email);
    if (!emailExists) {
      setError('入力されたメールアドレスは存在しません。');
      setShowNotification(true);
      setIsSendDisabled(false);
      return;
    }

    setTimeout(() => {
    setIsSendVisible(false);
    setIsResendVisible(true);
    }, 10000);


    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, redirectTo: resetUrl }),
      });

      const result = await response.json();

      if (!response.ok) {

        const errorText = await response.text(); // JSONではないかもしれないので、テキストとして取得
        console.log("Error response:", errorText);
        throw new Error(`サーバーエラー: ${response.status}`);
      }
      setSuccess('パスワードリセットリンクを送信しました。受信メールをご確認ください。');
      setShowNotification(true);
      setAttemptCount(0);

    } catch (err) {
      setError((err as Error).message);
      setShowNotification(true);
    }finally {
      setLoading(false);
    }
  };

  const handleResendClick = async () => {

    setError(null);
    setSuccess(null);
    setShowNotification(false);
    setLoading(true);

    if (attemptCount < 9) {
      setIsResendDisabled(true);
      setTimeout(() => {
        setIsResendDisabled(false);
      }, 10000);
      setAttemptCount(attemptCount + 1);


      try {
        const response = await fetch('/api/users/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, redirectTo: resetUrl }),
        });

        const result = await response.json();

          if (!response.ok) {

            const errorText = await response.text(); // JSONではないかもしれないので、テキストとして取得
            console.log("Error response:", errorText);
            throw new Error(`サーバーエラー: ${response.status}`);
          }
          setSuccess('パスワードリセットリンクを送信しました。受信メールをご確認ください。');
          setShowNotification(true);
          setAttemptCount(0);

        } catch (err) {
          setError((err as Error).message);
          setShowNotification(true);
        }finally {
          setLoading(false);
        }

    } else {
      setError('試行回数の上限を超えました。時間をおいてもう一度お試しください。');
      setShowNotification(true);
      setIsResendDisabled(true);

      setTimeout(() => {
        setError(null);
        setSuccess(null);
        setIsResendDisabled(false);
        setAttemptCount(0);
      }, 180000);
    }
  }

  return (
    <UsersLayout
      title="パスワードリセット"
      actionText="ログインに戻る"
      actionHref="/users/login"
      actionLinkText="こちらへ"
    >
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePasswordReset();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {isSendVisible && (
          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSendDisabled ? 'bg-indigo-300' : 'bg-indigo-600'}`}
            disabled={isSendDisabled}
          >
            パスワードリセットリンクを送信
          </button>
        )}
      </form>
      {isResendVisible && (
        <button
        onClick={handleResendClick}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isResendDisabled ? 'bg-green-300' : 'bg-green-600'}`}
        disabled={isResendDisabled}
      >
        リンクを再送信
        </button>
      )}
    </UsersLayout>
  );
}
