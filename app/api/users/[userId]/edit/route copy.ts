import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/app/lib/supabaseAdmin';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  console.log('params:', params);
  console.log('userId:', userId);

  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'ユーザーが見つかりませんでした。', message: error?.message || 'データがありません。' }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}


export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const body = await request.json();
  const { email, username } = body;

  console.log('userId:', userId);
  console.log('body:', body);

  // 1. ユーザーネームの重複チェック
  const { data: existingUsername, error: usernameError } = await supabase
    .from('User')
    .select('id')
    .eq('username', username)
    .neq('id', userId) // 自分以外のユーザーをチェック
    .single();

  if (usernameError && usernameError.code !== 'PGRST116') {
    return NextResponse.json({ error: 'ユーザーネームのチェックに失敗しました。' }, { status: 500 });
  }

  if (existingUsername) {
    return NextResponse.json({ error: 'すでに登録のあるユーザーネームです。' }, { status: 400 });
  }

  // 2. メールアドレスの重複チェック
  const { data: existingEmail, error: emailError } = await supabase
    .from('auth.users')
    .select('id')
    .eq('Email', email)
    .neq('id', userId) // 自分以外のユーザーをチェック
    .single();

  if (emailError && emailError.code !== 'PGRST116') {
    return NextResponse.json({ error: 'メールアドレスのチェックに失敗しました。' }, { status: 500 });
  }

  if (existingEmail) {
    return NextResponse.json({ error: 'すでに登録のあるメールアドレスです。' }, { status: 400 });
  }

  // 3. auth.users のメールアドレスを更新
  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    email: email,
  });

  if (authError) {
    return NextResponse.json({ error: 'auth.usersのメールアドレス更新に失敗しました。', message: authError.message }, { status: 500 });
  }

  // 4. User テーブルの更新（トリガーで連携）
  const { data, error } = await supabase
    .from('User')
    .update(body)
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: 'ユーザー情報の更新に失敗しました。', message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}


