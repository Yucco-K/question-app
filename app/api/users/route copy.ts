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

      const { data: profile, error: profileError } = await supabase
      .from('User')
      .select('*')
      .eq('id', user.id)
      .single();

      if (profileError) {
        return NextResponse.json({ error: 'Profile not found', message: 'プロフィール情報が見つかりません。' }, { status: 404 });
      }

    return NextResponse.json({
      message: 'ユーザー情報を正常に取得しました。',
      userId: user.id,
      username: user.user_metadata.username,
      email: user.user_metadata.email,
      user }, { status: 200 });

  } catch (error) {
    console.error('ユーザー情報取得エラー:', error);
    return NextResponse.json({ error: 'Server Error', message: 'ユーザー情報の取得に失敗しました。再度お試しください。' }, { status: 500 });
  }
}
