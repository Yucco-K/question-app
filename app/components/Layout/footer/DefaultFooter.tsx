import Link from 'next/link';

export default function DefaultFooter({ currentYear }: { currentYear: number }) {
  return (
    <footer className="bg-blue-900 text-xs text-white py-4 mt-20">
      <div className="container mx-auto text-center">
        <ul className="mt-4 flex justify-center space-x-4">
          <li>
            <Link href="/link/terms">利用規約</Link>
          </li>
          <li>
            <span className="text-gray-400">｜</span>
          </li>
          <li>
            <Link href="/link/privacy-policy">プライバシーポリシー</Link>
          </li>
          <li>
            <span className="text-gray-400">｜</span>
          </li>
          <li>
            <Link href="/link/contact">お問い合わせ</Link>
          </li>
        </ul>
        <p className='my-4'>© {currentYear} Engineer Q&A Board. All rights reserved.</p>
      </div>
    </footer>
  );
}
