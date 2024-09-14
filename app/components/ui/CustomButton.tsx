// Button.tsx
interface CustomButtonProps {
  label: string;
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, className, onClick }) => {
  return (
    <button className={`px-4 py-2 rounded ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default CustomButton;
