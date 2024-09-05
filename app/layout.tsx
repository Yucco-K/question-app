import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MainLayout from "./components/Layout/MainLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Engineer Q&A Board",
  description: "A platform for web engineers to ask and answer questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
