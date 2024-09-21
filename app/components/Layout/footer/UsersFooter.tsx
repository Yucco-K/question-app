
export default function UsersFooter({ currentYear }: { currentYear: number }) {
  return (
    <footer className="bg-blue-900 text-white py-4 pt-8">
      <div className="container mx-auto text-center">
        <p>© {currentYear} Engineers Q&A Board. All rights reserved.</p>
      </div>
    </footer>
  );
}
