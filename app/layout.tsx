
import AppRouter from './components/AppRouter';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from './context/UserContext';


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Engineer Q&A Board',
  description: 'Webエンジニアが質問や回答を共有するためのプラットフォーム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <UserProvider>
        <AppRouter>
          {children}
        </AppRouter>
        </UserProvider>
      </body>
    </html>
  );
}
