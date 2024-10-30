'use client';

import { useEffect, useState } from 'react';
import UsersLayout from '../../components/Layout/main/UsersLayout';
import { useLoading } from '../../context/LoadingContext';
import { toast } from 'react-toastify';

export default function ChangePasswordForm() {
  const [email, setEmail] = useState('');
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

    setIsSendDisabled(true);
    setLoading(true);

    try {
      const response = await fetch(`/api/users/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, redirectTo: resetUrl }),
      });

      const result = await response.json();
      return result.exists;

    } catch (err) {
      console.error('Email存在チェックエラー:', err);
      toast.error('Email存在チェックエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
      return false;

    }finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {

    setIsSendDisabled(true);
    setLoading(true);

    const emailExists = await checkEmailExists(email);
    if (!emailExists) {
      console.error('入力されたメールアドレスは存在しません。');
      toast.error('入力されたメールアドレスは存在しません。', {
        position: "top-center",
        autoClose: 2000,
      });
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
      console.log('パスワードリセットリンクを送信しました。受信メールをご確認ください。');
      toast.success('パスワードリセットリンクを送信しました。受信メールをご確認ください。', {
        position: "top-center",
        autoClose: 2000,
      });
      setAttemptCount(0);

    } catch (err) {
      console.error((err as Error).message);
      toast.error((err as Error).message, {
        position: "top-center",
        autoClose: 2000,
      });

      resetForm();
    }finally {
      setLoading(false);
    }
  };

  const handleResendClick = async () => {

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
            console.error("Error response:", errorText);
            throw new Error(`サーバーエラー: ${response.status}`);
          }
          console.log('パスワードリセットリンクを送信しました。受信メールをご確認ください。');
          toast.success('パスワードリセットリンクを送信しました。受信メールをご確認ください。', {
            position: "top-center",
            autoClose: 2000,
          });
          setAttemptCount(0);

        } catch (err) {
          console.error((err as Error).message);
          toast.error((err as Error).message, {
            position: "top-center",
            autoClose: 2000,
          });

          resetForm();
        }finally {
          setLoading(false);
        }

    } else {
      console.error('試行回数の上限を超えました。時間をおいてもう一度お試しください。');
      toast.error('試行回数の上限を超えました。時間をおいてもう一度お試しください。', {
        position: "top-center",
        autoClose: 2000,
      });
      setIsResendDisabled(true);

      resetForm();

      setTimeout(() => {
        setIsResendDisabled(false);
        setAttemptCount(0);
      }, 180000);
    }
  }

  const resetForm = () => {
    setEmail('');
    setIsSendDisabled(true);
  };

  return (
    <UsersLayout
      title="パスワードリセット"
      actionText="ログインに戻る"
      actionHref="/users/login"
      actionLinkText="こちらへ"
    >

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
