import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient'; // Supabase クライアントをインポート

// コメントを取得・編集・削除するエンドポイント
export async function GET(req: Request, { params }: { params: { commentId: string } }) {
  const { commentId } = params;

  // コメント取得
  const { data, error } = await supabase
    .from('Comment')  // テーブル名を変更
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

  console.log('commentId:', commentId);
  console.log('body:', body);

  // Supabase のストアドプロシージャを呼び出す
  const { data, error } = await supabase.rpc('update_comment_content', {
    p_comment_id: commentId,
    p_content: newContent,
  });


  if (error) {
    return NextResponse.json({ message: 'コメントの更新に失敗しました', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'コメントが正常に更新されました', data });
}


// export async function PUT(req: Request, { params }: { params: { commentId: string } }) {
//   const { commentId } = params;
//   const body = await req.json();
//   const { content } = body;

//   console.log('commentId:', commentId);
//   console.log('body:', body);

//   const { error } = await supabase
//     .from('Comment')
//     .update({ ...body })
//     .eq('id', commentId);

//   if (error) {
//     return NextResponse.json({ message: 'コメントの更新に失敗しました', error }, { status: 500 });
//   }

//   return NextResponse.json({ message: 'コメントが正常に更新されました' });
// }


export async function DELETE(req: Request, { params }: { params: { commentId: string } }) {
  const { commentId } = params;

  const { error } = await supabase
    .from('Comment')
    .delete()
    .eq('id', commentId);

  if (error) {
    return NextResponse.json({ message: 'コメントの削除に失敗しました', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'コメントが正常に削除されました' });
}
