'use client';

import React from 'react';
import CustomButton from './CustomButton';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className }) => {
  return (
    <button className={`px-4 py-2 rounded ${className}`}>
      {children}
    </button>
  );
};

// ButtonGroup のプロパティとして pattern と buttons を定義
interface ButtonGroupProps {
  pattern: number;
  buttons: { label: string; className: string; onClick: () => void }[];
  buttonsPerRow: number[]; // 各行のボタン数を配列で指定
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ pattern, buttons, buttonsPerRow }) => {
  // 行ごとのボタン数を基にクラスを割り当てる
  const getButtonWidthClass = (index: number, rowIndex: number) => {
    const buttonCountInRow = buttonsPerRow[rowIndex]; // 各行のボタン数を取得

    // ボタン数に基づいた幅クラスを設定
    switch (buttonCountInRow) {
      case 1:
        return 'md:w-full';
      case 2:
        return 'md:w-1/2';
      case 3:
        return 'md:w-1/3';
      case 4:
        return 'md:w-1/4';
      default:
        return 'md:w-full'; // デフォルト
    }
  };

  // ボタンを行ごとに分割して表示
  const renderButtons = () => {
    let buttonIndex = 0;

    return buttonsPerRow.map((buttonCount, rowIndex) => {
      const rowButtons = buttons.slice(buttonIndex, buttonIndex + buttonCount); // 各行のボタンを取得
      buttonIndex += buttonCount;

      return (
        <div key={rowIndex} className="flex space-x-4 my-8">
          {rowButtons.map((button, index) => (
            <CustomButton
              key={index}
              label={button.label}
              className={`w-full ${getButtonWidthClass(index, rowIndex)} ${button.className}`}
              onClick={button.onClick}
            />
          ))}
        </div>
      );
    });
  };

  return <div>{renderButtons()}</div>;
};

export default ButtonGroup;
