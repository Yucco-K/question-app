import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function PUT(request: Request, { params }: { params: { answerId: string } }) {
  const { answerId } = params;
  const body = await request.json();

  const { data, error } = await supabase
    .from('Answers')
    .update(body)
    .eq('id', answerId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Answer not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { answerId: string } }) {
  const { answerId } = params;

  const { error } = await supabase
    .from('Answers')
    .delete()
    .eq('id', answerId);

  if (error) {
    return NextResponse.json({ error: 'Answer not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json({ message: 'Answer deleted successfully' }, { status: 200 });
}
