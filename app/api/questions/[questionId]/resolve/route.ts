export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function PATCH(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  const { is_resolved } = await request.json();

  if (typeof is_resolved !== 'boolean') {
    return NextResponse.json({ message: '無効なリクエストです' }, { status: 400 });
  }

  try {

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
