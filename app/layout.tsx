
import AppRouter from './components/AppRouter';
import { Inter } from "next/font/google";
import "./globals.css";
import { Noto_Sans } from "next/font/google";
import { ModalProvider } from './context/ModalContext';
import { LoadingProvider } from './context/LoadingContext';
import CustomToastContainer from './components/ui/CustomToastContainer';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ["latin"] });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "700"] });

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

      <CustomToastContainer />

        <LoadingProvider>
            <ModalProvider>
              <AuthProvider>
                <AppRouter>
                  {children}
                </AppRouter>
              </AuthProvider>
            </ModalProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
