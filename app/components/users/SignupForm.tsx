'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import zxcvbn from 'zxcvbn';
import UsersLayout from '../../components/Layout/main/UsersLayout';
import  supabase from '../../lib/supabaseClient';
import { useLoading } from '../../context/LoadingContext';
import { toast } from 'react-toastify';

export default function SignupForm() {
  const [isMobile, setIsMobile] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isSendVisible, setIsSendVisible] = useState(true);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const {isLoading, setLoading } = useLoading();
  const router = useRouter();
  const [touchedFields, setTouchedFields] = useState<{
    username: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  }>({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });


  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    return () => {
      setAttemptCount(0);
    };
  }, []);

  const handleFieldFocus = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = async (field: string): Promise<boolean> => {
    return new Promise((resolve) => {

      setTimeout(() => {

        if (field === 'username' && username.trim().length < 2) {
          console.error("ユーザー名を2文字以上入力してください。");
          toast.error("ユーザー名を2文字以上入力してください。", {
            position: "top-center",
            autoClose: 2000,
          });
          return false;
        }
        if (field === 'email') {
          const atIndex = email.indexOf('@');
          const dotIndex = email.lastIndexOf('.');
          if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex >= email.length - 1) {
            console.error("有効なメールアドレスを入力してください。");
            toast.error("有効なメールアドレスを入力してください。", {
              position: "top-center",
              autoClose: 2000,
            });
            return false;
          }
        }
        if (field === 'password') {

          const hasLetter = /[a-zA-Z]/.test(password);
          const hasNumber = /[0-9]/.test(password);

          if (password.length < 8 || !hasLetter || !hasNumber) {
          console.error('パスワードは8文字以上、英字、数字を含めてください。');
          toast.error('パスワードは8文字以上、英字、数字を含めてください。', {
            position: "top-center",
            autoClose: 2000,
          });
          return false;
          }
        }
        if (field === 'confirmPassword' && confirmPassword !== password) {
          console.error("確認パスワードが一致しません。");
          toast.error("確認パスワードが一致しません。", {
            position: "top-center",
            autoClose: 2000,
          });
          return false;
        }
        setIsSendDisabled(false);
        resolve(true);
      }, 500);
    });
  };


  const handleSignup = async () => {

      const isUsernameValid = await handleBlur('username');
    if (!isUsernameValid) return;

    const isEmailValid = await handleBlur('email');
    if (!isEmailValid) return;

    const isPasswordValid = await handleBlur('password');
    if (!isPasswordValid) return;

    const isConfirmPasswordValid = await handleBlur('confirmPassword');
    if (!isConfirmPasswordValid) return;

    try {
      setLoading(true);
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password}),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('アカウントを作成しました。認証メールをご確認ください。', {
          position: "top-center",
          autoClose: 2000,
        });

        setAttemptCount(0);
        setIsSendDisabled(true);

        setTimeout(() => {
        setIsSendVisible(false);
        }, 10000);

        setTimeout(() => {
          setIsResendVisible(true);
        }, 10000);

      } else {
        console.error(result.message || 'アカウント作成に失敗しました。');
        toast.error('アカウント作成に失敗しました。', {
          position: "top-center",
          autoClose: 2000,
        });
        setAttemptCount(attemptCount + 1);

        resetForm();
      }
    } catch (err) {
      console.error('サーバーエラーが発生しました。後ほど再試行してください。');
      toast.error('サーバーエラーが発生しました。後ほど再試行してください。', {
        position: "top-center",
        autoClose: 2000,
      });
      setAttemptCount(attemptCount + 1);

      resetForm();
    }finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsSendDisabled(true);
  };

  const updatePasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
  };

    const handleResendClick = async () => {
    if (attemptCount < 5) {
      setIsResendDisabled(true);
      setTimeout(() => {
        setIsResendDisabled(false);
      }, 10000);
      setAttemptCount(attemptCount + 1);

      const { error } = await supabase.auth.resend({
        email,
        type: 'signup'
      });

      if (error) {
        console.error(error.message);
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.success('認証メールを再送しました。受信メールをご確認ください。', {
          position: "top-center",
          autoClose: 2000,
        });
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


  if (isMobile) {
    return (
      <UsersLayout
        title="サインアップ"
        actionText="既にアカウントをお持ちの方は"
        actionHref="/users/login"
        actionLinkText="ログインへ"
      >
        <div className="text-center text-red-300 font-bold mt-8">
          ※ アカウントの作成は<br/>PC画面から行ってください。
        </div>
      </UsersLayout>
    );
  }


  return (
      <UsersLayout
        title="サインアップ"
        actionText="既にアカウントをお持ちの方は"
        actionHref="/users/login"
        actionLinkText="ログインへ"
      >

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">ユーザー名 <span className='text-xs text-red-500'>必須</span>:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => handleFieldFocus('username')}
              onBlur={() => handleBlur('username')}
              autoComplete="username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <small className="block text-gray-500">ユーザー名は2文字以上入力してください。</small>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス <span className='text-xs text-red-500'>必須</span>:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFieldFocus('email')}
              onBlur={() => handleBlur('email')}
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <small className="block text-gray-500 mt-1">例: ○○○○@example.com</small>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード <span className='text-xs text-red-500'>必須</span>:
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
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                updatePasswordStrength(e.target.value);
              }}
              onFocus={() => handleFieldFocus('password')}
              onBlur={() => handleBlur('password')}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
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
                onFocus={() => handleFieldFocus('confirmPassword')}
                onBlur={() => handleBlur('confirmPassword')}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
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
          {isSendVisible && (
          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSendDisabled ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-800'}`}
            disabled={isSendDisabled}
          >
            アカウントを作成
          </button>
        )}
        {isResendVisible && (
          <button
          onClick={handleResendClick}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isResendDisabled ? 'bg-green-300 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-800'}`}
          disabled={isResendDisabled}
        >
          認証メールを再送
        </button>
        )}
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
  );
}
