import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';
import { revalidateTag } from 'next/cache';

export async function PATCH(req: NextRequest, { params }: { params: { bookmarkId: string } }) {
  const { bookmarkId } = params;

  try {

    const { data: bookmarkData, error: fetchError } = await supabase
      .from('Bookmark')
      .select('is_bookmark')
      .eq('id', bookmarkId)
      .single();

    if (fetchError) {
      throw new Error(`ブックマークの取得に失敗しました: ${fetchError.message}`);
    }


    const newIsBookmark = !bookmarkData.is_bookmark;


    const { data, error: updateError } = await supabase
      .from('Bookmark')
      .update({ is_bookmark: newIsBookmark })
      .eq('id', bookmarkId);

    if (updateError) {
      throw new Error(`ブックマークの更新に失敗しました: ${updateError.message}`);
    }

    revalidateTag('bookmarks');

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {

    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { bookmarkId: string } }) {
  const { bookmarkId } = params;

  try {

    const { data, error } = await supabase
      .from('Bookmark')
      .delete()
      .eq('id', bookmarkId);

    if (error) {
      throw new Error(`ブックマークの削除に失敗しました: ${error.message}`);
    }

    revalidateTag('bookmarks');

    return NextResponse.json({ success: true, message: 'ブックマークが削除されました' }, { status: 200 });
  } catch (error: any) {

    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
