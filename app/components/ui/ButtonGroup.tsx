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

interface ButtonGroupProps {
  pattern: number;
  buttons: { label: string; className: string; onClick: () => void }[];
  buttonsPerRow: number[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ pattern, buttons, buttonsPerRow }) => {

  // PC用のボタン幅クラスを取得
  const getButtonWidthClass = (index: number, rowIndex: number) => {
    const buttonCountInRow = buttonsPerRow[rowIndex];

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
        return 'md:w-full';
    }
  };

  // ボタンをレンダリング
  const renderButtons = () => {
    let buttonIndex = 0;

    return buttonsPerRow.map((buttonCount, rowIndex) => {
      const rowButtons = buttons.slice(buttonIndex, buttonIndex + buttonCount);
      buttonIndex += buttonCount;

      return (
        <div key={rowIndex} className="flex justify-center space-x-4 my-8 mx-auto">
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
