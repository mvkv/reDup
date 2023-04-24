import React, { ChangeEvent } from 'react';
import { Check } from 'react-feather';

const ThemedCheckbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (isChecked: boolean) => void;
}) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        className="w-5 h-5 xl:w-6 xl:h-6 appearance-none rounded-md bg-white border-2 xl:border-[3px] border-black cursor-pointer hover:bg-spark-purple-100"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.checked)
        }
      />
      {checked && (
        <Check
          strokeWidth={4}
          className="h-4 xl:h-5 absolute bottom-2 -left-0.5 xl:left-0 text-spark-purple-500 pointer-events-none"
        />
      )}
    </div>
  );
};

export default ThemedCheckbox;
