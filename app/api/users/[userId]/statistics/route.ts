import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 });
  }

  try {
    // ベストアンサーIDの取得
    const { data: bestAnswerData, error: bestAnswerDataError } = await supabase
      .from('Question')
      .select('best_answer_id')
      .not('best_answer_id', 'is', null);

    if (bestAnswerDataError) {
      throw new Error(`ベストアンサーIDの取得に失敗しました: ${bestAnswerDataError?.message}`);
    }

    const bestAnswerIds = bestAnswerData?.map((question: { best_answer_id: string }) => question.best_answer_id) || [];

    if (bestAnswerIds.length === 0) {
      return NextResponse.json({ bestAnswerCount: 0, totalAnswers: 0, totalLikes: 0 }, { status: 200 });
    }

    // ユーザーのベストアンサー数の取得
    const { count: userBestAnswersCount, error: userBestAnswersError } = await supabase
      .from('Answer')
      .select('id', { count: 'exact' })
      .in('id', bestAnswerIds)
      .eq('user_id', userId);

    if (userBestAnswersError) {
      throw new Error(`ユーザーのベストアンサーの集計に失敗しました: ${userBestAnswersError.message}`);
    }

    // 回答数の集計
    const { count: totalAnswersCount, error: totalAnswersError } = await supabase
      .from('Answer')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);

    if (totalAnswersError) {
      throw new Error(`回答数の集計に失敗しました: ${totalAnswersError.message}`);
    }

    // 回答IDの取得といいね数の集計
    const { data: answerIdsData, error: answerIdsError } = await supabase
      .from('Answer')
      .select('id')
      .eq('user_id', userId);

    if (answerIdsError || !answerIdsData) {
      throw new Error(`回答IDの取得に失敗しました: ${answerIdsError?.message}`);
    }

    const answerIds = answerIdsData.map((answer: { id: string }) => answer.id) || [];

    const { count: totalLikesCount, error: totalLikesError } = await supabase
      .from('Vote')
      .select('id', { count: 'exact' })
      .eq('type', 'up')
      .in('answer_id', answerIds);

    if (totalLikesError) {
      throw new Error(`いいね数の集計に失敗しました: ${totalLikesError.message}`);
    }

    // 成功レスポンスの返却
    return NextResponse.json({
      bestAnswerCount: userBestAnswersCount || 0,
      totalAnswers: totalAnswersCount || 0,
      totalLikes: totalLikesCount || 0,
    }, { status: 200 });

  } catch (error: any) {
    // エラーレスポンスの返却
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
