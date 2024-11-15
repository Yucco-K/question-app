import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 });
  }

  try {
    // サーバー側でファイル名を生成
    const fileExt = file.name.split('.').pop();
    const baseName = file.name.split('.').slice(0, -1).join('.');
    const timestamp = Date.now();
    const safeBaseName = encodeURIComponent(baseName);
    const filePath = `${safeBaseName}_${timestamp}.${fileExt}`;

    // ファイルをアップロード
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

    if (!publicUrlData) {
      console.error('Failed to generate public URL');
      return NextResponse.json({ error: '公開URLの生成に失敗しました' }, { status: 500 });
    }

    console.log('Public URL generated:', publicUrlData.publicUrl);

    return NextResponse.json({ publicUrl: publicUrlData.publicUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Server error:', error.message);
    return NextResponse.json({ error: 'サーバーエラー', message: error.message }, { status: 500 });
  }
}
