// app/api/users/[userId]/profile/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/app/lib/supabaseAdmin';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Bad Request', message: 'User ID is required' }, { status: 400 });
  }

  const { data: user, error } = await supabase
    .from('User')
    .select('id, username, profileImage')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found', message: error?.message || 'No user found' }, { status: 404 });
  }

  return NextResponse.json({ id: user.id, username: user.username, profileImage: user.profileImage }, { status: 200 });
}