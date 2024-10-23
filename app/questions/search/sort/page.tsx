'use client';

import ScrollToBottomButton from '@/app/components/ui/ScrollToBottomButton';
import SortQuestions from '../../../components/ui/SortQuestions';

export default function SortQuestionsPage() {
  return (
    <div>
      <SortQuestions />
      <ScrollToBottomButton isModalOpen={false} />
    </div>
  );
}
