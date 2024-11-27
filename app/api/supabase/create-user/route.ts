import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function GET() {

  // const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  // if (listError) {
  //   return NextResponse.json({ error: listError.message }, { status: 500 });
  // }

  // if (!userList || !userList.users) {
  //   return NextResponse.json({ message: 'No users found', data: userList }, { status: 404 });
  // }

  // const existingUser = userList.users.find((user: { email?: string; }) => user.email === 'user2@example.com');

  // if (existingUser) {
  //   return NextResponse.json({ message: 'User already exists', data: existingUser }, { status: 409 });
  // }


  // ※ Create a new user: データ値を変更することで、新しいユーザーを作成することができます。プロパティ名などは変更せずに使用します。

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'user1@example.com',
    password:'',
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const newUserId = data.user.id;

  const { error: userUpsertError } = await supabaseAdmin
    .from("User")
    .upsert([
      {
        id: newUserId,
        username: 'user1',
        role: 'Student',
        created_at: '2023-01-01 10:00:00'
      }
    ]);

  if (userUpsertError) {
    return NextResponse.json({ error: userUpsertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User created and upserted successfully', data });
}
