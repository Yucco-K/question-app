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
import { useRouter } from 'next/navigation';
import Category from '../ui/Category';

export default function QuestionForm() {
  const { userId } = useUser();
  const router = useRouter();
  const [initialTitle, setInitialTitle] = useState('');
  const [initialBody, setInitialBody] = useState('');
  const [initialTags, setInitialTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [draftListModalOpen, setDraftListModalOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isLoading, setLoading } = useLoading();
    // ▼ 追加: 下書きIDと下書きデータの状態を追跡する
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null); // 追加
  const [draftData, setDraftData] = useState<any>(null); // 追加
  const [drafts, setDrafts] = useState<{ questionId: string, title: string, description: string, tags: string[],category_id: string }[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<{ questionId?: string, title: string, description: string, tags: string[], category_id: string }>({
    questionId: undefined,
    title: '',
    description: '',
    tags: [],
    category_id: '',
  });


  const handleResetForm = () => {
    setInitialTitle('');
    setInitialBody('');
    setInitialTags([]);
    setSelectedCategory(null);
  };


  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch('/api/tags');
      const data = await response.json();
      setAvailableTags(data);
    };

    fetchTags();
  }, []);


  const validateForm = () => {
    if (!initialTitle || initialTitle.trim() === '') {
      setError('タイトルを入力してください');
      setShowNotification(true);
      return false;
    }

    if (!initialBody || initialBody.trim() === '') {
      setError('本文を入力してください');
      setShowNotification(true);
      return false;
    }

    if (!initialTags || initialTags.length === 0) {
      setError('タグを1つ以上指定してください');
      setShowNotification(true);
      return false;
    }

    if (!selectedCategory || selectedCategory === "カテゴリを選択") {
      setError('カテゴリを選択してください');
      setShowNotification(true);
      return false;
    }

    return true;
  };


  const handleTitleChange = useCallback((newTitle: string) => {
    if (newTitle !== initialTitle) {
      setInitialTitle(newTitle);
    }
  }, [initialTitle]);

  console.log('initialTitle:', initialTitle);

  const handleBodyChange = useCallback((newBody: string) => {
    if (newBody !== initialBody) {
      setInitialBody(newBody);
    }
  }, [initialBody]);

  const handleTagsChange = (newTags: string[]) => {
    setInitialTags(newTags);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };


  // const handleTagsChange = (newTags: string[]) => {
  //   const trimmedTags = newTags.map(tag => tag.trim()).filter(tag => tag !== '');
  //   setInitialTags(trimmedTags);
  //   if (question) {
  //     setQuestion({
  //       ...question,
  //       tags: trimmedTags.map(tag => ({ id: tag, name: tag })),
  //     });
  //   }
  // console.log('initialTags:', initialTags);
  // console.log('question:', question);
  // console.log('送信するタグ:', question?.tags.map(tag => tag.name));
  // };


  const handleSubmit = async () => {

    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowNotification(false);

    // if (!userId) {
    //   setError('ログインしてください。');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }

    // if (!initialTitle) {
    //   setError('タイトルを入力してください');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }

    // if (!initialBody) {
    //   setError('本文を入力してください');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }

    // if (!initialTags || initialTags.length === 0) {
    //   setError('タグを1つ以上指定してください');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }

    // if (!selectedCategory) {
    //   setError('カテゴリを選択してください');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }


    const uploadedFiles: any[] = [];

    if (!validateForm()) {
      setLoading(false);
      return;
    }

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
          // uploadedFiles,
          userId: userId,
          categoryId: selectedCategory,
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

      setTimeout(() => {
        handleResetForm();
        router.push(`/questions/${result.questionId}`);
      }, 1000);

    } catch (err) {
      setError('送信中にエラーが発生しました');
      setShowNotification(true);
      console.error(err);

    } finally {
      setLoading(false);
    }
  };

  const handleDraftSubmit = async () => {

    setLoading(true);
    setError(null);
    setSuccess(null);
    setShowNotification(false);

        // if (!userId) {
    //   setError('ログインしてください。');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }

    // if (!initialTitle) {
    //   setError('タイトルを入力してください');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }

    // if (!initialBody) {
    //   setError('本文を入力してください');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }

    // if (!initialTags || initialTags.length === 0) {
    //   setError('タグを1つ以上指定してください');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }

    // if (!selectedCategory) {
    //   setError('カテゴリを選択してください');
    //   setShowNotification(true);
    //   setLoading(false);
    //   return;
    // }

    const uploadedFiles: any[] = [];

    if (!validateForm()) {
      setLoading(false);
      return;
    }

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
          categoryId: selectedCategory,
          userId: userId,
          is_draft: true,  // is_draft を true に設定
        }),
      });

      const result = await response.json();
      console.log('レスポンス内容:', result);

      if (!response.ok) {
        setError(result.message || '下書きの保存に失敗しました');
        setShowNotification(true);
        setLoading(false);
        return;
      }

      console.log('Fetched Drafts:', result);
      setDrafts(result);

      setSuccess('質問の下書きが保存されました！');
      setShowNotification(true);

      setTimeout(() => {
        setDraftListModalOpen(true);
      }, 1000)

    } catch (err) {
      setError('送信中にエラーが発生しました');
      setShowNotification(true);
      console.error('エラー内容:', err);
    }finally {
      setLoading(false);
    }
  };

  const handleSelectDraft = (draft: { title: string; description: string; tags: string[]; category_id: string }) => {

    // setInitialTags([]);  // タグを一度リセット

    setSelectedDraft({
      ...draft,
      category_id: draft.category_id,
    });
    console.log('Selected draft:', draft);
    setInitialTitle(draft.title);
    setInitialBody(draft.description);
    setInitialTags(draft.tags);
    console.log('Draft tags:', draft.tags);
    setSelectedCategory(draft.category_id);
    console.log('draft.category:', draft.category_id);
    console.log('selectedCategory:', selectedCategory);
    console.log('initialTags:', initialTags);
    console.log('draft.tags:', draft.tags);
    setDraftListModalOpen(false);
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
      setSelectedCategory(selectedDraft.category_id);
      console.log('selectedDraft:', selectedDraft);
      console.log('initialTags:', initialTags);
    }
  }, [selectedDraft]);

    // ▼ 追加: 下書きデータをDBからフェッチする関数
    const fetchDraftData = async (draftId: string) => {
      try {
        const response = await fetch(`/api/drafts/${draftId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch draft');
        }
        const data = await response.json();
        setDraftData(data);

        // ▼ 下書きデータをフォームに反映
        setInitialTitle(data.title);
        setInitialBody(data.description);
        setInitialTags(data.tags);
        setSelectedCategory(data.category_id);
      } catch (error) {
        setError('データの取得に失敗しました');
      }
    };

    // ▼ 追加: 下書きIDが選択されたときにフェッチをトリガー
    useEffect(() => {
      if (selectedDraftId) {
        fetchDraftData(selectedDraftId);
      }
    }, [selectedDraftId]);

    useEffect(() => {
      if (selectedDraft) {
        setInitialTags(selectedDraft.tags);
        console.log('selectedDraft tags:', selectedDraft.tags);  // タグが正しく反映されているか確認
        console.log('initialTags before render:', initialTags);  // initialTags の状態を確認
      }
    }, [selectedDraft]);

    useEffect(() => {
      if (selectedDraft && selectedDraft.tags) {
        // 非同期処理が完了した後に initialTags を設定
        setTimeout(() => {
          setInitialTags(selectedDraft.tags || []);
          console.log('initialTags after setting:', selectedDraft.tags);  // タグが正しく反映されているか確認
        }, 0);  // タグのセットを遅延させることで非同期のズレを防ぐ
      }
    }, [selectedDraft]);



    // useEffect(() => {
    //   if (selectedDraft) {
    //     setInitialTitle(selectedDraft.title);
    //     setInitialBody(selectedDraft.description);
    //     setInitialTags(selectedDraft.tags);
    //     setSelectedCategory(selectedDraft.category_id);
    //   }
    // }, [selectedDraft]);


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
        {!draftListModalOpen && (
          <div className="absolute top-5 right-20 flex items-center space-x-2 z-[100]">
            <button
              className="text-blue-800 hover:underline flex items-center"
              onClick={() => setDraftListModalOpen(true)}
            >
              <span>下書きリスト</span>
              <FontAwesomeIcon icon={faFileAlt} className="ml-2 text-xl" />
            </button>
          </div>
        )}

      <Modal isOpen={draftListModalOpen} onClose={() => setDraftListModalOpen(false)} title="下書きリスト">
        <DraftList onSelectDraft={handleSelectDraft} categoryId={selectedCategory ?? null} />
      </Modal>
      </div>

      <p className="guidance-message max-w-[1400px] mx-auto my-10">
        問題の内容や環境、再現方法、コードを詳しく書いて、適切なタグを選んで投稿してください。
      </p>

      {/* <Category onSelect={handleCategoryChange} onCategorySelect={handleCategoryChange} /> */}
      <Category
        onSelect={handleCategoryChange}
        onCategorySelect={handleCategoryChange}
        initialCategoryId={selectedCategory}
      />


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

      <TagInput
        key={selectedDraft.questionId}  // ここで selectedDraft.questionId を key に設定
        tagLabel="タグ"
        availableTags={availableTags}
        initialTags={initialTags}
        onTagsChange={handleTagsChange}
      />

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
