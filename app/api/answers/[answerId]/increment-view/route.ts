import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';


const incrementViewCount = async (answerId: string) => {
  try {

    const { data: answerData, error: fetchError } = await supabase
      .from('Answer')
      .select('view_count')
      .eq('id', answerId)
      .single();

    if (fetchError) {
      throw new Error(`閲覧数の取得に失敗しました: ${fetchError.message}`);
    }

    const currentViewCount = answerData?.view_count || 0;


    const { data, error: updateError } = await supabase
      .from('Answer')
      .update({ view_count: currentViewCount + 1 })
      .eq('id', answerId);

    if (updateError) {
      throw new Error(`閲覧数の更新に失敗しました: ${updateError.message}`);
    }

    console.log('閲覧数が更新されました:', data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`処理に失敗しました: ${(error as any).message}`);
  }
};


export async function POST(request: Request, { params }: { params: { answerId: string } }) {
  const { answerId } = params;
  console.log('answerId:', answerId);

  try {
    const result = await incrementViewCount(answerId);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function GET(reqest: Request, { params }: { params: { answerId: string } }) {
  const { answerId } = params;

  try {

    const { data: answerData, error } = await supabase
      .from('Answer')
      .select('view_count')
      .eq('id', answerId)
      .single();

    if (error) {
      throw new Error(`閲覧数の取得に失敗しました: ${error.message}`);
    }

    return NextResponse.json({ viewCount: answerData.view_count }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

