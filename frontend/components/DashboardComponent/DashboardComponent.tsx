import { Dispatch, useEffect, useReducer, useState } from 'react';
import { useAuth } from '../../providers/auth-context';
import {
  DashboardState,
  DEFAULT_DAHSBOARD_STATE,
  reducer,
  StateType,
  Action,
} from '../../store/dashboard';
import InfiniteSpinner from '../common/InfiniteSpinner';
import { deleteImagesAndFetchSummary } from '../../apiCalls/Drive';
type StateDispatchArgs = { state: DashboardState; dispatch: Dispatch<Action> };
type Email = { email: string };

import { StateWrapper } from './StateWrapper';
import { FolderFetch, FolderSelect } from './FolderStates';
import { FilesFetch, FilesSelect } from './FileComparisonStates';
import { Modal, ModalData, WarningDialogTemplate } from './Modal';
import CircleBadge from '../common/CircleBadge';
import ThemedButton from '../common/ThemedButton';
import { Smile } from 'react-feather';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';

export default function DashboardComponent() {
  const {
    authState: { email },
  } = useAuth();
  const [state, dispatch] = useReducer(reducer, DEFAULT_DAHSBOARD_STATE);
  const [modal, setModal] = useState<ModalData>({ type: Modal.NO_MODAL });

  const hasModal = modal.type !== Modal.NO_MODAL;

  const renderCurrStep = (currState: StateType) => {
    switch (currState) {
      case StateType.INITIAL:
        return <InitialState email={email} state={state} dispatch={dispatch} />;
      case StateType.FOLDER_FETCH:
        return <FolderFetch state={state} dispatch={dispatch} />;
      case StateType.FOLDER_SELECT:
        return (
          <FolderSelect state={state} dispatch={dispatch} setModal={setModal} />
        );
      case StateType.FILES_FETCH:
        return <FilesFetch state={state} dispatch={dispatch} />;
      case StateType.FILES_SELECT:
        return (
          <FilesSelect state={state} dispatch={dispatch} setModal={setModal} />
        );
      case StateType.RESULT_FETCH:
        return <ResultFetch state={state} dispatch={dispatch} />;
      case StateType.FINAL:
        return <Final state={state} dispatch={dispatch} />;
      default:
        return '';
    }
  };

  return (
    <div className=" min-w-full min-h-full rounded-md flex">
      <div className="min-w-full min-h-full flex">
        {renderCurrStep(state.currState)}
      </div>
      <Dialog
        open={hasModal}
        onClose={() => {
          setModal({ type: Modal.NO_MODAL });
        }}
        className="relative z-50"
      >
        <Dialog.Panel>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <WarningDialogTemplate
            setModal={setModal}
            onWarningDismiss={modal.onWarningDismiss}
            content={modal.content}
          />
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

const InitialState = ({
  email,
  state,
  dispatch,
}: Email & StateDispatchArgs) => {
  const nextAction = () => dispatch({ goTo: StateType.FOLDER_FETCH });
  return (
    <>
      <StateWrapper state={state}>
        <p className="flex flex-col items-center gap-y-12 font-inter">
          <p className="text-2xl">
            Hello{' '}
            <span className="text-spark-purple-500 font-bold">{email}!</span>
          </p>
          <p className="text-xl">
            Let us help you find and keep only the pictures you care about!
          </p>
          <div className="flex flex-col gap-y-6 items-start">
            <p className="flex gap-x-6 justify-center items-baseline">
              <CircleBadge label={1} /> Select the folder in your drive where we
              should look for similar photos.
            </p>
            <p className="flex gap-x-6 justify-center items-baseline">
              <CircleBadge label={2} /> Check the pictures we found to be
              similar and select the ones you wish to delete.
            </p>
            <p className="flex gap-x-6 justify-center items-baseline">
              <CircleBadge label={3} /> Confirm the selection. The selected
              pictures will be deleted.
            </p>
          </div>
          <div>
            <p className="text-xl pb-4 text-center">Easy right?</p>
            <ThemedButton
              onClick={() => nextAction()}
              label={"Let's get started"}
            />
          </div>
        </p>
      </StateWrapper>
    </>
  );
};

const ResultFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await deleteImagesAndFetchSummary(state.filesSelected);
      if (resp.ok) {
        dispatch({
          goTo: StateType.FINAL,
          fetchedSummary: resp.deleted_images,
        });
      }
    }
    foo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StateWrapper state={state}>
        <InfiniteSpinner label={'Processing'} />
      </StateWrapper>
    </>
  );
};

const Final = ({ state, dispatch }: StateDispatchArgs) => {
  const deletedN = state.finalSummary.filter((e) => e.deleted).length;
  return (
    <>
      <StateWrapper state={state}>
        <p className="flex flex-col items-center gap-y-12 font-inter">
          <p className="text-2xl flex items-center gap-x-">
            Operation completed! We deleted:{' '}
            <span className="text-spark-purple-500 font-bold px-2">
              {deletedN} files!
            </span>
            <Smile className="pl-1" size={28} />
          </p>
          <p className="text-xl">
            {/* TODO: Add proper link. */}
            Hope this website was helpful! You can check out the code on Github
          </p>
          <div className="flex flex-col gap-y-6 items-center">
            <p className="flex gap-x-6 justify-center ">
              Did you accidentaly deleted a picuture you wanted to keep?
            </p>
            <p>
              Fear not: you can still find them in the{' '}
              <Link
                className="text-spark-purple-600 font-bold underline"
                target="_blank"
                href={'https://drive.google.com/drive/trash'}
              >
                Google Drive trash
              </Link>{' '}
              and recover them from there.
            </p>
            <p>
              {' '}
              If you want to free up the space right away don't forget to clear
              the trash!
            </p>
          </div>
          <ThemedButton
            onClick={() =>
              dispatch({
                goTo: StateType.INITIAL,
              })
            }
            label={'Delete more picture?'}
          />
        </p>
      </StateWrapper>
    </>
  );
};
