// ui/SelectDropdown.tsx
'use client';

interface SelectDropdownProps {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectDropdown({
  label,
  id,
  options,
  value,
  onChange,
}: SelectDropdownProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-semibold mb-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md p-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
