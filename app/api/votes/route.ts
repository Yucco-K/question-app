import { NextResponse } from 'next/server';
import supabase from '../../lib/supabaseClient'; // 必要に応じてパスを調整

// POST メソッド: いいねまたは反対の作成または更新
export async function POST(req: Request) {
  const { answer_id, user_id, type, answer_user_id } = await req.json();

  try {
    // 回答者本人かどうかをチェック
    if (user_id === answer_user_id) {
      return NextResponse.json({ message: '回答者本人は投票できません' }, { status: 403 });
    }

    // すでにこのユーザーの評価があるか確認
    const { data: existingVote, error: selectError } = await supabase
      .from('Vote')
      .select('*')
      .eq('answer_id', answer_id)
      .eq('user_id', user_id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    // 既に評価がある場合は更新
    if (existingVote) {
      const { error: updateError } = await supabase
        .from('Vote')
        .update({ type })  // 'up' または 'down' に更新
        .eq('id', existingVote.id);

      if (updateError) throw updateError;

      return NextResponse.json({ message: '評価が更新されました' }, { status: 200 });
    }

    // 新しい評価を挿入
    const { error: insertError } = await supabase
      .from('Vote')
      .insert([{ answer_id, user_id, type }]);

    if (insertError) throw insertError;

    return NextResponse.json({ message: '評価が送信されました' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// GET メソッド: ユーザーの評価の取得
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const answerId = searchParams.get('answerId');
  const userId = searchParams.get('userId');

  if (!answerId || !userId) {
    return NextResponse.json({ message: 'answerIdとuserIdが必要です' }, { status: 400 });
  }

  try {
    const { data: vote, error: selectError } = await supabase
      .from('Vote')
      .select('*')
      .eq('answer_id', answerId)
      .eq('user_id', userId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    return NextResponse.json({ vote }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
