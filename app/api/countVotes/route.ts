export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import supabase from "../../lib/supabaseClient";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const answerId = searchParams.get("answerId");

	if (!answerId) {
		return NextResponse.json(
			{ message: "answerIdが必要です" },
			{ status: 400 }
		);
	}

	try {
		const { data: upvoteData, error: upvoteError } = await supabase
			.from("Vote")
			.select("id", { count: "exact" })
			.eq("answer_id", answerId)
			.eq("type", "up");

		const { data: downvoteData, error: downvoteError } = await supabase
			.from("Vote")
			.select("id", { count: "exact" })
			.eq("answer_id", answerId)
			.eq("type", "down");

		if (upvoteError || downvoteError) {
			return NextResponse.json(
				{ message: "カウントの取得に失敗しました" },
				{ status: 500 }
			);
		}

		const upvoteCount = upvoteData.length;
		const downvoteCount = downvoteData.length;

		return NextResponse.json({ upvoteCount, downvoteCount }, { status: 200 });
	} catch (error: unknown) {
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 500 }
		);
	}
}
