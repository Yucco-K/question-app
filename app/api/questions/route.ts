import { NextResponse } from 'next/server';
import supabase from '../../lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from('Questions')
    .select('*')
    .range(start, end);

  if (error) {
    return NextResponse.json({ error: 'Server Error', message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, tags } = body;

  if (!title || !description) {
    return NextResponse.json({ error: 'Bad Request', message: 'Title and description are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('Questions')
    .insert([{ title, description, tags }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Server Error', message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
