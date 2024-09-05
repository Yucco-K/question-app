import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function POST(request: Request) {
  const { usernameOrEmail, password } = await request.json();

  const { data, error } = await supabase.auth.signInWithPassword({ email: usernameOrEmail, password });

  if (error) {
    console.error('Login error:', error.message);
    return NextResponse.json({ error: 'Unauthorized', message: error.message }, { status: 401 });
  }

  const accessToken = data.session?.access_token;
  const refreshToken = data.session?.refresh_token;

  if (accessToken && refreshToken) {
    const response = NextResponse.json({ message: 'Logged in successfully' });
    response.cookies.set('access_token', accessToken, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'none',
      secure: false,
    });
    response.cookies.set('refresh_token', refreshToken, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'none',
      secure: false,
    });
    return response;
  }

  console.error('Failed to save tokens');
  return NextResponse.json({ error: 'Server Error', message: 'トークンの保存に失敗しました。' }, { status: 500 });
}
