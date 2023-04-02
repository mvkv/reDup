const InfiniteSpinner = ({ label }: { label?: string }) => {
  return (
    <div className="flex flex-col items-center gap-y-4">
      <div className="w-10 h-10 rounded-full border-t-spark-purple-500 border-spark-purple-400 border-4 border-solid animate-spin"></div>
      {label && <span>{label}</span>}
    </div>
  );
};

export default InfiniteSpinner;
