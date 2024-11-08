import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob;

  if (!file) {
    return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 });
  }

  try {
    const fileExt = ((file as File).name || '').split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('avatar_files')
      // .upload(filePath, file);
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

    return NextResponse.json({ publicUrl: publicUrlData.publicUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'サーバーエラー', message: error.message }, { status: 500 });
  }
}
