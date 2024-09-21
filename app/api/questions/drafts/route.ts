import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from('Question')
      .select(`
        *,
        QuestionTag (
          Tag (
            name
          )
        )
      `)
      .eq('is_draft', true)
      .range(start, end);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Drafts not found', message: error.message }, { status: 404 });
    }

    const draftsWithTags = data.map((draft: any) => {
      const tags = draft.QuestionTag?.map((qt: any) => qt.Tag.name) || [];
      return { ...draft, tags };
    });

    return NextResponse.json(draftsWithTags);
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました', message: (err as Error).message }, { status: 500 });
  }
}


export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, tags, files, userId } = body;

  if (!title || !description || title.length < 2 || description.length < 10 || !tags || tags.length === 0) {
    return NextResponse.json({ error: 'Bad Request', message: 'Title and description  and tags are required' }, { status: 400 });
  }

  try {

    let uploadedFiles = files || [];

    const { data: questionData, error: questionError } = await supabase
      .from('Question')
      .insert([{ title, description, user_id: userId, is_draft: true }])
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

      // console.log('questionId:', questionId);
      // console.log('allTags:', allTags);
      // console.log('allTags[0].id:' , allTags[0].id)

      const tagRelations = allTags.map((tag: any) => ({
        question_id: questionId,
        tag_id: allTags[0].id,
      }));

      const { error: tagRelationError } = await supabase
        .from('QuestionTag')
        .insert(tagRelations);

      if (tagRelationError) {
        throw new Error(tagRelationError.message);
      }
    }

    // アップロードされたファイル情報をFileテーブルに挿入

    // console.log('uploadedFiles:', uploadedFiles);

    // if (uploadedFiles.length > 0) {
    //   const fileInserts = uploadedFiles.map((file: { name: any; url: any; fileType: any; }) => ({
    //     name: file.name,
    //     url: file.url,
    //     fileType: file.fileType,
    //     question_id: questionId,
    //   }));

    //   const { error: fileInsertError } = await supabase
    //     .from('File')
    //     .insert(fileInserts);

    //   if (fileInsertError) {
    //     throw new Error(fileInsertError.message);
    //   }
    // }

    return NextResponse.json({ message: '下書きが正常に保存されました。', questionId }, { status: 201 });

  } catch (error: any) {

    return NextResponse.json({ error: 'サーバーエラー', message: error.message }, { status: 500 });

  }
}


