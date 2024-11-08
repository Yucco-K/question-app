// 'use client';

// import useAuth from '@/app/lib/useAuth';

// export default function UserEmailDisplay() {
//   const { session, loading: userLoading } = useAuth();
//   const userId = (session?.user as { id?: string })?.id ?? null;
//   const email = (session?.user as { email?: string })?.email ?? null;

//   const displayEmail = email || '未登録';

//   return (
//     <div>
//       <p>{displayEmail}</p>
//     </div>
//   );
// }
