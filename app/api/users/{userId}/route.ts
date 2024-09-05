import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'User not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const body = await request.json();

  const { data, error } = await supabase
    .from('User')
    .update(body)
    .eq('id', userId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'User not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  const { error } = await supabase
    .from('User')
    .delete()
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: 'User not found', message: error.message }, { status: 404 });
  }

  return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
}
