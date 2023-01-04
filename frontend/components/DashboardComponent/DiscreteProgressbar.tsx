const Circle = ({ isFilled }: { isFilled: boolean }) => (
  <div
    className={`h-4 w-4 border-solid border-slate-700 border-[1px] ${
      isFilled ? 'bg-slate-600' : 'bg-slate-200'
    } rounded-full`}
  ></div>
);

export function DiscreteProgressBar({
  currStep,
  maxStep,
  stepLabel,
}: {
  currStep: number;
  maxStep: number;
  stepLabel?: string;
}) {
  return (
    <div className="flex gap-x-2">
      <span className="flex gap-x-2 pr-2 items-center">
        {[...Array(maxStep)].map((_, i) => (
          <Circle key={i} isFilled={i < currStep} />
        ))}
      </span>
      <span>{stepLabel}</span>
    </div>
  );
}
