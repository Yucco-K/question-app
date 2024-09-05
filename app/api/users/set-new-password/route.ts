import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const { userId, password } = await req.json();

    if (!userId || !password) {
      return NextResponse.json({ message: 'ユーザーIDとパスワードは必須です。' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'パスワードを更新しました。' }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'サーバーエラーが発生しました。' }, { status: 500 });

  }
}
