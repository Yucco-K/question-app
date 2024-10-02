'use client';

import { usePathname } from 'next/navigation';
import DefaultLayout from './layout/main/DefaultLayout';
import QuestionsLayout from './layout/main/QuestionsLayout';
import UsersLayout from './layout/main/UsersLayout';
import UserDetailLayout from './layout/main/UserDetailLayout';
import QuestionDetailLayout from './layout/main/QuestionDetailLayout';

import UsersHeader from './layout/header/UsersHeader';
import QuestionsHeader from './layout/header/QuestionsHeader';
import DefaultHeader from './layout/header/DefaultHeader';
import UserDetailHeader from './layout/header/UserDetailHeader';
import QuestionDetailHeader from './layout/header/QuestionDetailHeader';

import UsersFooter from './layout/footer/UsersFooter';
import DefaultFooter from './layout/footer/DefaultFooter';

const AppRouter = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  switch (true) {
    case pathname === '/users/login'|| pathname === '/users/signup' || pathname === '/users/password-reset' || pathname === '/users/new-password' || pathname.startsWith('/users/set-new-password') || pathname === '/users/change-password':
      return (
        <>
          <UsersHeader />
          {/* <UsersLayout
            title=""
            actionText=""
            actionHref=""
            actionLinkText=""
          > */}
            {children}
          {/* </UsersLayout> */}
          <UsersFooter currentYear={new Date().getFullYear()}/>
        </>
      );

    case pathname.startsWith('/users/'):
      return (
        <>
          <UserDetailHeader />
          <UserDetailLayout>{children}</UserDetailLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname === '/questions':
      return (
        <>
          <QuestionsHeader />
          <QuestionsLayout>{children}</QuestionsLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname.startsWith('/question/'):
      return (
        <>
          <QuestionDetailHeader />
          <QuestionDetailLayout>{children}</QuestionDetailLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    default:
      return (
        <>
          {/* <DefaultHeader /> */}
          <DefaultLayout>{children}</DefaultLayout>
          {/* <DefaultFooter currentYear={new Date().getFullYear()} /> */}
        </>
      );
  }
};

export default AppRouter;
