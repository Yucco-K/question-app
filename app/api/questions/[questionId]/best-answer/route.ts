import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';
import { revalidateTag } from 'next/cache';

export async function GET(request: Request, { params }: { params: { questionId: string } }) {
  try {
    const { questionId } = params;

    if (!questionId) {
      return NextResponse.json({ error: 'Bad Request', message: 'Question ID is required' }, { status: 400 });
    }

    const { data: questionData, error: questionError } = await supabase
      .from('Question')
      .select('best_answer_id, user_id')
      .eq('id', questionId)
      .single();

    if (questionError || !questionData) {
      return NextResponse.json({ error: 'Question not found', message: questionError?.message }, { status: 404 });
    }

    const bestAnswerId = questionData.best_answer_id;
    const questionOwnerId = questionData.user_id;

    if (!bestAnswerId) {
      return NextResponse.json({ message: 'まだベストアンサーが選ばれていません。', questionOwnerId }, { status: 200 });
    }

    return NextResponse.json({ bestAnswerId, questionOwnerId }, { status: 200 });

  } catch (err) {
    console.error('エラー:', (err as Error).message);
    return NextResponse.json({ error: 'Server Error', message: (err as Error).message }, { status: 500 });
  }
}


export async function PATCH(request: Request, { params }: { params: { questionId: string } }) {
  try {
    const { questionId } = params;
    const { answerId, userId } = await request.json();

    if (!questionId || !answerId || !userId) {
      return NextResponse.json({ error: 'Bad Request', message: '必要なパラメータが不足しています' }, { status: 400 });
    }


    const { data: questionData, error: questionError } = await supabase
      .from('Question')
      .select('user_id')
      .eq('id', questionId)
      .single();

    if (questionError || !questionData) {
      return NextResponse.json({ error: '質問が見つかりません', message: questionError?.message }, { status: 404 });
    }

    const { data: answerData, error: answerError } = await supabase
    .from('Answer')
    .select('user_id')
    .eq('id', answerId)
    .single();

    if (questionData.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden', message: 'ベストアンサーを設定できるのは質問者のみです' }, { status: 403 });
    }

    if (!answerData || answerData.user_id === userId) {
      return NextResponse.json({ error: 'Forbidden', message: '自分の回答をベストアンサーに選ぶことはできません' }, { status: 403 });
    }

    const { error } = await supabase
      .from('Question')
      .update({ best_answer_id: answerId })
      .eq('id', questionId);

    if (error) {
      return NextResponse.json({ error: 'Failed to set best answer', message: error.message }, { status: 500 });
    }

    revalidateTag('*');

    return NextResponse.json({ message: 'ベストアンサーが正常に設定されました' }, { status: 200 });
  } catch (err) {
    console.error('エラー:', (err as Error).message);
    return NextResponse.json({ error: 'サーバーエラー', message: (err as Error).message }, { status: 500 });
  }
}


