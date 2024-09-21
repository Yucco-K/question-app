
import AppRouter from './components/AppRouter';
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from './context/UserContext';
import { Noto_Sans } from "next/font/google";
// import { Noto_Serif } from "next/font/google";
import { ModalProvider } from './context/ModalContext';
import { LoadingProvider } from './context/LoadingContext';


const inter = Inter({ subsets: ["latin"] });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "700"] });
// const notoSerif = Noto_Serif({ subsets: ["latin"], weight: ["400", "700"] });

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
      <body className={notoSans.className}>
        <LoadingProvider>
          <UserProvider>
            <ModalProvider>
              <AppRouter>
                {children}
              </AppRouter>
            </ModalProvider>
          </UserProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
