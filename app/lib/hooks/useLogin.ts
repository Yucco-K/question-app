// import { useAuth } from '../../context/AuthContext';
// import { useRouter } from 'next/navigation';

// export const useLogin = () => {
//   const { setSession } = useAuth(true);
//   const router = useRouter();

//   const login = async (credentials: { email: string; password: string }) => {
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSession(data.session);
//         router.push('/dashboard');
//       } else {
//         throw new Error('ログインに失敗しました');
//       }
//     } catch (error) {
//       console.error('ログイン中にエラーが発生しました', error);
//     }
//   };

//   return { login };
// };
