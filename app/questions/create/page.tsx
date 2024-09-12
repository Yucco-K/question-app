// app/questions/create/page.tsx
'use client';

import { useState } from 'react';
import Modal from '../../components/ui/Modal';

export default function CreatePage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ボタンをクリックしてモーダルを表示 */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setModalOpen(true)}
      >
        質問を投稿
      </button>

      {/* モーダルの表示 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="質問を投稿"
        buttons={[
          <button key="preview" className="px-4 py-2 bg-gray-300 rounded">プレビュー</button>,
          <button key="save" className="px-4 py-2 bg-blue-500 text-white rounded">下書きに保存</button>,
          <button key="submit" className="px-4 py-2 bg-blue-500 text-white rounded">投稿</button>
        ]}
      >
        <form>
          <div className="mb-4">
            <label className="block text-sm font-semibold">タイトル</label>
            <input
              type="text"
              placeholder="質問のタイトルを入力してください。"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">本文</label>
            <textarea
              placeholder="質問の本文を入力してください。"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">タグ</label>
            <input
              type="text"
              placeholder="追加するタグを検索できます。"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
