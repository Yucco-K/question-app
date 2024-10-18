"use client";

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log({ name, email, message });

    setSubmitted(true);

    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative top-6">
      <div className="w-full max-w-xl mx-auto px-6 py-8 bg-white shadow-lg rounded-lg absolute">
        <h1 className="text-3xl font-bold text-center mb-6">CONTACT</h1>
        <p className="text-center text-gray-600 mb-8">お問い合わせ</p>

        <div className="bg-gray-100 text-gray-900 p-4 mb-6 text-center font-semibold">
          ※このページはダミーページです
        </div>

        {submitted ? (
          <p className="text-green-500 text-lg font-semibold text-center mb-6">お問い合わせが送信されました。ありがとうございます！</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                お名前
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="お名前"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="メールアドレス"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                お問い合わせ内容
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="お問い合わせ内容を入力してください"
                rows={5}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-700 transition duration-300"
            >
              送信する
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <h2 className="text-sm font-semibold">メールアドレス</h2>
          <p className="text-gray-700">support@engineers Q&A board.com</p>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-sm font-semibold">電話番号</h2>
          <p className="text-gray-700">+81 123 456 789</p>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-sm font-semibold">住所</h2>
          <p className="text-gray-700">〒123-4567 東京都△△区1-2-3</p>
        </div>
      </div>
    </div>
  );
}
