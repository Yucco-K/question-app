
export default function DefaultFooter({ currentYear }: { currentYear: number }) {
  return (
    <footer className="bg-blue-900 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>© {currentYear} Engineer Q&A Board. All rights reserved.</p>
      </div>
    </footer>
  );
}
