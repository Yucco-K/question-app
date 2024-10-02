import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { questionId: string } }) {
  try {
    const { questionId } = params;

    if (!questionId) {
      return NextResponse.json({ error: 'Bad Request', message: 'Question ID is required' }, { status: 400 });
    }

    const { data: answerUsersId, error: answerUsersIdError } = await supabase
      .from('Answer')
      .select('user_id')
      .eq('question_id', questionId);

    if (answerUsersIdError) {
      return NextResponse.json({ error: 'AnswerUsersId not found', message: answerUsersIdError.message }, { status: 404 });
    }

    const userIds = answerUsersId
    .filter((answer) => answer.user_id !== null) // user_id が null の場合を除外
    .map((answer) => answer.user_id);

    if (answerUsersId.length === 0) {
      // 回答がない場合のレスポンス
      return NextResponse.json({ message: 'No answers found for this question.' }, { status: 200 });
    }

  if (userIds.length > 0) {

    const { data: answerUsersData, error: answerUsersDataError } = await supabase
      .from('User')
      .select('id, username')
      .in('id', userIds);  // 修正: in() で userIds 配列を使用

    if (answerUsersDataError || !answerUsersData) {
      return NextResponse.json({ error: 'answerUsersData not found', message: answerUsersDataError?.message || 'No answer_users_data found' }, { status: 404 });
    }

    const { data: answerData, error: answerError } = await supabase
      .from('Answer')
      .select('*')
      .eq('question_id', questionId);

    if (answerError) {
      return NextResponse.json({ error: 'Answers not found', message: answerError.message }, { status: 404 });
    }

        // ユーザーが見つからなかった場合でも回答リストは表示されるようにする
  return NextResponse.json({
    answers: answerData,
    answerUsersData: answerUsersData || [],  // 空配列を返す
  }, { status: 200 });

  }
} catch (err) {
  console.error('エラー:', (err as Error).message);
  return NextResponse.json({ error: 'Server Error', message: (err as Error).message }, { status: 500 });
}
}
