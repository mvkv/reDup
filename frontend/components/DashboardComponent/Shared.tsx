export function InteractiveStatesWrapper({
  firstHeaderGroup,
  secondHeaderGroup,
  children,
}: {
  firstHeaderGroup: React.ReactNode;
  secondHeaderGroup: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="place-self-start flex flex-col gap-y-4 min-w-full">
      <div className="flex flex-col lg:flex-row justify-between flex-wrap gap-y-3">
        <div className="flex items-center gap-x-2 xl:gap-x-4">
          {firstHeaderGroup}
        </div>
        <div className="flex items-center flex-wrap gap-2 xl:gap-x-4">
          {secondHeaderGroup}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
