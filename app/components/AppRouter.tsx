'use client';

import { usePathname } from 'next/navigation';
import DefaultLayout from './layout/main/DefaultLayout';
import QuestionsLayout from './layout/main/QuestionsLayout';
import QuestionDetailLayout from './layout/main/QuestionDetailLayout';

import UsersHeader from './layout/header/UsersHeader';
import DefaultHeader from './layout/header/DefaultHeader';

import UsersFooter from './layout/footer/UsersFooter';
import DefaultFooter from './layout/footer/DefaultFooter';
import QuestionDetailNav from './layout/nav/QuestionDetailNav';
import UsersNavigation from './layout/nav/UsersNavigation';
import UserDetailNav from './layout/nav/UserDetailNav';
import PublicQuestionsHeader from './layout/header/PublicQuestionsHeader';
import QuestionsNavigation from './layout/nav/QuestionsNavigation';
import PublicQuestionsNavigation from './layout/nav/PublicQuestionsNavigation';
import UserDetailLayout from './layout/main/UserDetailLayout';
import UsersLayout from './layout/main/UsersLayout';

const AppRouter = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  switch (true) {
    case pathname === '/users/login'|| pathname === '/users/signup' || pathname === '/users/set-new-password' || pathname === '/users/change-password':
      return (
        <>
          <UsersHeader />
          <UsersNavigation />
          {children}
          <UsersFooter currentYear={new Date().getFullYear()}/>
        </>
      );

    case pathname.startsWith('/users/'):
      return (
        <>
          <DefaultHeader />
          <UserDetailNav />
          <UserDetailLayout>{children}</UserDetailLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname === '/questions/public':
      return (
        <>
          <PublicQuestionsHeader />
          <PublicQuestionsNavigation />
          <QuestionsLayout>{children}</QuestionsLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname === '/questions':
      return (
        <>
          <DefaultHeader />
          <QuestionsNavigation />
          <QuestionsLayout>{children}</QuestionsLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname.startsWith('/questions/'):
      return (
        <>
          <DefaultHeader />
          <QuestionDetailNav/>
          <QuestionDetailLayout>{children}</QuestionDetailLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

      case pathname === '/':
        return (
          <>
            {children}
          </>
        );

    default:
      return (
        <>
          <DefaultHeader />
          <DefaultLayout>{children}</DefaultLayout>
          {/* <DefaultFooter currentYear={new Date().getFullYear()} /> */}
        </>
      );
  }
};

export default AppRouter;
