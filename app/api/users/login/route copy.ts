import supabase from "@/app/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { usernameOrEmail, password } = await request.json();
  let userEmail = usernameOrEmail;

  const atIndex = usernameOrEmail.indexOf('@');
  const dotIndex = usernameOrEmail.lastIndexOf('.');

  const isEmail = atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < usernameOrEmail.length - 1;

  if (isEmail) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: userEmail, password });

    if (error) {
      console.error('ログインエラー:', error.message);
      return NextResponse.json({ error: 'Unauthorized', message: 'ログインに失敗しました。' }, { status: 401 });
    }

    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    if (accessToken && refreshToken) {
      const response = NextResponse.json({ message: 'ログインに成功しました。' });

      response.cookies.set('access_token', accessToken, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: true,
      });

      response.cookies.set('refresh_token', refreshToken, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        secure: true,
      });

      return response;
    }

    console.error('トークンの保存に失敗しました');
    return NextResponse.json({ error: 'Server Error', message: 'トークンの保存に失敗しました。' }, { status: 500 });
  }

  if (!isEmail) {

  console.log('usernameOrEmail:', usernameOrEmail);

    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('email')
      .eq('username', usernameOrEmail)
      .single();

      console.log('userData:', userData);

    if (userError || !userData) {
      return NextResponse.json({ error: 'Unauthorized', message: 'ユーザー名が見つかりませんでした' }, { status: 401 });
    }

    userEmail = userData.email;

    const { data, error } = await supabase.auth.signInWithPassword({ email: userEmail, password });

    if (error) {
      console.error('ログインエラー:', error.message);
      return NextResponse.json({ error: 'Unauthorized', message: 'ログインに失敗しました。' }, { status: 401 });
    }

    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    if (accessToken && refreshToken) {
      const response = NextResponse.json({ message: 'ログインに成功しました。' });

      response.cookies.set('access_token', accessToken, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: true,
      });

      response.cookies.set('refresh_token', refreshToken, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        secure: true,
      });

      return response;
    }

    console.error('トークンの保存に失敗しました');
    return NextResponse.json({ error: 'Server Error', message: 'トークンの保存に失敗しました。' }, { status: 500 });
  }
}
