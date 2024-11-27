// 'use client';

// import Image from 'next/image';

// interface AvatarProps {
//   url: string;
// }

// export default function Avatar({ url }: AvatarProps) {
//   return (
//     <div className="w-10 h-10 bg-gray-300 flex items-center justify-center">
//       {url ? (
//         <Image src={url} alt="User Avatar" width={40} height={40} />
//       ) : (
//         <svg
//           className="w-8 h-8 text-gray-500"
//           fill="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fillRule="evenodd"
//             d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm-7 8c0-2.66 5.33-4 7-4s7 1.34 7 4v1H5v-1z"
//           />
//         </svg>
//       )}
//     </div>
//   );
// }
