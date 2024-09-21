// import UserInfo from "../../profile/UserInfo";

export default function QuestionDetailHeader() {
  return (
    <header className="bg-blue-900 text-white py-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto">
        {/* <h1 className="text-xl font-bold">Engineers Q&A Board</h1> */}
        <style jsx>{`
          .logo {
            font-family: 'Exo 2', sans-serif; /* 未来感のあるフォント */
            font-size: 1.5rem; /* ロゴを大きく強調 */
            font-weight: 700;
            color: #1de9b6; /* サイバーブルーの文字色 */
            letter-spacing: 0.1em; /* 少し文字を広げてクールさを強調 */
            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3); /* 軽い影で立体感を演出 */
            position: relative;
          }

          .logo span {
            color: #00acc1; /* Q&Aのアクセントカラー */
          }

          .logo::before {
            content: '';
            position: absolute;
            top: -5px;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #0d47a1, #1de9b6, #00acc1);
            animation: gradientMove 3s infinite;
          }

          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        <div className="logo">
          Engineers <span>Q&A</span> Board
        </div>

        {/* <UserInfo /> */}
      </div>
    </header>
  );
}
