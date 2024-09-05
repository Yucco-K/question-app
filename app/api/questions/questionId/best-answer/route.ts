import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function PATCH(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;
  const { answerId } = await request.json();

  const { error } = await supabase
    .from('Questions')
    .update({ best_answer_id: answerId })
    .eq('id', questionId);

  if (error) {
    return NextResponse.json({ error: 'Question or answer not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json({ message: 'Best answer has been set successfully.' });
}
