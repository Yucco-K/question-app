import supabase from '@/app/lib/supabaseClient';
import { NextResponse } from 'next/server';
import { extractTokensFromCookie } from '@/app/api/auth/utils';

export async function GET(request: Request) {

  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return NextResponse.json({ error: 'クッキーがありません' }, { status: 401 });
  }

  const { accessToken, refreshToken } = extractTokensFromCookie(cookieHeader);

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'トークンが見つかりません' }, { status: 401 });
  }

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError || !sessionData.session) {

      const { data: refreshSessionData, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (refreshError || !refreshSessionData.session) {
        return NextResponse.json({ error: 'セッションのリフレッシュに失敗しました' }, { status: 401 });
      }

      const newAccessToken = refreshSessionData.session.access_token;
      const newRefreshToken = refreshSessionData.session.refresh_token;

      return NextResponse.json(
        {
          session: refreshSessionData.session,
        },
        {
          status: 200,
          headers: {
            'Set-Cookie': [
              `access_token=${newAccessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`,
              `refresh_token=${newRefreshToken}; Path=/; HttpOnly; Secure; SameSite=Lax`,
            ].join(', '),
          },
        }
      );
    }


    return NextResponse.json({ session: sessionData.session }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'サーバーエラーが発生しました', details: (error as Error).message }, { status: 500 });
  }
}
