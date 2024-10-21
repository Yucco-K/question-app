import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';


export async function PUT(request: Request, { params }: { params: { answerId: string } }) {
  const { answerId } = params;
  const body = await request.json();
  const { content } = body;

  const { data: existingAnswer, error: fetchError } = await supabase
    .from('Answer')
    .select('*')
    .eq('id', answerId)
    .single();

  if (fetchError || !existingAnswer) {
    return NextResponse.json({ error: 'Answer not found', message: fetchError?.message || 'No answer found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('Answer')
    .update({ content })
    .eq('id', answerId)
    .select();

  if (error) {
    return NextResponse.json({ error: 'Update failed', message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Update successful', data }, { status: 200 });
}


export async function DELETE(request: Request, { params }: { params: { answerId: string } }) {
  const { answerId } = params;

  const { data: existingAnswer, error: answerCheckError } = await supabase
  .from('Answer')
  .select('id')
  .eq('id', answerId)
  .single();

if (!existingAnswer || answerCheckError) {
  return NextResponse.json({
    error: 'Answer not found',
    message: `Answer with id ${answerId} has already been deleted or does not exist.`,
  }, { status: 404 });
}

  const { error: bestAnswerUpdateError } = await supabase
    .from('Question')
    .update({ best_answer_id: null })
    .eq('best_answer_id', answerId);

  if (bestAnswerUpdateError) {
    return NextResponse.json({
      error: 'Failed to update best_answer_id in Question table',
      message: bestAnswerUpdateError.message,
    }, { status: 500 });
  }
    const { error } = await supabase
    .from('Answer')
    .delete()
    .eq('id', answerId);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete answer', message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Answer deleted successfully' }, { status: 200 });
}
