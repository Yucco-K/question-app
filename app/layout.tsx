
import AppRouter from './components/AppRouter';
import { Inter } from "next/font/google";
import "./globals.css";
import { Noto_Sans } from "next/font/google";
import { ModalProvider } from './context/ModalContext';
import { LoadingProvider } from './context/LoadingContext';
import CustomToastContainer from './components/ui/CustomToastContainer';
import { AuthProvider } from './context/AuthContext';
// import { UserProvider } from './context/UserContext';

const inter = Inter({ subsets: ["latin"] });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: 'Engineers Q and A Board',
  description: 'WEBエンジニアが質問や回答を共有するためのプラットフォーム',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
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
          {/* <UserProvider> */}
            <ModalProvider>
              <AuthProvider>
                <AppRouter>
                  {children}
                </AppRouter>
              </AuthProvider>
            </ModalProvider>
          {/* </UserProvider> */}
        </LoadingProvider>
      </body>
    </html>
  );
}
