const Square = ({ isFilled }: { isFilled: boolean }) => (
  <div
    className={`h-4 w-4 ${
      isFilled ? 'bg-spark-purple-700' : 'bg-spark-purple-100'
    } rounded-md`}
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
    <div className="flex gap-x-4">
      <span className="flex gap-x-2 pr-2 items-center">
        {[...Array(maxStep)].map((_, i) => (
          <Square key={i} isFilled={i < currStep} />
        ))}
      </span>
      <span className="font-inter text-lg">{stepLabel}</span>
    </div>
  );
}
