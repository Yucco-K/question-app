
import AppRouter from './components/AppRouter';
import { Inter } from "next/font/google";
import "./globals.css";
import { Noto_Sans } from "next/font/google";
import { ModalProvider } from './context/ModalContext';
import { LoadingProvider } from './context/LoadingContext';
import CustomToastContainer from './components/ui/CustomToastContainer';
import { AuthProvider } from './context/AuthContext';
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: 'Engineer Q and A Board',
  description: 'WEBエンジニアが質問や回答を共有するためのプラットフォーム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <script
          src="https://cdn.tiny.cloud/1/s2deuv7kapk0e6ioxt0okon8isbruiiqevexvh7r4ap7depu/tinymce/7/tinymce.min.js"
          referrerPolicy="origin"
        ></script> */}
      </Head>
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
