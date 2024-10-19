
// import CreateUser from './components/top/CreateUser';
import Greeting from './components/top/Greeting';
// import MaintenanceBoard from './components/top/MaintenanceBoard';


export default function HomePage() {


  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col justify-between">
      <div className="mb-4">
        {/* メンテナンス情報 */}
        {/* <MaintenanceBoard /> */}
      </div>

        {/* ユーザー作成 */}
        {/* <CreateUser /> */}

      {/* 挨拶の表示 */}
      <Greeting />
    </div>
  );
}
