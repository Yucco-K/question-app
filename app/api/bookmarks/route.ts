import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const questionId = searchParams.get('question_id');

  try {

    const { data: bookmarks, error } = await supabase
      .from('Bookmark')
      .select('id, user_id, question_id, is_bookmark')
      .eq('user_id', userId)
      .eq('question_id', questionId);


    if (error) {
      throw new Error(`ブックマーク一覧の取得に失敗しました: ${error.message}`);
    }

    return NextResponse.json({ success: true, bookmarks }, { status: 200 });
  } catch (error: any) {

    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const { user_id, question_id } = await req.json();

    const { data: existingBookmark, error: selectError } = await supabase
      .from('Bookmark')
      .select('*')
      .eq('user_id', user_id)
      .eq('question_id', question_id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw new Error(`ブックマークの確認に失敗しました: ${selectError.message}`);
    }

    if (existingBookmark) {

      const { data, error } = await supabase
        .from('Bookmark')
        .update({ is_bookmark: !existingBookmark.is_bookmark })
        .eq('user_id', user_id)
        .eq('question_id', question_id)
        .select()
        .single();

      if (error) {
        throw new Error(`ブックマークの更新に失敗しました: ${error.message}`);
      }

      return NextResponse.json({ success: true, data }, { status: 200 });
    }


    const { data, error } = await supabase
      .from('Bookmark')
      .insert([{ user_id, question_id, is_bookmark: true }])
      .select();

    if (error) {
      throw new Error(`ブックマークの挿入に失敗しました: ${error.message}`);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

