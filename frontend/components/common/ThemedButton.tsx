const ThemedButton = ({
  label,
  onClick,
  isLoading,
  isDisabled,
  className,
}: {
  label: string | number;
  onClick?: any;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}) => {
  const btnShouldBeDisabled = isLoading || isDisabled;
  return (
    <button
      {...(onClick && { onClick: onClick })}
      className={`px-5 py-2.5  grid place-content-center rounded-lg font-inter select-none text-base text-spark-purple-50 ${className}
      ${
        btnShouldBeDisabled
          ? 'bg-gray-400 hover:bg-gray-400'
          : 'bg-spark-purple-600 hover:bg-spark-purple-800'
      }
      ${isLoading ? ' cursor-progress' : ''}
      `}
      disabled={btnShouldBeDisabled ?? false}
    >
      {label}
    </button>
  );
};

export default ThemedButton;
