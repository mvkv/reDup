const Square = ({ isFilled }: { isFilled: boolean }) => (
  <div
    className={`h-3 w-3 xl:h-4 xl:w-4 ${
      isFilled ? 'bg-spark-purple-700' : 'bg-spark-purple-100'
    } rounded-sm xl:rounded-lg`}
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
    <div className="flex gap-x-3 xl:gap-x-4">
      <span className="flex gap-x-2 xl:pr-2 items-center">
        {[...Array(maxStep)].map((_, i) => (
          <Square key={i} isFilled={i < currStep} />
        ))}
      </span>
      <span className="font-inter xl:text-lg">{stepLabel}</span>
    </div>
  );
}
