export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';
import { revalidateTag } from 'next/cache';

export async function GET(request: Request, { params }: { params: { draftId: string } }) {
  const { draftId } = params;

  const { data, error } = await supabase
    .from('Question')
    .select('*')
    .eq('id', draftId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Draft not found', message: error?.message || 'No data found' }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}


export async function PUT(request: Request, { params }: { params: { draftId: string } }) {
  const { draftId } = params;
  const body = await request.json();


  const { data, error } = await supabase
  .from('Question')
  .update({ ...body })
  .eq('id', draftId)
  .single();

  if (error) {
    return NextResponse.json({ error: 'Draft not found', message: error.message }, { status: 404 });
  }

  revalidateTag('*');

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { draftId: string } }) {
  const { draftId } = params;

  const { error } = await supabase
    .from('Question')
    .delete()
    .eq('id', draftId)

  if (error) {
    return NextResponse.json({ error: 'Draft not found', message: error.message }, { status: 404 });
  }

  revalidateTag('*');

  return NextResponse.json({ message: 'Draft deleted successfully' }, { status: 200 });
}