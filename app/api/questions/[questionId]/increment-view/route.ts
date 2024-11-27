export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';


const incrementViewCount = async (questionId: string) => {
  try {

    const { data: questionData, error: fetchError } = await supabase
      .from('Question')
      .select('view_count')
      .eq('id', questionId)
      .single();

    if (fetchError) {
      throw new Error(`閲覧数の取得に失敗しました: ${fetchError.message}`);
    }

    const currentViewCount = questionData?.view_count || 0;


    const { data, error: updateError } = await supabase
      .from('Question')
      .update({ view_count: currentViewCount + 1 })
      .eq('id', questionId);

    if (updateError) {
      throw new Error(`閲覧数の更新に失敗しました: ${updateError.message}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`処理に失敗しました: ${(error as any).message}`);
  }
};


export async function PATCH(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  try {
    const result = await incrementViewCount(questionId);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function GET(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  try {
    const { data: questionData, error } = await supabase
      .from('Question')
      .select('view_count')
      .eq('id', questionId)
      .single();

    if (error) {
      throw new Error(`閲覧数の取得に失敗しました: ${error.message}`);
    }

    return NextResponse.json({ data: questionData }, { status: 200 });


  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

