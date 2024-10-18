'use client';
interface CustomButtonProps {
  label: string;
  className: string;
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, className, onClick }) => {
  return (
    <button className={`px-4 py-3 rounded ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default CustomButton;
