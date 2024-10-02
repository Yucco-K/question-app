'use client';

import { useEffect, useState } from 'react';
import Notification from '../ui/Notification';
import DOMPurify from 'dompurify';
import styles from './QuestionList.module.css';
import Card from '../ui/Card';
import { useLoading } from '../../context/LoadingContext';
import Category from '../ui/Category';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

interface DraftItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  category_id: string;
  created_at: string;
  user_id: string;
  className?: string;
  onClick?: () => void;
}

interface DraftListProps {
  onSelectDraft: (draft: DraftItem) => void;
  categoryId: string | null;
}


export default function DraftList({ onSelectDraft, categoryId }: DraftListProps) {
  const [draftList, setDraftList] = useState<DraftItem[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { isLoading, setLoading } = useLoading();


  useEffect(() => {
    console.log('categoryId:', categoryId);
    setError(null);
    setSuccess(null);
    setShowNotification(false);
    setLoading(true);

    const fetchDrafts = async () => {
      try {
        // categoryId が渡されていれば、それを使ってフィルタリング
        const url = categoryId ? `/api/questions/drafts?categoryId=${categoryId}` : '/api/questions/drafts';
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('下書きの取得に失敗しました');
        }

        const data = await response.json();
        setDraftList(data);

        data.forEach((item: { category_id: any }) => {
          console.log('Category ID:', item.category_id);  // category_idにアクセス
        });
      } catch (err) {
        setError('データの取得中にエラーが発生しました');
        setShowNotification(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [categoryId, setLoading]); // categoryId も依存関係に追加


//   useEffect(() => {

//     console.log('categoryId:', categoryId);
//     setError(null);
//     setSuccess(null);
//     setShowNotification(false);
//     setLoading(true);

//   const fetchDrafts = async () => {
//     try {
//       const response = await fetch('/api/questions/drafts');
//       if (!response.ok) {
//         throw new Error('下書きの取得に失敗しました');
//       }
//       const data = await response.json();
//       setDraftList(data);
//       console.log('data:',data);
//       console.log('draftList:',draftList);

//       data.forEach((item: { category_id: any; }) => {
//         console.log("Category ID:", item.category_id);  // category_idにアクセス
//       });

//     } catch (err) {
//       setError('データの取得中にエラーが発生しました');
//       setShowNotification(true);

//     }finally {
//     setLoading(false);
//     }
//   };

//   fetchDrafts();
// }, [setLoading]);

  const handleDeleteDraft = async (id: string) => {

    const draftId = id;
    console.log('Deleting draft with ID:', draftId);

    setError(null);
    setSuccess(null);
    setShowNotification(false);
    setLoading(true);

    try {
      const response = await fetch(`/api/questions/drafts/${draftId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('下書きの削除に失敗しました');
      }

      setDraftList(draftList.filter((draft) => draft.id !== id));
      setSuccess('下書きを削除しました');
      setShowNotification(true);

    } catch (err) {
      console.error('Error deleting draft:', err);
      setError('削除中にエラーが発生しました');
      setShowNotification(true);

    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('DraftList:', draftList);
    console.log('DraftList.category_id:', draftList.map(draft => { console.log(draft.category); }));
  }, [draftList]);

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ''}
          type={error ? 'error' : 'success'}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="className=flex flex-col items-center">
        {draftList.length === 0 && !isLoading && (
          <p className='flex items-center justify-center text-lg'>下書きがありません。</p>
        )}

        {draftList.map((draft, index) => {
          const sanitizedDescription = DOMPurify.sanitize(draft.description);

          return (
            <div className="my-5 mx-auto w-4/5">
              <Card
                key={draft.id}
                title={draft.title}
                categoryId={draft.category_id}
                className="relative"
                onEdit={() => onSelectDraft(draft)}
                onDelete={() => handleDeleteDraft(draft.id)}
              >
                <div>
                  <p className="label"></p>
                  <div
                    className={styles.questionBody}
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                </div>

                <div className="flex flex-wrap mt-4">
                  {draft.tags?.map((tag, index) => (
                    <span key={index} className="bg-blue-500 text-white px-4 rounded-full mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center mt-4">
                  <div className="ml-2">
                    {/* <p className="font-semibold">作成者ID: {draft.user_id}</p> */}
                    <p className="text-sm text-gray-500">
                      {draft.created_at ? (
                        new Date(draft.created_at).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })

                      ) : (
                        '作成日登録なし'
                      )}
                    </p>
                  </div>

                  {/* <button
                    title="Edit draft"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Edit button clicked for draft ID:', draft.id);
                      onSelectDraft(draft);
                    }}
                    className="ml-auto text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-xl" />
                  </button>

                  <button
                    title="Delete draft"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDraft(draft.id);
                    }}
                    className="absolute top-2 right-3 text-2xl text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button> */}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}
