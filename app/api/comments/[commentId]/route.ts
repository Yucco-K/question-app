import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';
import { revalidateTag } from 'next/cache';

export async function GET(req: Request, { params }: { params: { commentId: string } }) {
  const { commentId } = params;

  const { data, error } = await supabase
    .from('Comment')
    .select('*')
    .eq('id', commentId)
    .single();

  if (error) {
    return NextResponse.json({ message: 'コメントの取得に失敗しました', error }, { status: 500 });
  }

  return NextResponse.json({ comment: data });
}


export async function PUT(req: Request, { params }: { params: { commentId: string } }) {
  const { commentId } = params;
  const body = await req.json();
  const { newContent } = body;


  const { data, error } = await supabase.rpc('update_comment_content', {
    p_comment_id: commentId,
    p_content: newContent,
  });


  if (error) {
    return NextResponse.json({ message: 'コメントの更新に失敗しました', error }, { status: 500 });
  }

  revalidateTag('*');

  return NextResponse.json({ message: 'コメントが正常に更新されました', data });
}


export async function DELETE(req: Request, { params }: { params: { commentId: string } }) {
  const { commentId } = params;

  const { error } = await supabase
    .from('Comment')
    .delete()
    .eq('id', commentId);

  if (error) {
    return NextResponse.json({ message: 'コメントの削除に失敗しました', error }, { status: 500 });
  }

  revalidateTag('*');

  return NextResponse.json({ message: 'コメントが正常に削除されました' });
}
