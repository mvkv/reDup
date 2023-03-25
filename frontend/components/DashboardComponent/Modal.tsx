import { Dispatch, ReactNode, SetStateAction } from 'react';
import { AlertCircle, AlertTriangle, X } from 'react-feather';
import ThemedButton from '../common/ThemedButton';
export enum Modal {
  NO_MODAL,
  WARNING,
}

export type ModalData = {
  type: Modal;
  onWarningDismiss?: Function;
  content?: ReactNode;
};

export type SetModal = {
  setModal: Dispatch<SetStateAction<ModalData>>;
};

export const FADED_BACKGROUND_TW_CLASSES =
  'grayscale-[80%] blur-[2px] pointer-events-none select-none overflow-hidden';
export const WarningDialogTemplate = ({
  setModal,
  onWarningDismiss,
  content,
}: SetModal & Partial<ModalData>) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="max-w-[420px] p-5 rounded-md shadow-xl bg-slate-50">
        <div className="flex flex-col gap-y-6 items-center py-4">
          <WarningConcentricPulseCircle />
          <div className="font-inter text-center font-bold">{content}</div>
          <div className="flex gap-x-2 self-stretch">
            <ThemedButton
              label={'Cancel'}
              className={'flex-grow'}
              onClick={() => {
                setModal({ type: Modal.NO_MODAL });
              }}
            />
            <ThemedButton
              label={'Ok'}
              className={'flex-grow'}
              onClick={() => {
                onWarningDismiss!();
                setModal({ type: Modal.NO_MODAL });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
import colors from 'tailwindcss/colors';
const WarningConcentricPulseCircle = () => {
  return (
    <>
      <div className="relative flex">
        <div className="w-[44px] h-[44px] border-solid bg-orange-100 rounded-full absolute opacity-50 animate-slow-ping"></div>
        <div className="p-2 border-solid bg-orange-100 rounded-full">
          <AlertTriangle size={28} stroke={colors.orange[500]} />
        </div>
      </div>
    </>
  );
};
