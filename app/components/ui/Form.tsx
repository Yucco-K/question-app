// pages/exampleForm.tsx
'use client';

import { useState } from 'react';
import InputField from '../ui/InputField';
import SelectDropdown from '../ui/SelectDropdown';
import Checkbox from '../ui/Checkbox';

export default function ExampleForm() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [newsletter, setNewsletter] = useState(false);
  const [status, setStatus] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, gender, newsletter, status });
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">フォーム</h2>

      <InputField
        label="名前"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前を入力"
      />

      <SelectDropdown
        label="ステータス"
        id="status"
        options={[
          { value: 'all', label: '全て' },
          { value: 'open', label: 'オープン' },
          { value: 'closed', label: 'クローズ' },
        ]}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />

      <Checkbox
        label="ニュースレターを受け取る"
        id="newsletter"
        checked={newsletter}
        onChange={(e) => setNewsletter(e.target.checked)}
      />

      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        送信
      </button>
    </form>
  );
}
