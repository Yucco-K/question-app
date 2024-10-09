import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomToastContainer() {
  return (
    <ToastContainer
      position="top-right"     // トーストの表示位置
      autoClose={3000}         // 自動で閉じる時間 (ミリ秒)
      hideProgressBar={false}  // プログレスバーを表示するかどうか
      newestOnTop={false}      // 新しい通知を上に表示するかどうか
      closeOnClick             // クリックでトーストを閉じる
      rtl={false}              // 右から左への表示（アラビア語などのRTL対応）
      pauseOnFocusLoss         // フォーカスを失ったときに一時停止するかどうか
      draggable                // ドラッグで移動可能にするかどうか
      pauseOnHover             // マウスホバー中は一時停止するかどうか
    />

      //以下の位置オプションが利用可能:
      // "top-right"
      // "top-center"
      // "top-left"
      // "bottom-right"
      // "bottom-center"
      // "bottom-left"

  );
}
