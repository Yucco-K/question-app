// import UserInfo from "../../profile/UserInfo";

export default function QuestionsHeader() {
  return (
    <header className="bg-stone-100 py-4">
      <div className="container mx-auto">
        {/* <h1 className="text-xl font-bold ml-3">Engineers Q&A Board</h1> */}
        <style jsx>{`
  .logo {
    font-family: 'Quicksand', sans-serif; /* 柔らかい丸みのあるフォント */
    font-size: 1.5rem; /* ロゴを大きく目立たせる */
    font-weight: 600;
    color: #ff7043; /* 温かみのあるライトオレンジ */
    letter-spacing: 0.05em; /* 少し間隔を広げて柔らかさを強調 */
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* 軽い影で柔らかな立体感 */
    position: relative;
  }

  .logo span {
    color: #f9a825; /* アクセントのゴールデンイエロー */
  }

  // .logo::before {
  //   content: '';
  //   position: absolute;
  //   top: -8px;
  //   left: 0;
  //   right: 0;
  //   height: 6px;
  //   background: linear-gradient(90deg, #ffcc80, #ff7043, #f9a825);
  //   border-radius: 50px; /* 丸みを持たせたライン */
  //   animation: gradientMove 6s infinite;
  // }

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`}</style>

<div className="logo">
  Engineers <span>Q&A</span> Board
</div>
</div>
    </header>
  );
}
