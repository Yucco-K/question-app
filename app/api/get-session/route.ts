export const fetchCache = 'force-no-store';

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

    const { data: sessionData, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error || !sessionData.session) {
      return NextResponse.json({ error: 'セッションが見つかりません' }, { status: 401 });
    }

    return NextResponse.json({ session: sessionData.session }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'サーバーエラーが発生しました', details: (error as Error).message }, { status: 500 });
  }
}
