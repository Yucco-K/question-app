'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import TagInput from './TagInput';
import dynamic from 'next/dynamic';


interface FormProps {
  titleLabel: string;
  titlePlaceholder: string;
  bodyLabel: string;
  bodyPlaceholder: string;
  tagLabel: string;
  tagPlaceholder: string;
}

export default function Form({
  titleLabel,
  titlePlaceholder,
  bodyLabel,
  bodyPlaceholder,
  tagLabel,
  tagPlaceholder,
}: FormProps) {
  // const quillRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  const QuillNoSSRWrapper = dynamic(() => import('react-quill'), { ssr: false });

  useEffect(() => {
    let quillInstance: Quill | undefined;


    if (typeof window !== 'undefined' && quillRef.current && !(quillRef.current as any).__quill) {
      quillInstance = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
          ],
        },
      });
      (quillRef.current as any).__quill = quillInstance;

      const editor = quillRef.current.querySelector('.ql-editor') as HTMLElement;
      if (editor) {
        editor.style.height = '400px'; // 高さを400pxに設定
        editor.style.fontSize = '1.25rem'; // フォントサイズを大きく設定
      }
    }

    // クリーンアップ処理
    return () => {
      if (quillInstance) {
        quillInstance.off('text-change');
        (quillInstance as any).root.innerHTML = ''; // エディタの内容をクリア
      }
    };
  }, []);

  return (
    <form>
      <div className="mb-4">
        <label className="block text-sm font-semibold">{titleLabel}</label>
        <input
          type="text"
          placeholder={titlePlaceholder}
          className="w-full border px-3 py-2 text-lg" // 文字サイズを大きく
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold">{bodyLabel}</label>
        <div ref={quillRef} className="w-full border overflow-auto"></div> {/* Quillエディタ */}
      </div>
      <TagInput tagLabel={tagLabel} tagPlaceholder={tagPlaceholder} />
      {/* <div>
        <label className="block text-sm font-semibold">{tagLabel}</label>
        <textarea
          placeholder={tagPlaceholder}
          className="w-full border px-3 py-4 mb-6 text-lg"
          style={{ height: '400px', fontSize: '1.25rem' }} // 高さと文字サイズを設定
          rows={10} // 初期の高さ設定
        ></textarea>
      </div> */}
    </form>
  );
}
