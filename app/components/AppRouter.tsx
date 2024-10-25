'use client';

import { usePathname } from 'next/navigation';
import DefaultLayout from './Layout/main/DefaultLayout';
import QuestionsLayout from './Layout/main/QuestionsLayout';
import QuestionDetailLayout from './Layout/main/QuestionDetailLayout';

import UsersHeader from './Layout/header/UsersHeader';
import DefaultHeader from './Layout/header/DefaultHeader';

import UsersFooter from './Layout/footer/UsersFooter';
import DefaultFooter from './Layout/footer/DefaultFooter';
import QuestionDetailNav from './Layout/nav/QuestionDetailNav';
import UsersNavigation from './Layout/nav/UsersNavigation';
import UserDetailNav from './Layout/nav/UserDetailNav';
import PublicQuestionsHeader from './Layout/header/PublicQuestionsHeader';
import QuestionsNavigation from './Layout/nav/QuestionsNavigation';
import PublicQuestionsNavigation from './Layout/nav/PublicQuestionsNavigation';
import UserDetailLayout from './Layout/main/UserDetailLayout';
// import UsersLayout from './Layout/main/UsersLayout';
import UserDetailHeader from './Layout/header/UserDetailHeader';
import QuestionHeader from './Layout/header/QuestionHeader';
import { useState } from 'react';

const AppRouter = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearchTool = () => {
    setIsSearchOpen(!isSearchOpen);  // 検索ツールの開閉
  };

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
          <UserDetailHeader />
          <UserDetailNav />
          <UserDetailLayout>{children}</UserDetailLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname === '/questions/public' || pathname === '/questions/public/mobile':
      return (
        <>
          <PublicQuestionsHeader toggleSearchTool={toggleSearchTool}  />
          <PublicQuestionsNavigation />
          <QuestionsLayout>{children}</QuestionsLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname === '/questions' || pathname === '/questions/mobile':
      return (
        <>
          <QuestionHeader toggleSearchTool={toggleSearchTool} />
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
          <UserDetailNav />
          <DefaultLayout>{children}</DefaultLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );
  }
};

export default AppRouter;
