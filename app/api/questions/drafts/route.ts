import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';
import { revalidateTag } from 'next/cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const userId = searchParams.get('userId');

  const start = (page - 1) * limit;
  const end = start + limit - 1;


    if (!userId) {
      return NextResponse.json({ error: 'Bad Request', message: 'User ID is required' }, { status: 400 });
    }

  const { data: drafts, error: draftsError } = await supabase
    .from('Question')
    .select(`
      *,
      Category (name)
    `)
    .order('created_at', { ascending: false })
    .eq('user_id', userId)
    .eq('is_draft', true)
    .range(start, end);

  if (draftsError || !drafts) {
    return NextResponse.json({ error: 'Server Error', message: draftsError?.message || 'Drafts not found' }, { status: 500 });
  }

  const { data: draftTags, error: tagError } = await supabase
    .from('QuestionTag')
    .select(`
      question_id,
      tag_id,
      Tag (name)
    `);

  if (tagError || !draftTags) {
    return NextResponse.json({ error: 'Tag Fetch Error', message: tagError?.message || 'Draft tags not found' }, { status: 500 });
  }

  const draftTagsOrEmpty = draftTags?.length > 0 ? draftTags : [];

  const draftsWithTagsAndCategory = drafts.map((question: any) => {
    const tagsForDraft = draftTagsOrEmpty
      .filter((qt: any) => qt?.question_id === question.id)
      .map((qt: any) => qt?.Tag?.name || 'Unknown');

  return {
    ...question,
    tags: tagsForDraft,
    category: question.Category?.name || 'カテゴリ未指定'
  };
  });

  return NextResponse.json(draftsWithTagsAndCategory, { status: 200 });
}


export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, tags, files, userId, categoryId } = body;

  if (!title || !description || !tags || !categoryId) {
    return NextResponse.json({ error: 'Bad Request', message: 'Title, description, tags, and category are required' }, { status: 400 });
  }

  try {
    let uploadedFiles = files || [];

    const { data: draftData, error: draftError } = await supabase
      .from('Question')
      .insert([{ title, description, user_id: userId, category_id: categoryId, is_draft: true }])
      .select()
      .single();

      if (draftError) {
      throw new Error(draftError.message);
    }

    const draftId = draftData.id;

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
        question_id: draftId,
        tag_id: tag.id,
      }));

      const { error: tagRelationError } = await supabase
        .from('QuestionTag')
        .insert(tagRelations);

      if (tagRelationError) {
        throw new Error(tagRelationError.message);
      }
    }

    revalidateTag('*');

    return NextResponse.json({ message: '下書きが保存されました。', draftId }, { status: 201 });

  } catch (error: any) {

    return NextResponse.json({ error: 'サーバーエラー', message: error.message }, { status: 500 });

  }
}


