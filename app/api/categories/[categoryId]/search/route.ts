import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;

  try {
    if (!categoryId) {
      return NextResponse.json({ error: 'カテゴリーIDが必要です' }, { status: 400 });
    }
    const { data: questions, error } = await supabase
      .from('Question')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_draft', false);

    if (error) {
      return NextResponse.json({ error: '質問の取得に失敗しました', message: error.message }, { status: 500 });
    }

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
