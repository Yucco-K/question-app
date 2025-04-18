export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const formData = await request.formData();
  // const file = formData.get('file') as Blob;
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 });
  }

  try {
    const fileExt = ((file as File).name || '').split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const timestamp = new Date().toISOString();
    const filePath = `${fileName}?t=${encodeURIComponent(timestamp)}`;

    console.log('filePath:', filePath);

    const { data: storageData, error: storageError } = await supabase.storage
      .from('avatar_files')
      .upload(filePath, file, {
        cacheControl: '0',
        upsert: true,
      });

    if (storageError) {
      throw new Error(`ファイルのアップロードに失敗しました: ${storageError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatar_files')
      .getPublicUrl(filePath);

      console.log('publicUrlData:', publicUrlData);

    revalidateTag('*');

    return NextResponse.json({ publicUrl: publicUrlData.publicUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'サーバーエラー', message: error.message }, { status: 500 });
  }
}
