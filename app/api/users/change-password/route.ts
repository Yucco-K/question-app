// app/api/users/change-password/route.ts
import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function POST(req: Request) {
  const { email, redirectTo } = await req.json();
  // console.log("email:", email);
  // console.log("redirectTo:", redirectTo);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'パスワードリセットリンクを送信しました。' });
}
