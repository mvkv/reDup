import { Dispatch, ReactNode, SetStateAction } from 'react';
import { AlertTriangle } from 'react-feather';
import ThemedButton, { ThemedButtonKind } from '../common/ThemedButton';

import colors from 'tailwindcss/colors';

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

export const WarningDialogTemplate = ({
  setModal,
  onWarningDismiss,
  content,
}: SetModal & Partial<ModalData>) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 ">
      <div className="max-w-[420px] p-5 rounded-md shadow-2xl bg-slate-50">
        <div className="flex flex-col gap-y-6 items-center py-4 px-6">
          <WarningConcentricPulseCircle />
          <div className="font-inter text-center">{content}</div>
          <div className="flex gap-x-2 self-stretch">
            <ThemedButton
              label={'Cancel'}
              className={'flex-grow'}
              buttonKind={ThemedButtonKind.SECONDARY_ACTION}
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

const WarningConcentricPulseCircle = () => {
  return (
    <>
      <div className="relative flex">
        <div className="w-[52px] h-[52px] border-solid bg-orange-100 rounded-full absolute opacity-50 animate-slow-ping"></div>
        <div className="p-3 border-solid bg-orange-100 rounded-full">
          <AlertTriangle size={28} stroke={colors.orange[500]} />
        </div>
      </div>
    </>
  );
};
