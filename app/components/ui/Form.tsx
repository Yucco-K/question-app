'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Notification from '../ui/Notification';


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
  const [showNotification, setShowNotification] = useState(false);

  const openPreview = () => {
    if (editorRef.current) {
      editorRef.current.execCommand('mcePreview'); // TinyMCEのプレビューコマンドを実行
    } else {
      console.error('エディターが初期化されていません');
      setError("エディターが初期化されていません");
      setShowNotification(true);
    }
  };

  // ファイルアップロード処理
  // const handleFileUpload = async (file: File) => {
  //   return new Promise(async (resolve, reject) => {
  //   const fileExt = file.name.split('.').pop();
  //   const fileName = `${Date.now()}.${fileExt}`;
  //   const filePath = `editor-uploads/${fileName}`;

  //   const { data, error } = await supabase.storage
  //     .from('attachment_files')
  //     .upload(filePath, file);

  //     if (error) {
  //       setLoading(false);
  //       reject(error);
  //       setError("ファイルのアップロードに失敗しました。");
  //       setShowNotification(true);
  //       console.error('アップロードエラー:', error.message);
  //       return;
  //     }

  //   const { data: publicUrlData } = supabase.storage
  //     .from('attachment_files')
  //     .getPublicUrl(filePath);

  //     const publicUrl = publicUrlData.publicUrl;

  //   const { error: insertError } = await supabase
  //     .from('File')
  //     .insert({
  //       name: file.name,
  //       url: publicUrl,
  //       fileType: file.type,  // ファイルのMIMEタイプ
  //     });

  //     if (insertError) {
  //       setLoading(false);
  //       reject(insertError);
  //       setError("Fileテーブルへの挿入に失敗しました。");
  //       setShowNotification(true);
  //       console.error('Fileテーブルへの挿入エラー:', insertError.message);
  //     } else {
  //       resolve(publicUrl);
  //       setLoading(false);
  //       setSuccess("ファイルのアップロードに成功しました！");
  //       setShowNotification(true);
  //     }

  //   return publicUrl;
  //   });
  // };

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
        setError('ファイルのアップロードに失敗しました');
        setShowNotification(true);
      } finally {
        setLoading(false);
      }
    }
      // if (file) {
      //   setLoading(true);

      //     const publicUrl = await handleFileUpload(file);
      //     if (publicUrl) {
      //       if (meta.filetype === 'image') {
      //         cb(publicUrl, { alt: file.name });
      //       } else if (meta.filetype === 'media') {
      //         cb(publicUrl, { title: file.name });
      //       }else{
      //         cb(publicUrl, { text: file.name });
      //     }
      //   }
      //   setLoading(false);
      // }
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
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ""}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
      <form className="max-w-[1400px] mx-auto">

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
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
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
        <button type="button" onClick={openPreview} className="bg-blue-500 text-white px-4 py-2">
            プレビュー
        </button>
      </form>
    </>
  );
}
