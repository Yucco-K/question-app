import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

// PATCH メソッド: 解決済みフラグの更新
export async function PATCH(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;
  
  // リクエストボディから is_resolved の値を取得
  const { is_resolved } = await request.json();

  if (typeof is_resolved !== 'boolean') {
    return NextResponse.json({ message: '無効なリクエストです' }, { status: 400 });
  }

  try {
    // Supabaseで該当の質問の解決済みフラグを更新
    const { data, error } = await supabase
      .from('Question')
      .update({ is_resolved })
      .eq('id', questionId)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: '解決済み状態が更新されました', data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || '更新に失敗しました' }, { status: 500 });
  }
}
