import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  let questionsWithTagsAndCategory: any[] = [];

  try {
    const { data: questions, error: questionError } = await supabase
      .from('Question')
      .select(`
        *,
        Category (name)   // カテゴリの名前を取得
      `)
      .order('created_at', { ascending: false })
      .eq('is_draft', false)
      .eq('user_id', userId);

      if (questionError || !questions) {
      return NextResponse.json({ error: 'Server Error', message: questionError?.message || 'Questions not found' }, { status: 500 });
    }

    const { data: questionTags, error: tagError } = await supabase
      .from('QuestionTag')
      .select(`
        question_id,
        tag_id,
        Tag (name)
      `);

    if (tagError || !questionTags) {
      return NextResponse.json({ error: 'Tag Fetch Error', message: tagError?.message || 'Question tags not found' }, { status: 500 });
    }

    const questionTagsOrEmpty = questionTags?.length > 0 ? questionTags : [];

    const questionsWithTagsAndCategory = questions.map((question: any) => {
      const tagsForQuestion = questionTagsOrEmpty
        .filter((qt: any) => qt?.question_id === question.id)
        .map((qt: any) => qt?.Tag?.name || 'Unknown');

    return {
      ...question,
      tags: tagsForQuestion,
      category: question.Category?.name || 'カテゴリ未指定'
    };
  });

  return NextResponse.json({
    questions: questionsWithTagsAndCategory || [],
    // answers: answers || [],
    // comments: comments || [],
  }, { status: 200 });

  } catch (error: any) {

    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
