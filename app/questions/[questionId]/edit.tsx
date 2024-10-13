// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { useUser } from '../../context/UserContext';
// import Form from '@/app/components/ui/Form';
// import TagInput from '@/app/components/ui/TagInput';

// export default function EditQuestion() {
//   const { userId } = useUser();
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [tags, setTags] = useState<string[]>([]);
//   const router = useRouter();
//   const [questionUserId, setQuestionUserId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const [questionId, setQuestionId] = useState<string | null>(null);

//   useEffect(() => {
//     if (router.asPath) {
//       const idFromPath = router.asPath.split('/').pop();
//       if (idFromPath) {
//         setQuestionId(idFromPath);
//       }
//     }
//   }, [router.asPath]);

//   useEffect(() => {
//     console.log('router:', router);
//     console.log('router.query:', router.query);
//     console.log('router.asPath:', router.asPath);

//   }, []);

//   useEffect(() => {

//     const path = router.asPath;

//     console.log('path:', path);

//     const idFromPath = path.split('/').pop();

//     console.log('idFromPath:', idFromPath);

//     if (idFromPath) {
//       setQuestionId(idFromPath);
//     }
//   }, []);

//   useEffect(() => {
//     if (!questionId) {
//       return;
//     }
//   }, [questionId]);


//   useEffect(() => {

//     const fetchQuestion = async () => {
//       if (questionId) {
//         const response = await fetch(`/api/questions/bc26e210-87c9-4629-ac25-46f5d979a069`);
//         const data = await response.json();
//         if (response.ok) {
//           setTitle(data.title);
//           setDescription(data.description);
//           setTags(data.tags || []);
//           setQuestionUserId(data.user_id);
//           setLoading(false);
//         }
//       }
//     };
//     fetchQuestion();
//   }, []);


//   // 質問を更新する処理
//   const handleUpdate = async (updatedTitle: string, updatedBody: string, updatedTags: string[]) => {
//     if (!userId) {
//       console.error('ユーザーが認証されていません');
//       return;
//     }

//     if (userId !== questionUserId) {
//       console.error('この操作は投稿者のみ可能です');
//       alert('この操作は投稿者のみ可能です');
//       return;
//     }

//     const response = await fetch(`/api/questions/${questionId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         title: updatedTitle,
//         description: updatedBody,
//         tags: updatedTags,
//         // userId,
//       }),
//     });

//     if (response.ok) {
//       router.push(`/questions/${questionId}`);
//     }
//   };


//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-4">質問を編集</h1>
//       <Form
//         initialTitle={title}
//         onCancel={() => router.push(`/questions/${questionId}`)}
//         initialBody={description} titleLabel={''} bodyLabel={''} bodyPlaceholder={''} onTitleChange={function (newTitle: string): void {
//           throw new Error('Function not implemented.');
//         } } onBodyChange={function (newBody: string): void {
//           throw new Error('Function not implemented.');
//         } } titlePlaceholder={''}      />
//     <TagInput tagLabel={''} availableTags={[]} initialTags={tags} onTagsChange={function (newTags: string[]): void {
//         throw new Error('Function not implemented.');
//       } }/>
//     </div>
//   );
// }
