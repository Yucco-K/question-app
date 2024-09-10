import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function POST(request: Request) {
  const { email } = await request.json();

  const { data, error } = await supabase
    .from('User')
    .select('email')
    .eq('email', email)
    .single();

  if (error || !data) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({ exists: true });
}
