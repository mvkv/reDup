export function InteractiveStatesWrapper({
  firstHeaderGroup,
  secondHeaderGroup,
  content,
}: {
  firstHeaderGroup: React.ReactNode;
  secondHeaderGroup: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div className="place-self-start flex flex-col gap-y-4 min-w-full">
      <div className="flex flex-col lg:flex-row justify-between flex-wrap gap-y-2">
        <div className="flex items-center gap-x-2 xl:gap-x-4">
          {firstHeaderGroup}
        </div>
        <div className="flex items-center gap-x-2 xl:gap-x-4">
          {secondHeaderGroup}
        </div>
      </div>
      <div>{content}</div>
    </div>
  );
}
