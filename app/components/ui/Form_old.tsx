'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import supabase from '../../lib/supabaseClient';

interface FormProps {
  titleLabel: string;
  titlePlaceholder: string;
  bodyLabel: string;
  bodyPlaceholder: string;
  initialTitle: string;
  initialBody: string;
  onTitleChange: (newTitle: string) => void;
  onBodyChange: (newBody: string) => void;
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
}: FormProps) {

  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);

  // コンテンツのログ
  const logContent = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const [uploading, setUploading] = useState(false);  // アップロード状態管理

  // ファイルアップロード処理
  const handleFileUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();  // ファイル拡張子取得
    const fileName = `${Date.now()}.${fileExt}`;  // 一意なファイル名生成
    const filePath = `editor-uploads/${fileName}`;  // ファイルパス設定

    const { data, error } = await supabase.storage
      .from('attachment_files')  // ストレージバケット名
      .upload(filePath, file);

    if (error) {
      console.error('アップロードエラー:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('attachment_files')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  useEffect(() => {
    setTitle(initialTitle);
    setBody(initialBody);
  }, [initialTitle, initialBody]);

  useEffect(() => {
    logContent();
  }, []);

  // プレビューを手動で開く関数 // 変更点
  const openPreview = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePreview');
    }
  };

  return (
    <form className="max-w-[1400px] mx-auto">
      <div className="mb-4">
        <label className="block text-xl text-gray-600 font-semibold my-6">{titleLabel}<span className="text-sm text-gray-600">   ※ 必須 : 2文字以上入力してください。</span></label>
        <input
          type="text"
          placeholder={titlePlaceholder}
          // value={title}
          // onChange={(e) => setTitle(e.target.value)}
          value={initialTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:border-blue-600"
        />
      </div>
      <div className="mb-4">
        <label className="block text-xl text-gray-700 font-semibold my-6">{bodyLabel} <span className="text-sm text-gray-600">   ※ 必須 : 10文字以上入力してください。</span></label>
        <div className="border border-gray-300 text-l">
        <Editor
          apiKey='s2deuv7kapk0e6ioxt0okon8isbruiiqevexvh7r4ap7depu'
          init={{
            plugins: [
              // Core editing features
              'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
              // Your account includes a free trial of TinyMCE premium features
              // Try the most popular premium features until Sep 28, 2024:
              'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
            ],
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            mergetags_list: [
              { value: 'First.Name', title: 'First Name' },
              { value: 'Email', title: 'Email' },
            ],
            ai_request: (request: any, respondWith: any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
          }}
          initialValue="Welcome to TinyMCE!"
        />
        </div>
      </div>
    {/* プレビューを開くカスタムボタンの追加 // 変更点 */}
        <button type="button" onClick={openPreview} className="bg-blue-500 text-white px-4 py-2">
          プレビュー
        </button>
    </form>
  );
}
