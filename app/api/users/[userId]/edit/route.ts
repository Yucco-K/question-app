import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/app/lib/supabaseAdmin';
import { revalidateTag } from 'next/cache';

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const body = await request.json();
  const { email, username, profileImage } = body;


    if (username) {
      const { data: existingUsername, error: usernameError } = await supabase
        .from('User')
        .select('id')
        .eq('username', username)
        .neq('id', userId)
        .single();

      if (usernameError && usernameError.code !== 'PGRST116') {
        console.error('ユーザーネームのチェックに失敗:', usernameError);
        return NextResponse.json({ error: 'ユーザーネームのチェックに失敗しました。' }, { status: 500 });
      }

      if (existingUsername) {
        return NextResponse.json({ error: 'すでに登録のあるユーザーネームです。' }, { status: 400 });
      }

    }

    const { data: userData, error: userError } = await supabase
    .from('User')
    .select('email')
    .eq('id', userId)
    .single();

    if (userError) {
      console.error('ユーザーデータの取得に失敗しました:', userError);
      return NextResponse.json({ error: 'ユーザー情報の取得に失敗しました。' }, { status: 500 });
    }

    if (userData && userData.email === email) {
      return NextResponse.json({ error: 'メールアドレスが変更されていません。' }, { status: 400 });
    }


    if (email) {
      const { data: existingEmail, error: emailError } = await supabase
        .from('User')
        .select('id')
        .eq('email', email)
        .neq('id', userId)
        .single();

      if (emailError && emailError.code !== 'PGRST116') {
        console.error('メールアドレスのチェックに失敗:', emailError);
        return NextResponse.json({ error: 'メールアドレスのチェックに失敗しました。' }, { status: 500 });
      }

      if (existingEmail) {
        return NextResponse.json({ error: 'すでに登録のあるメールアドレスです。' }, { status: 400 });
      }
    }
      if (email) {

        const { error: authError } = await supabase.auth.admin.updateUserById(userId, { email });

        if (authError) {
          console.error('auth.usersのメールアドレス更新に失敗:', authError);
          return NextResponse.json({ error: 'auth.usersのメールアドレス更新に失敗しました。', message: authError.message }, { status: 500 });
        }
      }

    if (profileImage) {
      const { data, error } = await supabase
        .from('User')
        .update({ profileImage })
        .eq('id', userId);

      if (error) {
        console.error('プロフィール画像の更新に失敗:', error);
        return NextResponse.json({ error: 'プロフィール画像の更新に失敗しました。', message: error.message }, { status: 500 });
      }

      revalidateTag('userProfile');

      return NextResponse.json(data, { status: 200 });
    }

    if (email || username) {
      const updateData: any = {};
      if (email) updateData.email = email;
      if (username) updateData.username = username;

      const { data, error } = await supabase
        .from('User')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Userテーブルの更新に失敗:', error);
        return NextResponse.json({ error: 'ユーザー情報の更新に失敗しました。', message: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json({ message: '更新するデータがありません。' }, { status: 400 });
  }


  export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    const { data: user, error: userError } = await supabase
      .from('User')
      .select('profileImage')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error("ユーザー情報の取得に失敗しました:", userError);
      return NextResponse.json({ error: "ユーザー情報の取得に失敗しました。" }, { status: 500 });
    }

    if (user.profileImage) {
      const imagePath = user.profileImage.split('/').pop()?.split('?')[0];

      const { error: storageError } = await supabase.storage
        .from('avatar_files')
        .remove([imagePath]);

      if (storageError) {
        console.error("ストレージから画像を削除する際にエラーが発生しました:", storageError);
        return NextResponse.json({ error: "画像の削除に失敗しました。" }, { status: 500 });
      }
    }

    const { error: updateError } = await supabase
      .from('User')
      .update({ profileImage: null })
      .eq('id', userId);

    if (updateError) {
      console.error("プロフィール画像のURLをnullに更新する際にエラーが発生しました:", updateError);
      return NextResponse.json({ error: "プロフィール画像の削除に失敗しました。" }, { status: 500 });
    }

    revalidateTag('userProfile');

    return NextResponse.json({ message: "プロフィール画像を削除しました。" }, { status: 200 });
  }


export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;


  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) {
    console.error("auth.usersの削除に失敗しました:", authError);
    return NextResponse.json({ error: "auth.usersの削除に失敗しました。" }, { status: 500 });
  }

  revalidateTag('userProfile');
  revalidateTag('answers');
  revalidateTag('questions');


  return NextResponse.json({ message: "アカウントが削除されました。" }, { status: 200 });
}

