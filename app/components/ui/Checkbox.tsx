// ui/Checkbox.tsx
'use client';

interface CheckboxProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ label, id, checked, onChange }: CheckboxProps) {
  return (
    <div className="mb-4">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="form-checkbox h-4 w-4"
        />
        <span className="ml-2 text-sm">{label}</span>
      </label>
    </div>
  );
}
