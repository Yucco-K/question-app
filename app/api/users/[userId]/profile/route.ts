export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/app/lib/supabaseAdmin';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json(
      { error: 'Bad Request', message: 'User ID is required' },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        }
      }
    );
  }

  const { data: user, error } = await supabase
    .from('User')
    .select('id, email, username, profileImage')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: 'User not found', message: error?.message || 'No user found' },
      {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        }
      }
    );
  }

  return NextResponse.json(
    { id: user.id, email: user.email, username: user.username, profileImage: user.profileImage },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      }
    }
  );
}
