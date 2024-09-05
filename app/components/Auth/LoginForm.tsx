'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Notification from '../Layout/Notification';
import AuthLayout from '../Layout/AuthLayout';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  const validateEmail = () => {
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');

    const hasValidPrefix = atIndex > 0;
    const hasValidDomain = dotIndex > atIndex + 1;
    const hasValidSuffix = dotIndex < email.length - 1;

    if (!hasValidPrefix || !hasValidDomain || !hasValidSuffix) {
      setError('メールアドレスの形式ではありません');
      return false;
    }
    return true;
  };

  const validatePassword = () => {

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 8 || !hasLetter || !hasNumber) {
    setError('パスワードは8文字以上、英字、数字を含めてください。');
    setShowNotification(true);
    return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    setError(null);

    if (!validateEmail()) {
      return;
    }

    if (!validatePassword()) {
      return;
    }

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
      } else {
        console.log('Redirecting to home...');
          router.push('/');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
      setShowNotification(true);
    }
  };

  return (
    <>
      <AuthLayout
        title="ログイン"
        actionText="アカウントをお持ちでない方は"
        actionHref="/signup"
        actionLinkText="新規会員登録へ"
        additionalActions={[
          { text: "パスワードをお忘れの方は", href: "/change-password", linkText: "パスワード変更へ" },
        ]}
      >
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <form
        id="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">パスワード:</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validateEmail}
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
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600"
        >
          ログイン
        </button>
      </form>
      </AuthLayout>
    </>
  );
}
