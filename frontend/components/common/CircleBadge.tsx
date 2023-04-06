const CircleBadge = ({ label }: { label: string | number }) => {
  return (
    <span className="min-w-[32px] h-8 grid place-content-center rounded-full border-2 border-spark-purple-600 bg-spark-purple-50 font-inter select-none ">
      {label}
    </span>
  );
};

export default CircleBadge;
