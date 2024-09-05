// app/page.tsx
'use client';

import LogoutButton from './components/Auth/LogoutButton';

export default function TopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Welcome to the Question Board</h1>
      <p className="text-center text-lg text-gray-700 mb-4">
        Explore questions and answers, share your knowledge, and learn from others.
      </p>
      <div className="flex justify-center">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          onClick={() => alert('Explore Questions!')}
        >
          Explore Questions
        </button>
      </div>
    </div>
  );
}
