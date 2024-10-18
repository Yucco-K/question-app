import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const answerId = searchParams.get('answerId');

  if (!answerId) {
    return NextResponse.json({ message: 'answerIdが必要です' }, { status: 400 });
  }

  try {
    const { count, error } = await supabase
      .from('Comment')
      .select('id', { count: 'exact' })
      .eq('answer_id', answerId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ commentCount: count }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
