export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-blue-900 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>© {currentYear} Question App. All rights reserved.</p>
      </div>
    </footer>
  );
}
