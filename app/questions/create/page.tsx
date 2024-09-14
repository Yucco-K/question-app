'use client';

import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import Form from '../../components/ui/Form';
import ButtonGroup from '../../components/ui/ButtonGroup'; // ButtonGroupをインポート

export default function CreatePage() {
  const [isModalOpen, setModalOpen] = useState(false);

  // ボタンのデータ
  const buttonData = [
    { label: 'プレビュー',
      className: 'bg-blue-800 text-white',
      onClick: () => console.log('プレビュー clicked'),
    },
    { label: '下書きに保存',
      className: 'bg-blue-800 text-white',
      onClick: () => console.log('下書きに保存 clicked'),
    },
    { label: '投稿',
      className: 'bg-blue-800 text-white',
      onClick: () => console.log('投稿 clicked'),
    },
  ];

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
      >
        {/* フォームの表示 */}
        <Form
          titleLabel="タイトル"
          titlePlaceholder="質問のタイトルを入力してください。"
          bodyLabel="本文"
          bodyPlaceholder="質問の本文を入力してください。"
          tagLabel="タグ"
          tagPlaceholder="追加するタグを検索できます。"
        />

        {/* ボタンを行ごとに表示 */}
        <div className="mx-auto w-1/2">
          <ButtonGroup
            pattern={3} // パターン番号を動的に指定
            buttons={buttonData} // ボタンデータ
            buttonsPerRow={[2,1]} // 1行目の個数、2行目の個数,3行目…を指定
          />
        </div>
      </Modal>
    </div>
  );
}
