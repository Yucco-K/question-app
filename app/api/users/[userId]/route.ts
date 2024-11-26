import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/app/lib/supabaseAdmin';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'ユーザーが見つかりませんでした。', message: error?.message || 'データがありません。' },
      {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        }
      }
    );
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
    }
  });
}
