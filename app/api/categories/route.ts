import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET() {
  try {

    const { data, error } = await supabase
    .from('Category')
    .select('*');

    if (error) {
      return NextResponse.json({ message: 'カテゴリの取得に失敗しました', error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {

    return NextResponse.json({ message: 'エラーが発生しました', error }, { status: 500 });
  }
}
