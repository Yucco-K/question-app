import { NextResponse } from 'next/server';
import supabase from '../../lib/supabaseClient';
import { revalidateTag } from 'next/cache';

export async function GET(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  if (!questionId) {
    return NextResponse.json({ error: 'Bad Request', message: 'Question ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('Answer')
    .select('*')
    .eq('question_id', questionId);

  if (error) {
    return NextResponse.json({ error: 'Server Error', message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionId, content, userId } = body;

    if (!questionId || !content || !userId) {
      return NextResponse.json({ error: 'Bad Request', message: 'Question ID, content, and user ID are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('Answer')
      .insert([{ question_id: questionId, content, user_id: userId }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidateTag('answers');

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('エラー:', (err as Error).message);
    return NextResponse.json({ error: 'Server Error', message: (err as Error).message }, { status: 500 });
  }
}