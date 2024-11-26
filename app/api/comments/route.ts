import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';
import { revalidateTag } from 'next/cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get('questionId');
  const answerId = searchParams.get('answerId');

  let query = supabase
    .from('Comment')
    .select('*');

  if (questionId) {
    query = query.eq('question_id', questionId);
  }

  if (answerId) {
    query = query.eq('answer_id', answerId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'コメントの取得に失敗しました', message: error.message }, { status: 500 });
  }

  if (data.length === 0) {
    return NextResponse.json({ message: 'まだコメントはありません', comments: [] }, { status: 200 });
  }

  return NextResponse.json({ comments: data }, { status: 200 });
}


export async function POST(request: Request) {
  const body = await request.json();
  const { question_id, answer_id, content, user_id } = body;

  if (!question_id || !content || !user_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('Comment')
    .insert([{ question_id, content, answer_id, user_id}])
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to insert comment', message: error.message }, { status: 400 });
  }

  revalidateTag('*');

  return NextResponse.json({ message: 'コメントが投稿されました', commentId: data.id }, { status: 201 });
}