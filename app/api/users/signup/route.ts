import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('User')
    .select('*')
    .range(start, end);

  if (error) {
    return NextResponse.json({ error: 'Server Error', message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password ) {
    return NextResponse.json({ error: 'Bad Request', message: '必要なフィールドが不足しています。' }, { status: 400 });
  }

  const { data: existingUser, error: checkError } = await supabase
    .from('User')
    .select('id')
    .eq('email', email)

  if (checkError) {
    return NextResponse.json({ error: 'Server Error', message: checkError.message }, { status: 500 });
  }

  if (existingUser.length > 0) {
    return NextResponse.json({
      error: 'Conflict',
      message: 'このメールアドレスは既に存在しています。',
    }, { status: 409 });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username
      },
    },
  });

  if (error) {
    let errorMessage = error.message;
    if (error.message.includes("User with this email already exists")) {
      errorMessage = "このメールアドレスはすでに登録されています。";
    } else if (error.message.includes("Database error saving new user")) {
      errorMessage = "すでに使用されているユーザー名です。他の名前に変更してください。";
    } else if (error.message.includes("Password should contain")) {
      errorMessage = "パスワードは8文字以上、英字、数字を含めてください。";
    } else if (error.message.includes("Password should be at least 8 characters")) {
      errorMessage = "パスワードは8文字以上で入力してください。";
    }
    return NextResponse.json({ error: 'Server Error', message: errorMessage }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

