import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  const { data, error } = await supabase
    .from('Questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Question not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;
  const body = await request.json();

  const { data, error } = await supabase
    .from('Questions')
    .update(body)
    .eq('id', questionId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Question not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  const { error } = await supabase
    .from('Questions')
    .delete()
    .eq('id', questionId);

  if (error) {
    return NextResponse.json({ error: 'Question not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json({ message: 'Question deleted successfully' }, { status: 200 });
}
