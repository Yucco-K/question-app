import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'newest';

  // 質問データの取得
  let query = supabase
    .from('Question')
    .select('*')
    .eq('is_draft', false);

  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'created_asc') {
    query = query.order('created_at', { ascending: true });
  } else if (sort === 'views_desc') {
    query = query.order('view_count', { ascending: false });
  }

  const { data: questions, error: questionError } = await query;

  if (questionError || !questions) {
    return NextResponse.json({ error: 'Server Error', message: questionError?.message || 'Questions not found' }, { status: 500 });
  }

  const questionsWithBookmarkCount = await Promise.all(
    questions.map(async (question) => {
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('Bookmark')
        .select('id')
        .eq('question_id', question.id);

      if (bookmarkError) {
        console.error('ブックマークの取得エラー:', bookmarkError);
      }

      const bookmarkCount = bookmarkData ? bookmarkData.length : 0;

      // bookmark_count を question に追加
      return {
        ...question,
        bookmark_count: bookmarkCount,
      };
    })
  );

  if (sort === 'bookmarks_desc') {
    questionsWithBookmarkCount.sort((a, b) => b.bookmark_count - a.bookmark_count);
  }

  return NextResponse.json(questionsWithBookmarkCount, { status: 200 });
}
