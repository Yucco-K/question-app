'use client';

import QuestionDetail from '../../components/Questions/QuestionDetail';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QuestionDetailPage() {
  const pathname = usePathname();
  const questionId = pathname.split('/').pop();

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
