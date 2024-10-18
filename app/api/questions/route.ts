import { NextResponse } from 'next/server';
import supabase from '../../lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // const page = parseInt(searchParams.get('page') || '1', 10);
  // const limit = parseInt(searchParams.get('limit') || '10', 10);

  // const start = (page - 1) * limit;
  // const end = start + limit - 1;

  const { data: questions, error: questionError } = await supabase
    .from('Question')
    .select(`
      *,
      Category (name)
    `)
    .order('created_at', { ascending: false })
    .eq('is_draft', false)
    // .range(start, end);

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

  console.log('tagsForQuestion:', tagsForQuestion);

  return {
    ...question,
    tags: tagsForQuestion,
    category: question.Category?.name || 'カテゴリ未指定'
  };
  });

  return NextResponse.json(questionsWithTagsAndCategory, { status: 200 });
}


export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, tags, files, userId, categoryId } = body;

  if (!title || !description || !tags || !categoryId) {
    return NextResponse.json({ error: 'Bad Request', message: 'Title, description, tags, and category are required' }, { status: 400 });
  }

  try {
    let uploadedFiles = files || [];


    const { data: questionData, error: questionError } = await supabase
      .from('Question')
      .insert([{ title, description, user_id: userId, category_id: categoryId, is_draft: false }])
      .select()
      .single();

      if (questionError) {
      throw new Error(questionError.message);
    }

    const questionId = questionData.id;

    if (tags && tags.length > 0) {

      const { data: existingTags, error: existingTagError } = await supabase
        .from('Tag')
        .select('name')
        .in('name', tags);

      if (existingTagError) {
        throw new Error(existingTagError.message);
      }

      const existingTagNames = existingTags.map((tag: any) => tag.name);
      const newTags = tags.filter((tag: string) => !existingTagNames.includes(tag));

      if (newTags.length > 0) {
        const newTagInserts = newTags.map((tag: string) => ({ name: tag }));
        const { error: newTagInsertError } = await supabase
          .from('Tag')
          .insert(newTagInserts);

        if (newTagInsertError) {
          throw new Error(newTagInsertError.message);
        }
      }

      const { data: allTags, error: allTagFetchError } = await supabase
        .from('Tag')
        .select('id')
        .in('name', tags);

      if (allTagFetchError) {
        throw new Error(allTagFetchError.message);
      }

      if (allTags.length === 0) {
        throw new Error('タグが見つかりません');
      }

      const tagRelations = allTags.map((tag: any) => ({
        question_id: questionId,
        tag_id: tag.id,
      }));

      const { error: tagRelationError } = await supabase
        .from('QuestionTag')
        .insert(tagRelations);

      if (tagRelationError) {
        throw new Error(tagRelationError.message);
      }
    }

    return NextResponse.json({ message: '質問が正常に投稿されました。', questionId }, { status: 201 });

  } catch (error: any) {

    return NextResponse.json({ error: 'サーバーエラー', message: error.message }, { status: 500 });

  }
}

