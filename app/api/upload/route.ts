// // app/api/upload/route.ts
// import { NextResponse } from 'next/server';
// import supabase from '../../lib/supabaseClient';

// export async function POST(request: Request) {
//   try {
//     const { fileName, fileType, fileContent } = await request.json();

//     // base64エンコードされたコンテンツをバイナリに変換
//     const buffer = Buffer.from(fileContent, 'base64');

//     const uniqueFileName = `${Date.now()}_${fileName}`;

//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from('attachment_files')
//       .upload(uniqueFileName, buffer, {
//         contentType: fileType,
//         upsert: true,
//       });

//     if (uploadError) {
//       console.error('Upload Error:', uploadError);
//       return NextResponse.json({ error: uploadError.message }, { status: 500 });
//     }

//     const { data: { publicUrl } } = supabase.storage
//       .from('attachment_files')
//       .getPublicUrl(uniqueFileName);

//     if (!publicUrl) {
//       return NextResponse.json({ error: '公開URLの取得に失敗しました。' }, { status: 500 });
//     }

//     // "File" テーブルにファイルの情報を保存
//     const { data: insertData, error: insertError } = await supabase
//       .from('File')
//       .insert([
//         {
//           name: fileName,
//           url: publicUrl,
//           fileType: fileType,
//         },
//       ]);

//     if (insertError) {
//       console.error('Insert Error:', insertError);
//       return NextResponse.json({ error: insertError.message }, { status: 500 });
//     }

//     return NextResponse.json({ url: publicUrl, data: insertData }, { status: 200 });

//   } catch (error) {
//     console.error('Server Error:', error);
//     return NextResponse.json({ error: 'アップロードに失敗しました。' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import supabase from '../../lib/supabaseClient';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob;

  if (!file) {
    return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 });
  }

  try {
    const fileExt = ((file as File).name || '').split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `editor-uploads/${fileName}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('attachment_files')
      .upload(filePath, file);

    if (storageError) {
      throw new Error(`ファイルのアップロードに失敗しました: ${storageError.message}`);
    }

    const { data: publicUrlData } = await supabase.storage
      .from('attachment_files')
      .getPublicUrl(filePath);

    return NextResponse.json({ publicUrl: publicUrlData.publicUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'サーバーエラー', message: error.message }, { status: 500 });
  }
}
