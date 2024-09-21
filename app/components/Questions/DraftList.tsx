'use client';

import { useEffect, useState } from 'react';
import Notification from '../ui/Notification';
import DOMPurify from 'dompurify';
import styles from './QuestionList.module.css';
import Card from '../ui/Card';
import { useLoading } from '../../context/LoadingContext';
import { set } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

interface DraftItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  user_id: string;
  className?: string;
  onClick?: () => void;
}

interface DraftListProps {
  onSelectDraft: (draft: DraftItem) => void;
}

export default function DraftList({ onSelectDraft }: DraftListProps) {
  const [draftList, setDraftList] = useState<DraftItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {

    setError(null);
    setSuccess(null);
    setShowNotification(false);
    setLoading(true);

    const fetchDrafts = async () => {
      try {
        const response = await fetch('/api/questions/drafts');
        if (!response.ok) {
          throw new Error('下書きの取得に失敗しました');
        }
        const data = await response.json();
        setDraftList(data);
        console.log(data);
        console.log(draftList);

      } catch (err) {
        setError('データの取得中にエラーが発生しました');
        setShowNotification(true);

      }finally {
      setLoading(false);
    }
  };

    fetchDrafts();
  }, []);

  const handleDeleteDraft = async (id: string) => {
    console.log('Deleting draft with ID:', id);

    setError(null);
    setSuccess(null);
    setShowNotification(false);
    setLoading(true);

    try {
      const response = await fetch(`/api/questions/drafts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('下書きの削除に失敗しました');
      }

      setDraftList(draftList.filter((draft) => draft.id !== id));
      setSuccess('下書きを削除しました');
      setShowNotification(true);

    } catch (err) {
      setError('削除中にエラーが発生しました');
      setShowNotification(true);

    }finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ''}
          type={error ? 'error' : 'success'}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="space-y-4">
        {draftList.length === 0 && !isLoading && (
          <p className='flex items-center justify-center text-lg'>下書きがありません。</p>
        )}

        {draftList.map((draft, index) => {
          const sanitizedDescription = DOMPurify.sanitize(draft.description);
          return (
            <Card
              key={draft.id}
              title={`質問: ${draft.title}`}
              className="relative"
              // onClick={() => {
              //   onSelectDraft(draft);
              //   console.log('Draft selected:', draft);
              // }}

            >

              <div>
                <p className="label">質問内容:</p>
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
                    作成日：
                    {draft.created_at ? (
                      new Date(draft.created_at).toLocaleString()
                    ) : (
                      '作成日登録なし'
                    )}
                </p>
                </div>

                <button
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
                </button>

              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
