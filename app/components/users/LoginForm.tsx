'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import UsersLayout from '../../components/Layout/main/UsersLayout';
import { useLoading } from '../../context/LoadingContext';
import useAuth from '../../lib/useAuth';
import { useAuth as useAuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const router = useRouter();
  const { isLoading, setLoading } = useLoading();
  const { session, loading } = useAuth();
  const authContext = useAuthContext();
  const setSession = authContext?.setSession;
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);
  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (loading) {
    return <div>ローディング中...</div>;
  }


  const validateUsernameOrEmail = () => {
    const atIndex = usernameOrEmail.indexOf('@');
    const dotIndex = usernameOrEmail.lastIndexOf('.');

    if (atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < usernameOrEmail.length - 1) {
      return true;
    }

    if (usernameOrEmail.length > 1) {
      return true;
    }

    console.error('ユーザー名またはメールアドレスの形式が正しいことを確認してください。');
    setTimeout(() => {
      toast.error('ユーザー名またはメールアドレスの形式が正しいことを確認してください。', {
        position: "top-center",
        autoClose: 2000,
      });
    } , 3000);

    return false;
  };

  const validatePassword = () => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 8 || !hasLetter || !hasNumber) {
      console.error('パスワードは8文字以上、英字、数字を含みます。');
      setTimeout(() => {
        toast.error('パスワードは8文字以上、英字、数字を含みます。', {
          position: "top-center",
          autoClose: 2000,
        });
      } , 3000);
      return false;
    }
    return true;
  };


  const handleSignIn = async () => {

    setLoading(true);

    if (attemptCount >= 7) {
      console.error('試行回数が制限に達しました。しばらくしてから再度お試しください。');
      toast.error('試行回数が制限に達しました。しばらくしてから再度お試しください。', {
        position: "top-center",
        autoClose: 2000,
      });
      setLoading(false);

      let timer: NodeJS.Timeout | null = null;
      if (attemptCount >= 7) {
        timer = setTimeout(() => {
          setAttemptCount(0);
          setIsLoginDisabled(false);
        }, 180000);
      }

      return;
    }

    if (!validateUsernameOrEmail() || !validatePassword()) {
      console.error('入力内容に誤りがあります');
      toast.error('入力内容に誤りがあります', {
        position: "top-center",
        autoClose: 2000,
      });
      setLoading(false);
      setAttemptCount(attemptCount + 1);
      console.log('Attempt count:', attemptCount);
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
        console.error(errorData.message);
        toast.error(errorData.message, {
          position: "top-center",
          autoClose: 2000,
        });

        setAttemptCount(attemptCount + 1);
        // console.log('Server Attempt count:', attemptCount);
        return;
      } else {

        const result = await response.json();

        const session = result.session;

        if (setSession) {
          setSession(session);
        }

        console.log('ログインしました');
        toast.success('ログインしました', {
          position: "top-center",
          autoClose: 2000,
        });

        if (isMobile()) {
          router.push('/questions/mobile');
        } else {
          router.push('/questions');
        }

      }

    } catch (err) {

      console.error('予期しないエラーが発生しました');
      toast.error('予期しないエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });

    }finally {

    setLoading(false);
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