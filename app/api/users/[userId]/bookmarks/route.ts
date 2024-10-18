import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;


  try {
    const { data: bookmarks, error: bookmarkError } = await supabase
      .from('Bookmark')
      .select('question_id')
      .eq('user_id', userId)
      .eq('is_bookmark', true);

    if (bookmarkError) {
      throw new Error(`ブックマークの取得に失敗しました: ${bookmarkError.message}`);
    }

    const questionIds = bookmarks.map((bookmark) => bookmark.question_id);

    if (questionIds.length === 0) {
      return NextResponse.json({ questions: [] });
    }

    const { data: questions, error: questionError } = await supabase
      .from('Question')
      .select('*')
      .eq('is_draft', false)
      .in('id', questionIds);

    if (questionError) {
      throw new Error(`ブックマーク質問の取得に失敗しました: ${questionError.message}`);
    }

    const { data: questionTags, error: tagError } = await supabase
      .from('QuestionTag')
      .select(`
        question_id,
        tag_id,
        Tag (name)
      `)
      .in('question_id', questionIds);

    if (tagError) {
      throw new Error(`ブックマーク質問タグの取得に失敗しました: ${tagError.message}`);
    }

    const questionsWithTagsAndCategory = questions.map((question: any) => {
      const tagsForQuestion = questionTags
        .filter((qt: any) => qt.question_id === question.id)
        .map((qt: any) => qt.Tag.name);
      return {
        ...question,
        tags: tagsForQuestion,
        category: question.Category?.name || 'カテゴリ未指定',
      };
    });

    return NextResponse.json({ bookmarks: questionsWithTagsAndCategory });


  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
