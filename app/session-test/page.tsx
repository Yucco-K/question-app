"use client";

import { useState, useEffect, use } from 'react';

export default function Home() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const response = await fetch('/api/get-session', {
        credentials: 'include' // クッキーを送信するために 'include' を追加
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setSession(data.session);
      } else {
        console.log(data.error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    console.log('session:', session);
  }, [session]);


  return (
    <div>
      <h1>Supabase Session Test</h1>
      {session ? (
        <div>
          <p>セッションが存在します！</p>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      ) : (
        <p>ログインしていません</p>
      )}
    </div>
  );
}
