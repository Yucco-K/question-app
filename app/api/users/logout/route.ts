import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function POST() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: 'Server Error', message: error.message }, { status: 500 });
  }

  const response = NextResponse.json({ message: 'ログアウトしました。' });

  response.cookies.set('access_token', '', { path: '/', maxAge: -1 });
  response.cookies.set('refresh_token', '', { path: '/', maxAge: -1 });

  return response;
}
