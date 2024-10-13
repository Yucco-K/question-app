'use client';

import { useEffect, useState } from 'react';
import styles from './QuestionList.module.css';
import { useLoading } from '../../context/LoadingContext';
import useAuth from '@/app/lib/useAuth';
import { useRouter } from 'next/navigation';
import Notification from '../ui/Notification';
import Card from '../ui/Card';
import DOMPurify from 'dompurify';
import UserNameDisplay from '../profile/UserNameDisplay';
import { useUser } from '@/app/context/UserContext';
import { set } from 'lodash';


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
  const router = useRouter();
  const { session, loading } = useAuth();
  const { userId } = useUser();


  const fetchDrafts = async () => {

    if (!loading && !session) {
      setError('ログインが必要です。');
      setShowNotification(true);
      router.push('/users/login');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {

      const url = `/api/questions/drafts?userId=${userId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('下書きの取得に失敗しました');
      }

      const data = await response.json();
      setDraftList(data);

    } catch (err) {
      setError('データの取得中にエラーが発生しました');
      console.error('Error fetching drafts:', err);

    } finally {
      setLoading(false);
      setDraftId(null);
      setShowNotification(true);
    }
  };


  useEffect(() => {
    if (session) {
      fetchDrafts();
    }
  }, [categoryId, session, loading, router]);


  const handleDeleteDraft = async (id: string) => {

    const draftId = id;

    if (!userId) {
      setError('ログインしてください。');
      setShowNotification(true);
      return;
    }

    const draft = draftList.find(draft => draft.id === draftId);
    if (!draft || draft.user_id !== userId) {
      setError('この投稿を削除する権限がありません。');
      setShowNotification(true);
      return;
    }

    try {

      setError(null);
      setSuccess(null);
      setShowNotification(false);
      setLoading(true);

      const response = await fetch(`/api/questions/drafts/${draftId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.statusText}`);
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
            <div key={draft.id} className="my-5 mx-auto w-4/5">
              <Card
                key={draft.id}
                title={draft.title}
                ownerId={draft.user_id}
                categoryId={draft.category_id}
                onRefresh={fetchDrafts}
                className="relative"
                onEdit={() => onSelectDraft(draft)}
                onDelete={() => handleDeleteDraft(draft.id)}
                isResolved={false}
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
                    <span key={index} className="bg-blue-500 text-white text-sm py-1 px-4 rounded-full mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center mt-4">
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
      </div>
    </>
  );
}
