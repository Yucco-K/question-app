import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';

  // 質問データの取得
  let query = supabase
    .from('Question')
    .select('*')
    .eq('is_draft', false);

  // フィルタ条件による質問の絞り込み
  if (filter === 'open') {
    query = query.eq('is_resolved', false);  // 未解決の質問
  } else if (filter === 'closed') {
    query = query.eq('is_resolved', true);   // 解決済みの質問
  }

  const { data: questions, error: questionError } = await query;

  if (questionError || !questions) {
    return NextResponse.json({ error: 'Server Error', message: questionError?.message || 'Questions not found' }, { status: 500 });
  }

  // 各質問に対して回答数を取得
  const questionsWithAnswerCount = await Promise.all(
    questions.map(async (question) => {
      const { data: answerCountData, error: answerError } = await supabase
        .from('Answer')
        .select('id', { count: 'exact' })
        .eq('question_id', question.id);

      if (answerError) {
        console.error('回答数の取得エラー:', answerError);
      }

      const answerCount = answerCountData?.length || 0;

      return {
        ...question,
        answer_count: answerCount, // 回答数を追加
      };
    })
  );

  // フィルタリング：回答がない質問
  let filteredQuestions = questionsWithAnswerCount;
  if (filter === 'no_answer') {
    filteredQuestions = questionsWithAnswerCount.filter(q => q.answer_count === 0);
  } else if (filter === 'has_answer') {
    filteredQuestions = questionsWithAnswerCount.filter(q => q.answer_count > 0);
  }

  return NextResponse.json(filteredQuestions, { status: 200 });
}
