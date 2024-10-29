'use client';

import { useEffect, useState } from 'react';
import styles from './QuestionList.module.css';
import { useLoading } from '../../context/LoadingContext';
import useAuth from '@/app/lib/useAuth';
import { useRouter } from 'next/navigation';
import Card from '../ui/Card';
import DOMPurify from 'dompurify';
import UserNameDisplay from '../profile/UserNameDisplay';
import { toast } from 'react-toastify';
import QuestionHeader from '../Layout/header/QuestionHeader';


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

interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
}


export default function DraftList({ onSelectDraft, categoryId }: DraftListProps) {
  const [draftList, setDraftList] = useState<DraftItem[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const { isLoading, setLoading } = useLoading();
  const router = useRouter();
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as User & { id: string })?.id ?? null;


  const fetchDrafts = async () => {
    if (session && session.user) {
      const userId = session.user.id;

      if (!isLoading && !session) {
        console.error('ログインが必要です。');
        toast.error('ログインが必要です。', {
          position: "top-center",
          autoClose: 2000,
        });
        router.push('/users/login');
        return;
      }
    }

    try {
      setLoading(true);

      const url = `/api/questions/drafts?userId=${userId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('下書きの取得に失敗しました');
      }

      const data = await response.json();
      setDraftList(data);

    } catch (err) {
      console.error('データの取得中にエラーが発生しました');
      toast.error('下書きの取得に失敗しました', {
        position: "top-center",
        autoClose: 2000,
      });
      console.error('Error fetching drafts:', err);

    } finally {
      setLoading(false);
      setDraftId(null);
    }
  };


  useEffect(() => {
    if (session) {
      fetchDrafts();
    }
  }, []);


  const handleDeleteDraft = async (id: string) => {

    const draftId = id;

    if (!userId) {
      console.error('ログインしてください。');
      toast.error('ログインしてください。', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const draft = draftList.find(draft => draft.id === draftId);
    if (!draft || draft.user_id !== userId) {
      console.error('この投稿を削除する権限がありません。');
      toast.error('この投稿を削除する権限がありません。', {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(`/api/questions/drafts/${draftId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.statusText}`);
      }


      setDraftList(draftList.filter((draft) => draft.id !== id));
      toast.success('下書きを削除しました', {
        position: "top-center",
        autoClose: 2000,
      });
      fetchDrafts();

    } catch (err) {
      console.error('Error deleting draft:', err);
      toast.error('削除中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
    }finally {
      setLoading(false);
    }
  };

  // if (isLoading) return <p>読み込み中...</p>;

  return (
    <>
      <QuestionHeader style={{ display: 'none' }} />

      <div className="space-y-4 text-md mt-4">
        {draftList.length === 0 && !isLoading && (
          <p className='flex items-center justify-center text-lg'>下書きがありません。</p>
        )}


        {draftList.map((draft, index) => {
          const sanitizedDescription = DOMPurify.sanitize(draft.description);

          return (
            <div key={draft.id} className="mx-auto w-full sm:w-full lg:w-4/5">
              <Card
                key={draft.id}
                id={draft.id}
                type="drafts"
                title={draft.title}
                ownerId={draft.user_id}
                categoryId={draft.category_id}
                onRefresh={fetchDrafts}
                onEdit={() => onSelectDraft(draft)}
                onDelete={() => handleDeleteDraft(draft.id)}
                isResolved={false}
                showViewCount={false}
                isDraft={false}
              >

                <div className="flex flex-wrap mt-4">
                  {draft.tags?.map((tag, index) => (
                    <span key={index} className="bg-blue-500 text-white text-sm py-1 px-4 rounded-full mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <p className="label mt-4"></p>
                  <div
                    className={styles.questionBody}
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                </div>

                <div className="flex items-center my-4">
                  <div className="ml-2">
                  <UserNameDisplay userId={draft.user_id} />
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
                </div>
              </Card>
            </div>
          );
        })}

        <p className='my-4 w-4/5 text-sm text-center text-green-700'>
          ※ 編集ボタンを押すと、 下書きをコピーして編集することができます。
        </p>

      </div>
    </>
  );
}
