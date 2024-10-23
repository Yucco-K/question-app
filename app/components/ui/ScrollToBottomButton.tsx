import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

interface ScrollToBottomButtonProps {
  isModalOpen: boolean;
}

const ScrollToBottomButton = ({ isModalOpen }: ScrollToBottomButtonProps) => {
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (isModalOpen) return; // モーダルが開いている場合は処理を中断

      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        setIsBottomVisible(false);
      } else {
        setIsBottomVisible(true);
        setIsVisible(true);
      }

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    // モーダルが開いていないときだけスクロールイベントをリッスン
    if (!isModalOpen) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isModalOpen]); // isModalOpenが変更されたときにuseEffectを再実行

  // モーダルが開いている間はスクロールを無効化
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'; // スクロールを無効化
    } else {
      document.body.style.overflow = ''; // スクロールを再有効化
    }

    return () => {
      document.body.style.overflow = ''; // クリーンアップ時にスクロールを再有効化
    };
  }, [isModalOpen]);

  const scrollToBottom = () => {
    setIsVisible(false);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // モーダルが開いている場合はボタンを表示しない
  if (isModalOpen) return null;

  return (
    <>
      {isBottomVisible && isVisible && (
        <button
          onClick={scrollToBottom}
          title="ページの下部に移動"
          className={`fixed bottom-40 right-80 bg-white text-gray-500 p-4 w-8 h-8 rounded-full shadow-lg hover:text-gray-700 flex items-center justify-center
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          style={{ zIndex: 999, transition: 'opacity 0.5s ease, transform 0.5s ease' }}
        >
          <FontAwesomeIcon icon={faArrowDown} size="lg" />
        </button>
      )}
    </>
  );
};

export default ScrollToBottomButton;
