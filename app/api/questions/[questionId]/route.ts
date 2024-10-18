import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  const { data: questionTagData, error: questionTagError } = await supabase
    .from('QuestionTag')
    .select('tag_id')
    .eq('question_id', questionId);


  if (questionTagError || !questionTagData || questionTagData.length === 0) {
    return NextResponse.json({ error: 'Tags not found', message: questionTagError?.message || 'No tags found for this question.' }, { status: 404 });
  }

  const tagIds = questionTagData.map((tag) => tag.tag_id);

  const { data: tagData, error: tagError } = await supabase
    .from('Tag')
    .select('id, name')
    .in('id', tagIds);

  if (tagError || !tagData || tagData.length === 0) {
    return NextResponse.json({ error: 'Tag names not found', message: tagError?.message || 'No tag names found for the provided tag IDs.' }, { status: 404 });
  }

  const { data: questionData, error: questionError } = await supabase
    .from('Question')
    .select('*')
    .eq('id', questionId)
    .single();

  if (questionError || !questionData) {
    return NextResponse.json({ error: 'Question not found', message: questionError?.message || 'No question found with this ID.' }, { status: 404 });
  }

  // 結果をクライアントに返す
  return NextResponse.json({ ...questionData, tags: tagData }, { status: 200 });
}


export async function PUT(request: Request, { params }: { params: { questionId: string } }) {

  const { questionId } = params;
  const body = await request.json();
  const { tags, ...questionBody } = body;

  const { data: questionData, error: questionError } = await supabase
    .from('Question')
    .update({ ...questionBody })
    .eq('id', questionId);

    if (questionError) {
      return NextResponse.json({ error: 'Question not found', message: questionError.message }, { status: 404 });
    }

  if (tags && tags.length > 0) {

    const { data: tagData, error: tagError } = await supabase
      .from('Tag')
      .select('id, name')
      .in('name', tags);

    if (tagError || !tagData) {
      console.log('Tag fetch error:', tagError);
      return NextResponse.json({ error: 'タグの取得に失敗しました', message: tagError?.message }, { status: 500 });
    }

    const tagIds = tagData.map((tag) => tag.id);

    const { error: deleteError } = await supabase
      .from('QuestionTag')
      .delete()
      .eq('question_id', questionId);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete old tags', message: deleteError.message }, { status: 500 });
    }

    const newTags = tagIds.map((tagId: string) => ({
      question_id: questionId,
      tag_id: tagId,
    }));

    const { error: insertError } = await supabase
      .from('QuestionTag')
      .insert(newTags);

    if (insertError) {
      return NextResponse.json({ error: 'Failed to insert new tags', message: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json(questionData, { status: 200 });
}


export async function DELETE(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  const { data: existingQuestion, error: questionCheckError } = await supabase
    .from('Question')
    .select('id')
    .eq('id', questionId)
    .single();

  if (!existingQuestion || questionCheckError) {

    return NextResponse.json({
      message: `Question with id ${questionId} has already been deleted or does not exist.`,
    }, { status: 404 });
  }

  const { error: questionError } = await supabase
    .from('Question')
    .delete()
    .eq('id', questionId);

  if (questionError) {
    return NextResponse.json({ error: `Failed to delete question with id ${questionId}`, message: questionError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Question and related tags deleted successfully' }, { status: 200 });
}
