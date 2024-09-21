'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const openPreview = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePreview'); // TinyMCEのプレビューコマンドを実行
    } else {
      console.error('エディターが初期化されていません');
    }
  };

  // ファイルアップロード処理
  const handleFileUpload = async (file: File) => {
    return new Promise(async (resolve, reject) => {
    const fileExt = file.name.split('.').pop();  // ファイル拡張子取得
    const fileName = `${Date.now()}.${fileExt}`;  // 一意なファイル名生成
    const filePath = `editor-uploads/${fileName}`;  // ファイルパス設定

    const { data, error } = await supabase.storage
      .from('attachment_files')  // ストレージバケット名
      .upload(filePath, file);

      if (error) {
        setLoading(false);
        reject(error);  // エラーが発生した場合、Promiseを拒否
        setError("ファイルのアップロードに失敗しました。");
        console.error('アップロードエラー:', error.message);
        return;
      }

    const { data: publicUrlData } = supabase.storage
      .from('attachment_files')
      .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase
      .from('File')
      .insert({
        name: file.name,
        url: publicUrl,
        fileType: file.type,  // ファイルのMIMEタイプ
      });

      if (insertError) {
        setLoading(false);
        reject(insertError);  // 挿入エラーが発生した場合、Promiseを拒否
        setError("Fileテーブルへの挿入に失敗しました。");
        console.error('Fileテーブルへの挿入エラー:', insertError.message);
      } else {
        resolve(publicUrl);  // 成功した場合、Promiseを解決
        setLoading(false);
        setSuccess("ファイルのアップロードに成功しました！");
      }

    return publicUrl;
    });
  };

  const filePickerCallback = (cb: any, value: any, meta: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    if (meta.filetype === 'image') {
      input.setAttribute('accept', 'image/*');
    } else if (meta.filetype === 'media') {
      input.setAttribute('accept', 'video/*');
    // } else if (meta.filetype === 'file') {
    //   input.setAttribute('accept', '*');
    }

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        setLoading(true);
        const publicUrl = await handleFileUpload(file);
        if (publicUrl) {
          if (meta.filetype === 'image') {
            cb(publicUrl, { alt: file.name });
          } else if (meta.filetype === 'media') {
            cb(publicUrl, { title: file.name });
          }
        }
        setLoading(false);
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
    <form className="max-w-[1400px] mx-auto">
    {/* {loading && (
      <div className="fixed top-50 left-1000 flex items-center">
        <p className="text-blue-500">動画をロードしています...</p>
        <Spinner />
      </div>
    )} */}
      <div className="mb-4">
        <label className="block text-xl text-gray-600 font-semibold my-6">
          {titleLabel}
          <span className="text-sm text-gray-600">   ※ 必須 : 2文字以上入力してください。</span>
        </label>
        <input
          type="text"
          placeholder={titlePlaceholder}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:border-blue-600"
        />
      </div>
      <div className="mb-4">
        <label className="block text-xl text-gray-700 font-semibold my-6">
          {bodyLabel}
          <span className="text-sm text-gray-600">   ※ 必須 : 10文字以上入力してください。</span>
        </label>
        <div className="border border-gray-300 text-l">
          {/* {loading ? (
            <div className="loading-indicator">
              <p>動画をロードしています...</p>
              <Spinner />
            </div>
          ):( */}
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={body}
              // onEditorChange={(newContent) => onBodyChange(newContent)}
              init={{
                height: 800,
                placeholder: bodyPlaceholder,
                plugins: [
                  'preview','accordion','anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                ],
                toolbar: 'undo redo |accordion | preview | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                menubar: false,
                image_uploadtab: true,
                image_caption: true,
                images_reuse_filename: true,
                image_advtab: true,  // 画像の詳細設定タブを有効にする
                image_title: true,  // 画像のタイトルを有効にする
                file_picker_callback: filePickerCallback,
                media_live_embeds: true,  // 動画埋め込みを有効にする
                media_alt_source: false,  // 動画用の代替ソースを無効にする
                link_assume_external_targets: true,  // リンクを新しいタブで開く
              }}
            />
          {/* )} */}
        </div>
      </div>
      <button type="button" onClick={openPreview} className="bg-blue-500 text-white px-4 py-2">
          プレビュー
      </button>
    </form>
  );
}
