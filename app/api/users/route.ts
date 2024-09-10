import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request) {
  const cookies = request.headers.get('cookie');

  if (!cookies) {
    return NextResponse.json({ error: 'Unauthorized', message: 'セッションが切れました。' }, { status: 401 });
  }

  const accessToken = cookies.split('; ').find(cookie => cookie.startsWith('access_token='));

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized', message: '認証情報が見つかりません。' }, { status: 401 });
  }

  const tokenValue = accessToken.split('=')[1];

  try {

    const { data: { user }, error } = await supabase.auth.getUser(tokenValue);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized', message: '認証に問題が発生しました。もう一度お試しください。' }, { status: 401 });
    }

    console.log('取得したユーザーID:', user.id);

    return NextResponse.json({ message: 'ユーザー情報を正常に取得しました。', userId: user.id, user }, { status: 200 });

  } catch (error) {
    console.error('ユーザー情報取得エラー:', error);
    return NextResponse.json({ error: 'Server Error', message: 'ユーザー情報の取得に失敗しました。再度お試しください。' }, { status: 500 });
  }
}
