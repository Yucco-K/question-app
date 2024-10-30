import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 });
  }

  try {

    const { count: userBestAnswersCount, error: userBestAnswersError } = await supabase
      .from('Question')
      .select('best_answer_id', { count: 'exact' })
      .eq('best_answer_id', userId);

      console.log('userBestAnswersCount', userBestAnswersCount);

    if (userBestAnswersError) {
      throw new Error(`ユーザーのベストアンサーの集計に失敗しました: ${userBestAnswersError.message}`);
    }

    const { data: totalAnswersData, error: totalAnswersError } = await supabase
      .from('Answer')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);

      console.log('totalAnswersData', totalAnswersData);

    if (totalAnswersError) {
      throw new Error(`回答数の集計に失敗しました: ${totalAnswersError.message}`);
    }

    const { data: answerIdsData, error: answerIdsError } = await supabase
      .from('Answer')
      .select('id')
      .eq('user_id', userId);

      console.log('answerIdsData', answerIdsData);

    if (answerIdsError || !answerIdsData) {
      throw new Error(`回答IDの取得に失敗しました: ${answerIdsError?.message}`);
    }

    const answerIds = answerIdsData?.map((answer: { id: string }) => answer.id) || [];

    const { data: totalLikesData, error: totalLikesError } = await supabase
      .from('Vote')
      .select('id', { count: 'exact' })
      .eq('type', 'up')
      .in('answer_id', answerIds);

      console.log('totalLikesData', totalLikesData);

    if (totalLikesError) {
      throw new Error(`いいね数の集計に失敗しました: ${totalLikesError.message}`);
    }


    return NextResponse.json({
      bestAnswerCount: userBestAnswersCount || 0,
      totalAnswers: totalAnswersData?.length || 0,
      totalLikes: totalLikesData?.length || 0,

    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
