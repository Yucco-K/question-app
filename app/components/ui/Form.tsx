'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';


interface FormProps {
  titleLabel: string;
  titlePlaceholder: string;
  bodyLabel: string;
  bodyPlaceholder: string;
  initialTitle: string;
  initialBody: string;
  onTitleChange: (newTitle: string) => void;
  onBodyChange: (newBody: string) => void;
  showTitle?: boolean;
  onSubmit?: (title: string, body: string) => void;
  onCancel?: () => void;
  initialTags?: string;
  onTagsChange?: (tags: string) => void;
}

export default function Form({
  titleLabel,
  titlePlaceholder,
  bodyLabel,
  bodyPlaceholder,
  initialTitle,
  initialBody,
  onTitleChange,
  onBodyChange,
  showTitle = true,
  onSubmit,
  onCancel,
}: FormProps) {

  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [loading, setLoading] = useState(false);


  const openPreview = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePreview'); // TinyMCEのプレビューコマンドを実行
    } else {
      console.error('エディターが初期化されていません');
      toast.error('エディターが初期化されていません', {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };


  const filePickerCallback = (cb: any, value: any, meta: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');

    if (meta.filetype === 'image') {
      input.setAttribute('accept', 'image/*');
    } else if (meta.filetype === 'media') {
      input.setAttribute('accept', 'video/*');
    } else {
      input.setAttribute('accept', '*');
    }

    input.onchange = async () => {
      const file = input.files?.[0];

      if (file) {
        setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.publicUrl) {
          if (meta.filetype === 'image') {
            cb(result.publicUrl, { alt: file.name });
          } else if (meta.filetype === 'media') {
            cb(result.publicUrl, { title: file.name });
          } else {
            cb(result.publicUrl, { text: file.name });
          }
        } else {
          throw new Error(result.message || 'ファイルのアップロードに失敗しました');
        }
      } catch (error) {
        console.error('ファイルアップロードエラー:', error);
        toast.error('ファイルのアップロードに失敗しました', {
          position: "top-center",
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    }

    };
    input.click();
  };

  useEffect(() => {
    setTitle(initialTitle);
    setBody(initialBody);
  }, [initialTitle, initialBody]);

  useEffect(() => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  }, []);



  return (
    <>
      <form className="max-w-[1400px] mx-auto">
      {showTitle && (
        <div className="mb-4">
          <label className="block text-lg text-gray-600 font-semibold mb-6 mt-10">
            {titleLabel}
            <span className="text-sm text-gray-600">   ※ 必須 </span>
          </label>
          <input
            type="text"
            placeholder={titlePlaceholder}
            value={title}
            onChange={(e) => {
              const newTitle = e.target.value;
              setTitle(newTitle);
              onTitleChange(newTitle);
            }}
            className="w-full border border-gray-300 px-3 py-2 text-md focus:outline-none focus:border-blue-600"
          />
        </div>
      )}
        <div className="mb-4">
          <label className="block text-lg text-gray-700 font-semibold mb-6 mt-10">
            {bodyLabel}
            <span className="text-sm text-gray-600">   ※ 必須 </span>
          </label>
          <div className="border border-gray-300 text-lg">
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={body}
              onEditorChange={(content) => {
                setBody(content);
                onBodyChange(content);
              }}
              init={{
                height: 1200,
                placeholder: bodyPlaceholder,
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:18px }',
                plugins: [
                  "advlist", "anchor", "autolink", "charmap", "code", "fullscreen",'insertdatetime',
                  "help", "image", "insertdatetime", "link", "autolink", "lists","advlist", "media","emoticons",
                  "preview", "searchreplace", "table", "visualblocks", "accordion",'autoresize','charmap','code','codesample','fullscreen','help','importcss',
                ],
                toolbar: "undo redo |link image media accordion | bold italic underline strikethrough | align | bullist numlist | anchor | restoredraft | charmap | code codesample | emoticons | fullscreen | help | insertdatetime",
                table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                image_uploadtab: true,
                image_caption: true,
                images_reuse_filename: true,
                image_advtab: true,  // 画像の詳細設定タブを有効にする
                image_title: true,
                file_picker_callback: filePickerCallback,
                media_live_embeds: true,
                media_alt_source: false,  // 動画用の代替ソースを無効にする
                link_default_target: '_blank',
                fullscreen_native: true,
              }}
            />
          </div>
        </div>
        <button type="button" onClick={openPreview} className="bg-blue-500 text-white text-sm px-4 py-2">
            プレビュー
        </button>
      </form>
    </>
  );
}
