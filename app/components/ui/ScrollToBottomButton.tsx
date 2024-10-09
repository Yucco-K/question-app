import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

const ScrollToBottomButton = () => {
  const [isBottomVisible, setIsBottomVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        setIsBottomVisible(false);
      } else {
        setIsBottomVisible(true);
        setIsVisible(true);
      }
    // タイマーが動作中であればクリア
    if (timer) {
      clearTimeout(timer);
    }

    // ボタンが表示されてから3秒後に非表示にする
    timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 3秒後に非表示
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) {
        clearTimeout(timer); // コンポーネントがアンマウントされたらタイマーをクリア
      }
    };
  }, []);

  const scrollToBottom = () => {
    setIsVisible(false);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <>
      {isBottomVisible && isVisible && (
        <button
          onClick={scrollToBottom}
          title="ページの下部に移動"
          className={`fixed bottom-13 right-8 bg-white text-gray-500 p-4 w-8 h-8 rounded-full shadow-lg hover:text-gray-700 flex items-center justify-center
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
