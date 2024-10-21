
export default function UsersHeader() {
  return (
    <header className="bg-blue-900 text-white fixed py-2 pl-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center w-[1200px]">
        <style jsx>{`
          .logo {
            font-family: 'Exo 2', sans-serif;
            font-size: 1.2rem;
            font-weight: 700;
            color: #1de9b6;
            letter-spacing: 0.1em;
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
            position: relative;
          }

          .logo span {
            color: #00acc1;
          }

        `}</style>

        <div className="logo">
          Engineers <span>Q&A</span> Board
        </div>
      </div>
    </header>
  );
}
