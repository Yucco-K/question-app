import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { questionId: string } }) {
  try {
    const { questionId } = params;

    if (!questionId) {
      return NextResponse.json({ error: 'Bad Request', message: 'Question ID is required' }, { status: 400 });
    }

    const { data: bestAnswerId, error: bestAnswerIdError } = await supabase
      .from('Question')
      .select('best_answer_id')
      .eq('id', questionId)
      .single();

    if (bestAnswerIdError || bestAnswerId?.best_answer_id === null) {

      return NextResponse.json({ message: 'まだベストアンサーが選ばれていません。' }, { status: 200 });
    }

    const { data: bestAnswerUserId, error: bestAnswerUserIdError } = await supabase
      .from('Answer')
      .select('user_id')
      .eq('id', bestAnswerId.best_answer_id)
      .single();

    if (bestAnswerUserIdError || !bestAnswerUserId) {
      return NextResponse.json({ error: 'bestAnswerUserId not found', message: bestAnswerUserIdError?.message }, { status: 404 });
    }

    const { data: bestAnswerUserData, error: bestAnswerUserDataError } = await supabase
      .from('User')
      .select('id, username')
      .eq('id', bestAnswerUserId.user_id)
      .single();

    if (bestAnswerUserDataError || !bestAnswerUserData) {
      return NextResponse.json({ error: 'bestAnswerUserData not found', message: bestAnswerUserDataError?.message }, { status: 404 });
    }

    return NextResponse.json({ bestAnswerId: bestAnswerId.best_answer_id, bestAnswerUserData: bestAnswerUserData }, { status: 200 });

  } catch (err) {
    console.error('エラー:', (err as Error).message);
    return NextResponse.json({ error: 'Server Error', message: (err as Error).message }, { status: 500 });
  }
}


export async function PATCH(request: Request, { params }: { params: { questionId: string ,answerId: string} }) {
  try {
    const { questionId } = params;
    const { answerId } = await request.json();

    if (!questionId || !answerId) {
      return NextResponse.json({ error: 'Bad Request', message: 'Question ID and Answer ID are required' }, { status: 400 });
    }


    const { error } = await supabase
      .from('Question')
      .update({ best_answer_id: answerId })
      .eq('id', questionId);

    if (error) {
      return NextResponse.json({ error: 'Failed to set best answer', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Best answer has been set successfully.' }, { status: 200 });
  } catch (err) {
    console.error('エラー:', (err as Error).message);
    return NextResponse.json({ error: 'Server Error', message: (err as Error).message }, { status: 500 });
  }
}

