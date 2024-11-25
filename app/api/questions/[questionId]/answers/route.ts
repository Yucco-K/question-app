import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { questionId: string } }) {
  try {
    const { questionId } = params;

    if (!questionId) {
      return NextResponse.json({ error: 'Bad Request', message: 'Question ID is required' }, { status: 400 });
    }

    const { data: questionData, error: questionError } = await supabase
      .from('Question')
      .select('best_answer_id')
      .eq('id', questionId)
      .single();

    if (questionError) {
      return NextResponse.json({ error: 'Question not found', message: questionError.message }, { status: 404 });
    }

    const bestAnswerId = questionData?.best_answer_id;

    const { data: answersData, error: answersError } = await supabase
      .from('Answer')
      .select(`id, content, user_id, created_at, Vote(type), User(username)`)
      .eq('question_id', questionId);

    if (answersError) {
      return NextResponse.json({ error: 'Answers not found', message: answersError.message }, { status: 404 });
    }

    if (!answersData || answersData.length === 0) {
      return NextResponse.json({ message: 'No answers found for this question.' }, { status: 200 });
    }

    const answers = answersData.map((answer: { id: string; content: string; user_id: string; created_at: string; Vote: { type: string }[]; User: { username: string }[] }) => {
      const votes = answer.Vote || [];
      const votesUp = votes.filter((vote: { type: string; }) => vote.type === 'up').length;
      const votesDown = votes.filter((vote: { type: string; }) => vote.type === 'down').length;

      return {
        id: answer.id,
        content: answer.content,
        user_id: answer.user_id,
        created_at: answer.created_at,
        votes_up: votesUp,
        votes_down: votesDown,
        is_best_answer: answer.id === bestAnswerId,
      };
    });

    const sortedAnswers = answers.sort((a, b) => {

      if (a.is_best_answer) return -1;
      if (b.is_best_answer) return 1;

      const scoreA = a.votes_up - a.votes_down;
      const scoreB = b.votes_up - b.votes_down;

      return scoreB - scoreA;
    });

    const answerUsersData = answersData.map((answer) => ({
      id: answer.user_id,
      username: answer.User?.[0]?.username || 'Unknown',
    }));

    return NextResponse.json(
      {
        answers: sortedAnswers,
        answerUsersData,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('エラー:', (err as Error).message);
    return NextResponse.json({ error: 'Server Error', message: (err as Error).message }, { status: 500 });
  }
}
