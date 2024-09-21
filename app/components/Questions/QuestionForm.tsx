'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Form from '../ui/Form';
import DraftList from './DraftList';
import ButtonGroup from '../ui/ButtonGroup';
import TagInput from '../ui/TagInput';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../ui/Modal';
import Notification from '../ui/Notification';
import { useUser } from '../../context/UserContext';
import { useLoading } from '../../context/LoadingContext';
import { set } from 'lodash';

export default function QuestionForm() {
  const { userId } = useUser();
  const [isDraftModalOpen, setDraftModalOpen] = useState(false);
  const [drafts, setDrafts] = useState<{ questionId: string, title: string, description: string, tags: string[] }[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<{ questionId?: string, title: string, description: string, tags: string[] }>({
    questionId: undefined,
    title: '',
    description: '',
    tags: []
  });

  const [initialTitle, setInitialTitle] = useState('');
  const [initialBody, setInitialBody] = useState('');
  const [initialTags, setInitialTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const { isLoading, setLoading } = useLoading();


  const handleResetForm = () => {
    setInitialTitle('');
    setInitialBody('');
    setInitialTags([]);
  };

  const handleTitleChange = (newTitle: string) => {
    setInitialTitle(newTitle);
  };

  const handleBodyChange = useCallback((newBody: string) => {
    if (newBody !== initialBody) {
      setInitialBody(newBody);
    }
  }, [initialBody]);


  const handleTagsChange = (newTags: string[]) => {
    setInitialTags(newTags);
  };

  const handleSubmit = async () => {

    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowNotification(false);

    if (!initialTitle) {
      setError('タイトルを入力してください');
      setShowNotification(true);
      return;
    }

    if (!initialBody) {
      setError('本文を入力してください');
      setShowNotification(true);
      return;
    }

    if (!initialTags || initialTags.length === 0) {
      setError('タグを1つ以上指定してください');
      setShowNotification(true);
      return;
    }

    const uploadedFiles: any[] = [];

    try {

      const files: { file: File }[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file.file); // file.fileにBlobが格納されていると想定

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok && uploadResult.publicUrl) {
          uploadedFiles.push({
            name: file.file.name,
            url: uploadResult.publicUrl,
            fileType: file.file.type,
          });
        }
      }

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: initialTitle,
          description: initialBody,
          tags: initialTags,
          uploadedFiles,
          userId: userId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || '質問の投稿に失敗しました');
        setShowNotification(true);
        return;
      }

      setSuccess('質問を投稿しました！');
      setShowNotification(true);
      handleResetForm();

    } catch (err) {
      setError('送信中にエラーが発生しました');
      setShowNotification(true);
      console.error(err);
    }finally {
      setLoading(false);
    };
  }


  const handleDraftSubmit = async () => {

    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowNotification(false);

    if (!initialTitle) {
      setError('タイトルを入力してください');
      setShowNotification(true);
      return;
    }

    if (!initialBody) {
      setError('本文を入力してください');
      setShowNotification(true);
      return;
    }

    if (!initialTags || initialTags.length === 0) {
      setError('タグを1つ以上指定してください');
      setShowNotification(true);
      return;
    }

    const uploadedFiles: any[] = [];

    try {
      const files: { file: File }[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file.file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok && uploadResult.publicUrl) {
          uploadedFiles.push({
            name: file.file.name,
            url: uploadResult.publicUrl,
            fileType: file.file.type,
          });
        }
      }

      const response = await fetch('/api/questions/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: initialTitle,
          description: initialBody,
          tags: initialTags,
          uploadedFiles,
          userId: userId,
          is_draft: true,  // is_draft を true に設定
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || '下書きの保存に失敗しました');
        setShowNotification(true);
        return;
      }

      setSuccess('質問の下書きが保存されました！');
      setShowNotification(true);
      handleResetForm();

    } catch (err) {
      setError('送信中にエラーが発生しました');
      setShowNotification(true);
      console.error(err);
    }finally {
      setLoading(false);
    }
  };


  const handleSelectDraft = (draft: { title: string; description: string; tags: string[] }) => {
    setSelectedDraft(draft);
    console.log('Selected draft:', draft);
    setInitialTitle(draft.title);
    setInitialBody(draft.description);
    setInitialTags(draft.tags);
    setDraftModalOpen(false);
  };

  const buttonData = [
    { label: '入力内容をリセット',
      className: 'bg-blue-800 text-white',
      onClick: handleResetForm,
    },
    { label: '下書きに保存',
      className: 'bg-blue-800 text-white',
      onClick: handleDraftSubmit,
    },
    { label: '投 稿',
      className: 'bg-blue-800 text-white',
      onClick: handleSubmit,
    },
  ];

  useEffect(() => {
    if (selectedDraft) {
      setInitialTitle(selectedDraft.title);
      setInitialBody(selectedDraft.description);
      setInitialTags(selectedDraft.tags);
    }
  }, [selectedDraft]);

  // useEffect(() => {
  //   if (isDraftModalOpen && selectedDraft) {
  //     setInitialTitle(selectedDraft.title);
  //     setInitialBody(selectedDraft.description);
  //     setInitialTags(selectedDraft.tags);
  //   }
  // }, [isDraftModalOpen, selectedDraft]);

  return (
    <>
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className="container mx-auto px-4 py-8 relative">
        {!isDraftModalOpen && (
          <div className="absolute top-5 right-20 flex items-center space-x-2 z-[100]">
            <button
              className="text-blue-800 hover:underline flex items-center"
              onClick={() => setDraftModalOpen(true)}
            >
              <span>下書きリスト</span>
              <FontAwesomeIcon icon={faFileAlt} className="ml-2 text-xl" />
            </button>
          </div>
        )}

        <Modal isOpen={isDraftModalOpen} onClose={() => setDraftModalOpen(false)} title="下書きリスト">
          <DraftList onSelectDraft={handleSelectDraft} />
        </Modal>
      </div>
      <p className="guidance-message max-w-[1400px] mx-auto">
        問題の内容や環境、再現方法、コードを詳しく書いて、適切なタグを選んで投稿してください。
      </p>
      <Form
        titleLabel="タイトル"
        titlePlaceholder="質問のタイトルを入力してください。"
        bodyLabel="本文"
        bodyPlaceholder="質問の本文を入力してください。"
        initialTitle={initialTitle}
        initialBody={initialBody}
        onTitleChange={handleTitleChange}
        onBodyChange={handleBodyChange}
      />
      <p>initialTitle:{initialTitle}</p>
      <p>initialBody:{initialBody}</p>
      <TagInput
        tagLabel="タグ"
        tagPlaceholder="追加するタグを検索できます。"
        suggestions={['JavaScript', 'TypeScript', 'React', 'CSS', 'Next.js', 'HTML']} // オートコンプリートの例
        initialTags={initialTags}
        onTagsChange={handleTagsChange}
      />
      <p>initialTags:{initialTags}</p>
      <div className="mx-auto w-1/2">
        <ButtonGroup
          pattern={3} // パターン番号を動的に指定
          buttons={buttonData}
          buttonsPerRow={[2,1]} // 1行目の個数、2行目の個数,3行目…を指定
        />
      </div>
    </>
  );

}
