import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabaseClient';

export async function GET(request: Request, context: { params?: { questionId?: string } }) {
  const { questionId } = context.params || {};

  if (!questionId) {
      return NextResponse.json({ error: 'Bad Request', message: 'Question ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('Answers')
    .select('*')
    .eq('question_id', questionId);

    if (error) {
      return NextResponse.json({ error: 'Error retrieving answers', message: error.message }, { status: 500 });
    }

  return NextResponse.json(data);
}
