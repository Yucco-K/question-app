import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { voteId: string } }) {
  const { voteId } = params;

  const { data, error } = await supabase
    .from('Votes')
    .select('*')
    .eq('id', voteId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Vote not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { voteId: string } }) {
  const { voteId } = params;
  const body = await request.json();

  const { data, error } = await supabase
    .from('Votes')
    .update(body)
    .eq('id', voteId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Vote not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { voteId: string } }) {
  const { voteId } = params;

  const { error } = await supabase
    .from('Votes')
    .delete()
    .eq('id', voteId);

  if (error) {
    return NextResponse.json({ error: 'Vote not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json({ message: 'Vote deleted successfully' }, { status: 200 });
}
