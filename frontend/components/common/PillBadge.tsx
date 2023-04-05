const PillBadge = ({
  isFontMono = false,
  extraClasses,
  children,
}: {
  isFontMono?: boolean;
  extraClasses?: string | null;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`${extraClasses ?? ''} ${
        isFontMono ? 'font-mono' : 'font-inter'
      } flex justify-center items-center gap-x-2 xl:gap-x-4 text-sm xl:text-base rounded-lg px-2 xl:px-4 py-1 shadow-md`}
    >
      {children}
    </div>
  );
};

export default PillBadge;
