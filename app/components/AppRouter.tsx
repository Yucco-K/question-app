'use client';

export const fetchCache = 'force-no-store';

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
import PublicQuestionsHeader from './Layout/header/PublicQuestionsHeader';
import QuestionsNavigation from './Layout/nav/QuestionsNavigation';
import PublicQuestionsNavigation from './Layout/nav/PublicQuestionsNavigation';
import MobilePublicQuestionNav from './Layout/nav/MobilePublicQuestionsNav';
import UserDetailLayout from './Layout/main/UserDetailLayout';
import UserDetailHeader from './Layout/header/UserDetailHeader';
import QuestionHeader from './Layout/header/QuestionHeader';
import { useState } from 'react';
import DefaultNavigation from './Layout/nav/DefaultNavigation';
import MobileQuestionsNav from './Layout/nav/MobileQuestionsNav';

const AppRouter = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearchTool = () => {
    setIsSearchOpen(!isSearchOpen);
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
          <DefaultNavigation />
          <UserDetailLayout>{children}</UserDetailLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname === '/questions/public':
      return (
        <>
          <PublicQuestionsHeader toggleSearchTool={toggleSearchTool}  />
          <PublicQuestionsNavigation />
          <QuestionsLayout>{children}</QuestionsLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname === '/questions/public/mobile':
      return (
        <>
          <PublicQuestionsHeader toggleSearchTool={toggleSearchTool}  />
          <MobilePublicQuestionNav />
          <QuestionsLayout>{children}</QuestionsLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname === '/questions':
      return (
        <>
          <QuestionHeader />
          <QuestionsNavigation />
          <QuestionsLayout>{children}</QuestionsLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

      case pathname === '/questions/mobile':
      return (
        <>
          <QuestionHeader />
          <MobileQuestionsNav />
          <QuestionsLayout>{children}</QuestionsLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );

    case pathname.startsWith('/questions/search'):
      return (
        <>
          <DefaultHeader />
          <DefaultNavigation />
          <QuestionDetailLayout>{children}</QuestionDetailLayout>
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
          <DefaultNavigation />
          <DefaultLayout>{children}</DefaultLayout>
          <DefaultFooter currentYear={new Date().getFullYear()} />
        </>
      );
  }
};

export default AppRouter;
