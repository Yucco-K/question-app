export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import supabase from '../../lib/supabaseClient';
import { revalidateTag } from 'next/cache';


export async function POST(req: Request) {
  const { answer_id, user_id, type, answer_user_id } = await req.json();

  if (user_id === answer_user_id) {
    return NextResponse.json({ message: '回答者本人は投票できません' }, { status: 403 });
  }

  const { error: insertError } = await supabase
    .from('Vote')
    .insert([{ answer_id, user_id, type }]);

  if (insertError) {
    return NextResponse.json({ message: insertError.message }, { status: 500 });
  }

  revalidateTag('*');

  return NextResponse.json({ message: '評価が送信されました' }, { status: 200 });
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const answerId = searchParams.get('answerId');
  const userId = searchParams.get('userId');

  if (!answerId || !userId) {
    return NextResponse.json({ message: 'answerIdとuserIdが必要です' }, { status: 400 });
  }

  try {
    const { data: vote, error: selectError } = await supabase
      .from('Vote')
      .select('*')
      .eq('answer_id', answerId)
      .eq('user_id', userId)
      .maybeSingle();

    if (selectError) throw selectError;

    return NextResponse.json({ vote }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
