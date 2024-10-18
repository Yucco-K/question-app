import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';
import { extractTokensFromCookie } from '@/app/api/auth/utils';


export async function GET(request: Request) {
  const cookies = request.headers.get('cookie');

  if (!cookies) {
    return NextResponse.json({ error: 'Unauthorized', message: 'セッションが切れました。' }, { status: 401 });
  }

  const { accessToken, refreshToken } = extractTokensFromCookie(cookies);

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'Unauthorized', message: 'トークンが見つかりません。' }, { status: 401 });
  }

  try {

    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError || !sessionData.session) {
      return NextResponse.json({ error: 'セッションが見つかりません' }, { status: 401 });
    }

    const session = sessionData.session;

    const { data: profileData, error: profileError } = await supabase
      .from('User')
      .select('profileImage')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json({ error: 'Profile not found', message: 'プロフィール情報が見つかりません。' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'ユーザー情報を正常に取得しました。',
      session,
      userId: session.user.id,
      username: session.user.user_metadata.username,
      email: session.user.email,
      profileImage: profileData.profileImage,
    }, { status: 200 });

  } catch (error) {
    console.error('セッションの取得エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー', message: 'セッションの取得に失敗しました。' }, { status: 500 });
  }
}
