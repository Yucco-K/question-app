'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ButtonGroup from '@/app/components/ui/ButtonGroup';
import { faTrash, faUser, faEnvelope, faPen, faArrowLeft, faCheck, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

interface Params {
  userId: string;
}

interface EditUserProfileProps {
  userId: string;
}


interface ButtonData {
  label: string;
  className: string;
  onClick: () => void;
}

export default function EditUserProfile({ userId }: EditUserProfileProps) {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingAccountDelete, setIsConfirmingAccountDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ユーザー情報の取得に失敗しました');
      }
      const data = await response.json();
      setEmail(data.email);
      setNewEmail(data.email);
      setName(data.username);
      setProfileImage(data.profileImage);

    } catch (err) {
      console.error((err as Error).message);
      // toast.error('ユーザー情報の取得に失敗しました', {
      //   position: "top-center",
      //   autoClose: 3000,
      // });

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;

    if (field === 'name') {
      setName(value);
    } else if (field === 'email') {
      setEmail(value);
    }

  };

  const validateField = (field: string, newValue: string): boolean => {
    if (field === 'name') {
      const currentLength = newValue.length;
      if (currentLength < 2) {
        console.error('ユーザー名を2文字以上入力してください。');
        toast.error('ユーザー名を2文字以上入力してください。', {
          position: "top-center",
          autoClose: 3000,
        });
        return false;
      }
    }

    if (field === 'email') {
      const atIndex = newValue.indexOf('@');
      const dotIndex = newValue.lastIndexOf('.');
      if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex >= newValue.length - 1) {
        setTimeout(() => {
          console.error('有効なメールアドレスを入力してください。');
          toast.error('有効なメールアドレスを入力してください。', {
            position: "top-center",
            autoClose: 3000,
          });
        }, 4000);
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validateField('name', name)) {
      return false;
    }
    if (!validateField('email', email)) {
      return false;
    }
    return true;
  };


  const handleCancelEdit = () => {
    setNewEmail('');
    setConfirmEmail('');
    setIsEditingEmail(false);
  };

  const handleImageDelete = async () => {
    setIsConfirmingDelete(false);
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/edit`, {
        method: 'PATCH',
      });
      if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || '画像の削除に失敗しました');
      }
      setProfileImage('');
      toast.success('プロフィール画像を削除しました', {
        position: "top-center",
        autoClose: 3000,
      });
      fetchUserData();
      // window.location.reload();

    } catch (err) {
      console.error((err as Error).message);
      toast.error('画像の削除に失敗しました', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally{
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleCancelDeleteAccount = () => {
    setIsConfirmingAccountDelete(false);
  };

  const handleCancelAndReturn = () => {
    setNewEmail('');
    setConfirmEmail('');
    setIsEditingEmail(false);
    router.push(`/users/${userId}`);
  };

  const handleAccountDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/edit`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'アカウントの削除に失敗しました。');
      }
      toast.success('アカウントが削除されました。', {
        position: "top-center",
        autoClose: 3000,
      })
      router.push('/');
    } catch (err) {
      console.error((err as Error).message);
      toast.error('アカウントの削除に失敗しました。', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.error('ファイルが選択されていません');
      toast.error('ファイルが選択されていません', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const file = files[0];
    const formData = new FormData();

    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const baseName = file.name.split('.').slice(0, -1).join('.');

    const fileNameWithTimestamp = `${baseName}_${timestamp}.${fileExt}`;
    formData.append('file', file, fileNameWithTimestamp);

    console.log('formData:', formData);

    try {
      setLoading(true);
      const response = await fetch('/api/users/avatar-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      // const imageUrlWithTimestamp = `${data.publicUrl}?timestamp=${new Date().getTime()}`;
      // console.log(imageUrlWithTimestamp, 'imageUrlWithTimestamp');
      // setProfileImage(imageUrlWithTimestamp);
      setProfileImage(data.publicUrl);
      console.log(data.publicUrl, 'data.publicUrl');

    } catch (err) {
      console.error((err as Error).message);
      toast.error('エラーが発生しました', {
        position: "top-center",
        autoClose: 3000,
      });
    }finally{
      setLoading(false);
    }
  };

  const saveProfileImage = async () => {
    try {
      console.log('profileImage:', profileImage);
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileImage }),
      });
      if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || 'プロフィール画像の保存に失敗しました');
      }
      toast.success('プロフィール画像を保存しました', {
        position: "top-center",
        autoClose: 3000,
      })
      setIsEditingImage(false);
      fetchUserData();
      // window.location.reload();
    } catch (err) {
      console.error((err as Error).message);
      toast.error('プロフィール画像の保存に失敗しました', {
        position: "top-center",
        autoClose: 3000,
      });
    }finally{
      setLoading(false);
    }
  };

  const handleEmailSave = async () => {
    if (!validateField('email', newEmail)) return;

    if (newEmail !== confirmEmail) {
      console.error('新しいメールアドレスと確認用メールアドレスが一致しません');
      toast.error('新しいメールアドレスと確認用メールアドレスが一致しません', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/users/${userId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'メールアドレスの更新に失敗しました');
      }
      toast.success('メールアドレスを更新しました', {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        setEmail(newEmail);
        setNewEmail('');
        setConfirmEmail('');
        setIsEditingEmail(false);
      }, 500);

      fetchUserData();

    } catch (err) {
      console.error((err as Error).message);
      toast.error(`メールアドレスの更新に失敗しました。${(err as Error).message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }finally{
      setLoading(false);
    }
  };


  const handleNameSave = async () => {
    if (!validateField('name', name)) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name }),
      });
      if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || '名前の更新に失敗しました');
      }
      toast.success('名前を更新しました', {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => {
        setName(name);
        setIsEditingName(false);
      }, 500);

      fetchUserData();

    } catch (err) {
      console.error((err as Error).message);
      toast.error('名前の更新に失敗しました', {
        position: "top-center",
        autoClose: 2000,
      });
    }finally{
      setLoading(false);
    }
  }


  const buttonData: ButtonData[] = [
  { label: '戻る', className: 'bg-blue-800 text-white', onClick: handleCancelAndReturn },
  ];

  return (
    <>
      <div className="p-8 mt-10 bg-white rounded-md shadow-md w-full lg:w-2/3 mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-500">プロフィール</h2>
        <div className='flex flex-col gap-10'>

          <button className="bg-orange-400 text-white px-4 py-2 rounded-sm cursor-auto">
            <span className='mr-3'>編集中</span>
            <FontAwesomeIcon icon={faPen} />
          </button>
          <div className="relative">
          <button
          className="p-2 border border-gray-500 font-bold text-gray-900 text-sm rounded"
          onClick={() => setIsConfirmingAccountDelete(true)}
        >
          <span className='mr-2'>アカウントを削除</span>
          <FontAwesomeIcon icon={faTrash} className="mr-2 text-gray-500" />
        </button>
        </div>
      </div>

    {isConfirmingAccountDelete && (
    <div
    className="
    absolute top-36 right-4 sm:right-20 mt-32
    w-11/12 sm:w-2/3 lg:w-1/3
    bg-gray-100 p-6 rounded shadow-md
    border border-gray-300 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-center text-xs mb-4">本当にアカウントを削除しますか？</p>
      <div className="flex space-x-4 justify-center">
        <button
          className="py-2 px-6 bg-red-500 text-xs text-white rounded"
          onClick={handleAccountDelete}
        >
          削除
        </button>
        <button
          className="py-2 px-6 bg-gray-300 text-xs text-black rounded"
          onClick={handleCancelDeleteAccount}
        >
          キャンセル
        </button>
      </div>
    </div>
  )}
    </div>

      <div className="mb-6">
        <label className="block text-blue-900 text-md mb-2">プロフィール画像</label>
        <div
          className="relative w-20 h-20 mb-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {profileImage ? (
            <>
              <Image
                src={profileImage}
                alt="Profile"
                width={80}
                height={80}
                className="w-full h-full rounded-sm"
                priority={true}
              />

              {isHovered && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-30"
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-white text-sm" />
                </div>
              )}
            </>
          ) : (
            <div className="w-20 h-20 border border-gray-300 rounded-sm flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" size="2x" />
            </div>
          )}

          {isConfirmingDelete && (
            <div
              className="absolute top-0 left-full ml-4 bg-gray-500 bg-opacity-75 flex flex-col items-center justify-center z-50"
              onClick={handleCancelDelete}
            >


            <div className="absolute right-full top-1/2 transform -translate-y-1/2">
              <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[8px] border-transparent border-r-gray-300"></div>
            </div>


              <div
                className="bg-gray-100 p-4 rounded shadow-md"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-center mb-4 whitespace-nowrap">画像を削除しますか？</p>
                <div className="flex space-x-4 justify-center">
                  <button
                    className="p-2 bg-red-400 text-white text-sm rounded whitespace-nowrap"
                    onClick={handleImageDelete}
                  >
                    OK
                  </button>
                  <button
                    className="p-2 bg-gray-300 text-black text-sm rounded whitespace-nowrap"
                    onClick={handleCancelDelete}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {isEditingImage ? (
          <>
            <input
              type="file"
              id="profileImageInput"
              className="hidden"
              onChange={handleProfileImageChange}
              title="プロフィール画像を選択"
            />
            <div className="flex space-x-2 justify-end">

              <button
                onClick={() => document.getElementById('profileImageInput')?.click()}
                className="p-2 bg-blue-800 text-white text-sm rounded hover:bg-blue-300 w-full sm:w-1/4"
              >
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                画像を<br/>選択
              </button>

              <button
                onClick={saveProfileImage}
                className="p-2 bg-blue-500 text-white rounded text-xs w-full sm:w-1/4"
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                保存
              </button>

              <button
                onClick={() => setIsEditingImage(false)}
                className="p-2 bg-gray-500 text-white rounded text-xs w-full sm:w-1/4"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                閉じる
              </button>
            </div>
          </>
        ) : (
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => setIsEditingImage(true)}
              className="p-2 bg-blue-800 text-white text-sm rounded hover:bg-blue-300 w-full sm:w-1/4"
            >
              <FontAwesomeIcon icon={faImage} className="mr-3" />
              変更
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-blue-900 text-md mb-2">メールアドレス</label>
        {isEditingEmail ? (
          <>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                handleInputChange(e, 'email');
              }}
              className="p-2 border rounded w-full sm:w-2/3 mb-2"
              placeholder="新しいメールアドレス"

              />
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              className="p-2 border rounded w-full sm:w-2/3 mb-2"
              placeholder="確認用メールアドレス"
              onPaste={(e) => e.preventDefault()}
              />
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => {
                  if (handleSave()) {
                    handleEmailSave();
                  }
                }}
                className="p-2 bg-blue-500 text-white rounded text-xs w-full sm:w-1/4"
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                保存
              </button>
              <button
                onClick={() => setIsEditingEmail(false)}
                className="p-2 bg-gray-500 text-white rounded text-xs w-full sm:w-1/4"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                閉じる
              </button>
            </div>
          </>
        ) : (
          <div>
            <p className='flex items-center justify-center text-blue-900 text-xl font-bold mb-4'>{email}</p>
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => setIsEditingEmail(true)}
                className="p-2 bg-blue-800 text-white text-sm rounded hover:bg-blue-300 w-full sm:w-1/4"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
                変更
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-blue-900 text-md mb-2">名前</label>
        {isEditingName ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) =>handleInputChange(e, 'name')}
              className="p-2 border rounded w-full sm:w-2/3 mb-2"
              placeholder="名前を入力" />
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => {
                  if (handleSave()) {
                    handleNameSave();
                  }
                }}
                className="p-2 bg-blue-500 text-white rounded text-xs w-full sm:w-1/4"
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                保存
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                className="p-2 bg-gray-500 text-white rounded text-xs w-full sm:w-1/4"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                閉じる
              </button>
            </div>
          </>
        ) : (
          <div>
            <p className='flex items-center justify-center text-blue-900 text-xl font-bold mb-4'>{name}
              <span className='ml-2 text-sm font-semibold'>さん</span>
            </p>
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => setIsEditingName(true)}
                className="p-2 bg-blue-800 text-white text-sm rounded hover:bg-blue-300 w-full sm:w-1/4"
              >
                <FontAwesomeIcon icon={faPen} className="mr-3" />
                変更
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="mx-auto w-1/5 text-sm">
        <ButtonGroup pattern={1} buttons={buttonData} buttonsPerRow={[1]} />
    </div>
    </>
  );
}

