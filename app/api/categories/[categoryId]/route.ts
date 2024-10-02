import { NextResponse } from 'next/server';
import supabase from '@/app/lib/supabaseClient';

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;

  if (!categoryId) {
    return NextResponse.json({ message: 'Category ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('Category')
    .select('name')
    .eq('id', categoryId)
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ name: data?.name }, { status: 200 });
}
