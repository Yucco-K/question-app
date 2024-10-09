import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/app/lib/supabaseAdmin';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  console.log('params:', params);
  console.log('userId:', userId);

  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', userId)
    .single();

    if (error || !data) {
      return NextResponse.json({ error: 'ユーザーが見つかりませんでした。', message: error?.message || 'データがありません。' }, { status: 404 });
    }

    return NextResponse.json(data);
  }




