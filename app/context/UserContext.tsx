// 'use client';

// import useAuth from '@/app/lib/useAuth';
// import { createContext, useContext, useState, useEffect } from 'react';
// import { useLoading } from './LoadingContext';

// interface UserContextType {
//   userId: string | null;
//   username: string | null;
//   profileImage: string | null;
//   email: string | null;
//   isLoading: boolean;
//   error: string | null;
//   setUser: (user: { username: string, email: string, profileImage: string }) => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [username, setUsername] = useState<string | null>(null);
//   const [email, setEmail] = useState<string | null>(null);
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [isLoading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // **ログイン不要なページのリストを追加**
//   // const excludedPaths = [
//   //   '/', '/users/change-password',
//   //   '/users/login', '/users/set-new-password', '/users/signup',
//   // ];

//   // **現在のパスがログイン不要ページかどうかを判定**
//     // const isExcludedPath = (path: string) => excludedPaths.includes(path);

//     const { session } = useAuth();
//     const [userId, setUserId] = useState<string | null>(null);
    
//     useEffect(() => {
//       if (!session) {
//         console.log('セッションがまだありません');
//         return; // session がまだ無い場合は、ここで処理を終了
//       }
    
//       const currentUserId = session.user?.id || null;
//       setUserId(currentUserId);
//       console.log('セッション:', session);
//       console.log('ユーザーID:', currentUserId);
//     }, [session]);
    
//     useEffect(() => {
//       if (!userId) {
//         console.log('ユーザーIDがまだ設定されていません');
//         return; // userIdが無い場合は処理をスキップ
//       }
    
//       // userIdが設定されているときにのみ、APIリクエストを実行
//       const fetchUserInfo = async () => {
//         try {
//           console.log('ユーザー情報取得中...ユーザーID:', userId);
//           const response = await fetch(`/api/users/${userId}`, {
//             method: 'GET',
//             credentials: 'include',
//           });
    
//           if (!response.ok) {
//             throw new Error('ユーザー情報の取得に失敗しました');
//           }
    
//           const data = await response.json();
//           // ユーザー情報をセットする処理
//           console.log('ユーザー情報:', data);
//         } catch (err) {
//           console.error('エラー:', err);
//         }
//       };
    
//       fetchUserInfo();
//     }, [userId]); // userIdが設定されたらAPIリクエストを実行
    


//   const setUser = (user: { username: string, email: string, profileImage: string }) => {
//     setUsername(user.username);
//     setEmail(user.email);
//     setProfileImage(user.profileImage);
//   };


//   useEffect(() => {
//     if (!userId || !userId) {
//       setLoading(false);
//       return;
//     }

//     const fetchUserInfo = async () => {
//       try {
//         console.log('ユーザー情報取得中...');
//         console.log('ユーザーID:', userId);
//         const response = await fetch(`/api/users/${userId}`, {
//           method: 'GET',
//           credentials: 'include',
//         });

//         if (!response.ok) {
//           throw new Error('ユーザー情報の取得に失敗しました');
//         }

//         const data = await response.json();

//         setUser({
//           username: data.username,
//           email: data.email,
//           profileImage: data.profileImage,
//         });
//         setError(null);
//         console.log('ユーザー情報:', data);
//       } catch (err) {
//         console.error('エラー:', err);
//         setError('ユーザー情報の取得に失敗しました');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserInfo();
//   }, [userId]);

//   return (
//     <UserContext.Provider value={{ userId, username, email, profileImage, isLoading, error, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
