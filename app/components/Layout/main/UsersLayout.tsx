'use client';

import { ReactNode } from 'react';

interface UsersLink {
  text: string;
  href: string;
  linkText: string;
}

interface UsersLayoutProps {
  title: string;
  children: ReactNode;
  actionText: string;
  actionHref: string;
  actionLinkText: string;
  additionalActions?: UsersLink[];
}

export default function UsersLayout({
  title,
  children,
  actionText,
  actionHref,
  actionLinkText,
  additionalActions = [],
}: UsersLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 style={{ margin: 0 }}">
      <div className="bg-white p-8 mt-2 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-lg font-bold text-center mb-4">{title}</h1>
        <p className="text-center my-4">
          {actionText}{' '}<br/>
          <a href={actionHref} className="text-blue-600 hover:underline">
            {actionLinkText}
          </a>
        </p>
        {additionalActions.map((action, index) => (
          <p key={index} className="text-center my-4">
            {action.text}{' '}<br/>
            <a href={action.href} className="text-blue-600 hover:underline">
              {action.linkText}
            </a>
          </p>
        ))}
        {children}
      </div>
    </div>
  );
}
