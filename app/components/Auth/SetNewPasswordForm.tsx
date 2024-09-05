'use client';

import { useState, useEffect } from 'react';
import supabase from '../../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import AuthLayout from '../Layout/AuthLayout';
import Notification from '../Layout/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import zxcvbn from 'zxcvbn';

export default function SetNewPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUrl = window.location.href;
    console.log('Current URL:', currentUrl);

    const hash = window.location.hash.split("#")[1];

    console.log('Current hash:', hash);

    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => supabase.auth.getUser())
        .then(({ data, error }: { data: { user: User | null }, error: any }) => {
          if (error) {
            setError('Failed to get user: ' + (error.message || 'Unknown error'));
          } else if (data.user) {
            const userId = data.user.id;
            setUserId(userId);
            document.cookie = `access_token=${accessToken}; path=/;`;
            document.cookie = `refresh_token=${refreshToken}; path=/;`;
            console.log('Session set successfully with User ID: ' + userId);
          }
        })
        .catch((error: { message: string; }) => {
          setError('Failed to set session: ' + error.message);
          setShowNotification(true);
        });
    } else {
      setError('No access token or refresh token found in URL.');
      setShowNotification(true);
    }
  }, []);

  const handlePasswordUpdate = async () => {
    setError(null);
    setSuccess(null);

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (newPassword.length < 8 || !hasLetter || !hasNumber) {
      setError('パスワードは8文字以上、英字、数字を含めてください。');
      setShowNotification(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("確認パスワードが一致しません。");
      setShowNotification(true);
      return;
    }

    if (!userId) {
        setError('ユーザーIDが見つかりませんでした。');
        setShowNotification(true);
        return;
    }

    try {
      const response = await fetch('/api/users/set-new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password: newPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }

      setSuccess('パスワードの変更が完了しました。');
      setShowNotification(true);
      setError(null);
      router.push('/login');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'パスワードの変更に失敗しました。');
      setShowNotification(true);
      setSuccess(null);
    }
  };

  const updatePasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
  };

  return (
    <AuthLayout
      title="新しいパスワードを設定"
      actionText="ログインに戻る"
      actionHref="/login"
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
          handlePasswordUpdate();
        }}
        className="space-y-4"
      >
        {/* <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">新しいパスワード:</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div> */}
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
              新しいパスワード <span className='text-xs text-red-500'>必須</span>:
          </label>
            <div className="relative mt-2">
              <div className="w-full bg-gray-200 rounded">
                <div
                  id="passwordStrengthBar"
                  className={`h-2 rounded ${passwordStrength === 0 ? "bg-red-500" : passwordStrength === 1 ? "bg-yellow-500" : passwordStrength === 2 ? "bg-yellow-500" : passwordStrength === 3 ? "bg-green-500" : "bg-green-700"}`}
                  style={{ width: `${passwordStrength * 25}%` }}
                ></div>
              </div>
              <small id="passwordStrengthText" className="block text-gray-700">
                {passwordStrength === 0 && "非常に弱い - 文字数を増やしてください"}
                {passwordStrength === 1 && "弱い - もう少し複雑にしてください"}
                {passwordStrength === 2 && "普通 - より強いパスワードを検討してください"}
                {passwordStrength === 3 && "強い - 良いパスワードです"}
                {passwordStrength === 4 && "非常に強い - 非常に安全なパスワードです"}
              </small>
            </div>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="new-password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              updatePasswordStrength(e.target.value);
            }}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
            aria-label={showPassword ? "パスワードを非表示にする" : "パスワードを表示する"}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        </div>
        <small className="block text-gray-500">パスワードは8文字以上、英字、数字を含めてください。</small>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">パスワード（確認） <span className='text-xs text-red-500'>必須</span>:</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              aria-label={showPassword ? "パスワードを非表示にする" : "パスワードを表示する"}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600"
        >
          パスワードを変更
        </button>
      </form>
    </AuthLayout>
  );
}
