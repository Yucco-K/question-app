import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('Tag')
    .select('name');

  if (error) {
    return NextResponse.json({ error: 'タグの取得に失敗しました' }, { status: 500 });
  }

  const tagNames = data.map((tag) => tag.name);
  return NextResponse.json(tagNames, { status: 200 });
}
