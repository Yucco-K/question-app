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
import useAuth from '../../lib/useAuth';
import { useLoading } from '../../context/LoadingContext';
import { useRouter } from 'next/navigation';
import Category from '../ui/Category';
import { toast } from 'react-toastify';


interface QuestionFormProps {
  initialTitle: string;
  initialBody: string;
  initialTags: string[];
  onSubmit: (updatedTitle: string, updatedBody: string, updatedTags: string[]) => void;
  onCancel: () => void;
}


export default function QuestionForm({ initialTitle: propInitialTitle, initialBody: propInitialBody, initialTags: propInitialTags }: QuestionFormProps) {
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const router = useRouter();
  const [initialTitle, setInitialTitle] = useState<string>(propInitialTitle);
  const [initialBody, setInitialBody] = useState<string>(propInitialBody);
  const [initialTags, setInitialTags] = useState<string[]>(propInitialTags);
  const [draftListModalOpen, setDraftListModalOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isLoading, setLoading } = useLoading();
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [draftData, setDraftData] = useState<any>(null);
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

    if (!isLoading && !session) {
      console.error('ログインしてください。');
      toast.error('ログインしてください。', {
        position: "top-center",
        autoClose: 2000,
      });
      return false;
    }


    if (!initialTitle || initialTitle.trim() === '') {
      console.error('タイトルを入力してください');
      toast.error('タイトルを入力してください', {
        position: "top-center",
        autoClose: 2000,
      });
      return false;
    }

    if (!initialBody || initialBody.trim() === '') {
      console.error('本文を入力してください');
      toast.error('本文を入力してください', {
        position: "top-center",
        autoClose: 2000,
      });
      return false;
    }

    if (!initialTags || initialTags.length === 0) {
      console.error('タグを1つ以上指定してください');
      toast.error('タグを1つ以上指定してください', {
        position: "top-center",
        autoClose: 2000,
      });
      return false;
    }

    if (!selectedCategory || selectedCategory === "カテゴリを選択") {
      console.error('カテゴリを選択してください');
      toast.error('カテゴリを選択してください', {
        position: "top-center",
        autoClose: 2000,
      });
      return false;
    }

    return true;
  };


  const handleTitleChange = useCallback((newTitle: string) => {
    if (newTitle !== initialTitle) {
      setInitialTitle(newTitle);
    }
  }, [initialTitle]);

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


  const handleSubmit = async () => {

    setLoading(true);

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
          userId: userId,
          categoryId: selectedCategory,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message || '質問の投稿に失敗しました');
        toast.error('質問の投稿に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      toast.success('質問を投稿しました！', {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        handleResetForm();
        router.push(`/questions/${result.questionId}`);
      }, 1000);

    } catch (err) {
      console.error('送信中にエラーが発生しました');
      toast.error('送信中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
      console.error(err);

    } finally {
      setLoading(false);
    }
  };

  const handleDraftSubmit = async () => {

    setLoading(true);

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
          is_draft: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message || '下書きの保存に失敗しました');
        toast.error('下書きの保存に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
        setLoading(false);
        return;
      }

      setDrafts(result);

      toast.success('質問の下書きを保存しました！', {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        setDraftListModalOpen(true);
      }, 1000)

    } catch (err) {
      toast.error('送信中にエラーが発生しました', {
        position: "top-center",
        autoClose: 2000,
      });
      console.error('エラー内容:', err);
    }finally {
      setLoading(false);
    }
  };

  const handleSelectDraft = (draft: { title: string; description: string; tags: string[]; category_id: string }) => {


    setSelectedDraft({
      ...draft,
      category_id: draft.category_id,
    });
    setInitialTitle(draft.title);
    setInitialBody(draft.description);
    setInitialTags(draft.tags);
    setSelectedCategory(draft.category_id);
    setDraftListModalOpen(false);
  };

  const buttonData = [
    { label: '入力内容をリセット',
      className: 'bg-blue-800 text-white text-sm whitespace-nowrap',
      onClick: handleResetForm,
    },
    { label: '下書きに保存',
      className: 'bg-blue-800 text-white text-sm whitespace-nowrap',
      onClick: handleDraftSubmit,
    },
    { label: '投 稿',
      className: 'bg-blue-800 text-white text-sm whitespace-nowrap',
      onClick: handleSubmit,
    },
  ];

  useEffect(() => {
    if (selectedDraft) {
      setInitialTitle(selectedDraft.title);
      setInitialBody(selectedDraft.description);
      setInitialTags(selectedDraft.tags);
      setSelectedCategory(selectedDraft.category_id);
    }
  }, [selectedDraft]);

    const fetchDraftData = async (draftId: string) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/drafts/${draftId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch draft');
        }
        const data = await response.json();
        setDraftData(data);

        setInitialTitle(data.title);
        setInitialBody(data.description);
        setInitialTags(data.tags);
        setSelectedCategory(data.category_id);
      } catch (error) {
        console.error('データの取得に失敗しました');
        toast.error('データの取得に失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
      }finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (selectedDraftId) {
        fetchDraftData(selectedDraftId);
      }
    }, [selectedDraftId]);

    useEffect(() => {
      if (selectedDraft) {
        setInitialTags(selectedDraft.tags);
      }
    }, [selectedDraft]);

    useEffect(() => {
      if (selectedDraft && selectedDraft.tags) {

        setTimeout(() => {
          setInitialTags(selectedDraft.tags || []);
        }, 0);  // タグのセットを遅延させることで非同期の問題を回避
      }
    }, [selectedDraft]);


  return (
    <>
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

      <Modal
        isOpen={draftListModalOpen}
        onClose={() => {setDraftListModalOpen(false);
          router.push('/questions');
        }}
          title="下書きリスト">
          <DraftList onSelectDraft={handleSelectDraft} categoryId={selectedCategory ?? null} />
      </Modal>
      </div>

      <div className="mx-auto max-w-[1200px] ">

        <p className="guidance-message mx-auto my-10">
          問題の内容や環境、再現方法、コードを詳しく書いて、適切なタグを選んで投稿してください。
        </p>

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

      </div>

      <div className="mx-auto w-4/5">
        <TagInput
          key={selectedDraft.questionId}
          tagLabel="タグ"
          availableTags={availableTags}
          initialTags={initialTags}
          onTagsChange={handleTagsChange}
          isDraft={true}
        />
      </div>

      <div className="mx-auto w-1/2">
        <ButtonGroup
          pattern={3}
          buttons={buttonData}
          buttonsPerRow={[2,1]}
        />
      </div>
    </>
  );

}
