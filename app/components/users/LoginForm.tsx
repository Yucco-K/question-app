'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Notification from '../layout/Notification';
// import AuthLayout from '../Layout/AuthLayout';
import UsersLayout from '../../components/layout/main/UsersLayout';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const router = useRouter();

  // const validateEmail = () => {
  //   const atIndex = email.indexOf('@');
  //   const dotIndex = email.lastIndexOf('.');

  //   const hasValidPrefix = atIndex > 0;
  //   const hasValidDomain = dotIndex > atIndex + 1;
  //   const hasValidSuffix = dotIndex < email.length - 1;

  //   if (!hasValidPrefix || !hasValidDomain || !hasValidSuffix) {
  //     setError('メールアドレスの形式ではありません');
  //     return false;
  //   }
  //   return true;
  // };

  // const validatePassword = () => {

  //   const hasLetter = /[a-zA-Z]/.test(password);
  //   const hasNumber = /[0-9]/.test(password);

  //   if (password.length < 8 || !hasLetter || !hasNumber) {
  //   setError('パスワードは8文字以上、英字、数字を含めてください。');
  //   setShowNotification(true);
  //   return false;
  //   }
  //   return true;
  // };

  const validateUsernameOrEmail = () => {
    const atIndex = usernameOrEmail.indexOf('@');
    const dotIndex = usernameOrEmail.lastIndexOf('.');

    if (atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < usernameOrEmail.length - 1) {
      return true;
    }

    if (usernameOrEmail.length > 1) {
      return true;
    }

    setError('ユーザー名またはメールアドレスの形式が正しくありません');
    setShowNotification(true);
    return false;
  };

  const validatePassword = () => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 8 || !hasLetter || !hasNumber) {
      setError('パスワードは8文字以上、英字、数字を含みます。');
      setShowNotification(true);
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    setError(null);
    setSuccess(null);

    if (!validateUsernameOrEmail() || !validatePassword()) {
      setError('入力内容に誤りがあります');
      setShowNotification(true);
      return;
    }

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        setShowNotification(true);
      } else {

        const result = await response.json();

        // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
        // const projectId = new URL(supabaseUrl).hostname.split('.')[0];

        // const data = await response.json();
        // const accessTokenKey = `sb-${projectId}-${result.access_token}`;
        // const refreshTokenKey = `sb-${projectId}-${result.refresh_token}`;

        // window.localStorage.setItem(result.accessTokenKey, result.accessToken);
        // window.localStorage.setItem(result.refreshTokenKey, result.refreshToken);

        console.log('Redirecting to home...');
        setSuccess('ログインに成功しました');
        setShowNotification(true);



        router.push('/');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
      setShowNotification(true);
    }
  };

  return (
    <>
      <UsersLayout
        title="ログイン"
        actionText="アカウントをお持ちでない方は"
        actionHref="/users/signup"
        actionLinkText="新規会員登録へ"
        additionalActions={[
          { text: "パスワードをお忘れの方は", href: "/users/change-password", linkText: "パスワード変更へ" },
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
            <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700">ユーザー名またはメールアドレス:</label>
            <input
              type="text"
              id="usernameOrEmail"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              onBlur={validateUsernameOrEmail}
              autoComplete="usernameOrEmail"
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
                onBlur={validatePassword}
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
        <style jsx>{`
        input::-ms-reveal,
        input::-ms-clear,
        input::-webkit-clear-button,
        input::-webkit-password-toggle-button {
          display: none;
        }
        `}</style>
      </UsersLayout>
    </>
  );
}