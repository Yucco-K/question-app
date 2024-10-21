'use client';

import useAuth from '@/app/lib/useAuth';
import QuestionDetail from '../../components/Questions/QuestionDetail';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function QuestionDetailPage() {
  const pathname = usePathname();
  const questionId = pathname.split('/').pop();
  const { session, loading: userLoading } = useAuth();
  const userId = (session?.user as { id?: string })?.id ?? null;

  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (questionId) {
      setId(questionId);
      console.log('Question ID:', questionId);
    }
  }, [questionId]);

  return (
    <div>
      {id ? <QuestionDetail questionId={id} /> : null}
    </div>
  );
}
