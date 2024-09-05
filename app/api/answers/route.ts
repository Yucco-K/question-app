import { NextResponse } from 'next/server';
import supabase  from '../../lib/supabaseClient';

export async function POST(request: Request) {
  const body = await request.json();
  const { questionId, content } = body;

  if (!questionId || !content) {
    return NextResponse.json({ error: 'Bad Request', message: 'Question ID and content are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('Answers')
    .insert([{ question_id: questionId, content }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Server Error', message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
