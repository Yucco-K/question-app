import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';


const incrementViewCount = async (commentId: string) => {
  try {

    const { data: commentData, error: fetchError } = await supabase
      .from('Comment')
      .select('view_count')
      .eq('id', commentId)
      .single();

    if (fetchError) {
      throw new Error(`閲覧数の取得に失敗しました: ${fetchError.message}`);
    }

    const currentViewCount = commentData?.view_count || 0;


    const { data, error: updateError } = await supabase
      .from('Comment')
      .update({ view_count: currentViewCount + 1 })
      .eq('id', commentId);

    if (updateError) {
      throw new Error(`閲覧数の更新に失敗しました: ${updateError.message}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`処理に失敗しました: ${(error as any).message}`);
  }
};


export async function POST(request: Request, { params }: { params: { commentId: string } }) {
  const { commentId } = params;

  try {
    const result = await incrementViewCount(commentId);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function GET(reqest: Request, { params }: { params: { commentId: string } }) {
  const { commentId } = params;

  try {

    const { data: commentData, error } = await supabase
      .from('Comment')
      .select('view_count')
      .eq('id', commentId)
      .single();

    if (error) {
      throw new Error(`閲覧数の取得に失敗しました: ${error.message}`);
    }


    return NextResponse.json({ viewCount: commentData.view_count }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

