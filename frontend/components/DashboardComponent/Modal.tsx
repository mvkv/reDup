import { Dispatch, ReactNode, SetStateAction } from 'react';
import { X } from 'react-feather';

export enum Modal {
  NO_MODAL,
  ERROR,
  WARNING,
}

export type ModalData = {
  type: Modal;
  onWarningDismiss?: Function;
  content?: ReactNode;
};

export type SetModal = { setModal: Dispatch<SetStateAction<ModalData>> };

export const FADED_BACKGROUND_TW_CLASSES =
  'grayscale-[80%] blur-[2px] pointer-events-none select-none overflow-hidden';
export const ModalTemplate = ({
  setModal,
  onWarningDismiss,
  content,
}: SetModal & Partial<ModalData>) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="min-h-[60px] min-w-[200px] p-4 border-solid border-black border-2 rounded-md shadow-lg bg-slate-200">
        <div className="flex flex-col gap-y-4 items-center">
          <button
            className="self-end"
            onClick={() => setModal({ type: Modal.NO_MODAL })}
          >
            <X size={24} />
          </button>
          <div>{content}</div>
          {onWarningDismiss && (
            <button
              className="px-5 py-2 border-black border-2 rounded-md w-fit"
              onClick={() => {
                onWarningDismiss!();
                setModal({ type: Modal.NO_MODAL });
              }}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
