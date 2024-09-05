import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function POST(request: Request) {
  const body = await request.json();
  const { answerId, type } = body;

  if (!answerId || !type) {
    return NextResponse.json({ error: 'Bad Request', message: 'Answer ID and vote type are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('Votes')
    .insert([{ answer_id: answerId, type }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Server Error', message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
