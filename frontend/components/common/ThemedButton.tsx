export enum ThemedButtonKind {
  PRIMARY_ACTION = 1,
  PRIMARY_DISABLED = 2,
  PRIMARY_LOADING = 3,
  SECONDARY_ACTION = 4,
}

const ThemedButton = ({
  label,
  onClick,
  buttonKind = ThemedButtonKind.PRIMARY_ACTION,
  className,
}: {
  label: string | number;
  onClick?: any;
  buttonKind?: ThemedButtonKind;
  className?: string;
}) => {
  const btnShouldBeDisabled =
    buttonKind === ThemedButtonKind.PRIMARY_LOADING ||
    buttonKind === ThemedButtonKind.PRIMARY_DISABLED;

  const isSecondaryButton = buttonKind === ThemedButtonKind.SECONDARY_ACTION;
  const isLoadingButton = buttonKind === ThemedButtonKind.PRIMARY_LOADING;

  const whiteTextTw = 'text-spark-purple-50';
  const KIND_TO_TEXT = new Map<ThemedButtonKind, string>([
    [ThemedButtonKind.PRIMARY_ACTION, whiteTextTw],
    [ThemedButtonKind.PRIMARY_DISABLED, whiteTextTw],
    [ThemedButtonKind.PRIMARY_LOADING, whiteTextTw],
    [ThemedButtonKind.SECONDARY_ACTION, 'text-gray-800'],
  ]);

  const disabledBgTw = 'bg-gray-400 hover:bg-gray-400';
  const KIND_TO_BG = new Map<ThemedButtonKind, string>([
    [
      ThemedButtonKind.PRIMARY_ACTION,
      'bg-spark-purple-600 hover:bg-spark-purple-800',
    ],
    [ThemedButtonKind.PRIMARY_DISABLED, disabledBgTw],
    [ThemedButtonKind.PRIMARY_LOADING, disabledBgTw],
    [ThemedButtonKind.SECONDARY_ACTION, 'bg-gray-50 hover:bg-gray-100'],
  ]);

  return (
    <button
      {...(onClick && { onClick: onClick })}
      className={`px-5 py-2.5 grid place-content-center rounded-lg font-inter select-none text-base
      ${KIND_TO_TEXT.get(buttonKind)}
      ${KIND_TO_BG.get(buttonKind)}
      ${isLoadingButton ? ' cursor-progress' : ''}
      ${className ?? ''}
      `}
      disabled={btnShouldBeDisabled ?? false}
    >
      {label}
    </button>
  );
};

export default ThemedButton;
