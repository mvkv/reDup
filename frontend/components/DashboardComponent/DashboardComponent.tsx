import { Dispatch, useEffect, useReducer, useState } from 'react';
import { useAuth } from '../../providers/auth-context';
import {
  DashboardState,
  DEFAULT_DAHSBOARD_STATE,
  reducer,
  StateType,
  Action,
  ClusterMode,
} from '../../store/dashboard';
import InfiniteSpinner from '../common/InfiniteSpinner';
import { deleteImagesAndFetchSummary } from '../../apiCalls/Drive';
type StateDispatchArgs = { state: DashboardState; dispatch: Dispatch<Action> };
type Email = { email: string };

import { RadioGroup } from '@headlessui/react';

import { StateWrapper } from './StateWrapper';
import { FolderFetch, FolderSelect } from './FolderStates';
import { FilesFetch, FilesSelect } from './FileComparisonStates';
import { Modal, ModalData, WarningDialogTemplate } from './Modal';
import CircleBadge from '../common/CircleBadge';
import ThemedButton from '../common/ThemedButton';
import { Check, ExternalLink, Smile } from 'react-feather';
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
        return <FolderSelect state={state} dispatch={dispatch} />;
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
  const [mode, setMode] = useState(ClusterMode.ML);
  const modeTwClass =
    'text-sm lg:text-base flex items-center cursor-pointer pl-8 pr-14 py-3 shadow-md rounded-lg bg-spark-purple-200';

  const nextAction = () =>
    dispatch({ goTo: StateType.FOLDER_FETCH, setClusterMode: mode });

  return (
    <>
      <StateWrapper state={state}>
        <p className="flex flex-col items-center gap-y-6 xl:gap-y-12 font-inter">
          <p className="text-xl xl:text-2xl">
            Hello{' '}
            <span className="text-spark-purple-500 font-bold">{email}!</span>
          </p>
          <p className="text-l xl:text-xl">
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
          <div className="flex flex-col items-center gap-y-2">
            <p className="text-lg">Select Mode</p>
            <RadioGroup
              className={'flex flex-row gap-x-2'}
              value={mode}
              onChange={setMode}
            >
              <RadioGroup.Option value={ClusterMode.ML}>
                {({ checked }) => (
                  <div
                    className={`${modeTwClass} ${
                      checked ? 'bg-spark-purple-400' : ''
                    }`}
                  >
                    <div className="flex flex-col mr-6">
                      <span className="font-bold">ML clustering ✨</span>
                      <span>Good for close duplicates</span>
                    </div>
                    {checked && <Check className="mr-[-24px]" size={24} />}
                  </div>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option value={ClusterMode.HASH}>
                {({ checked }) => (
                  <div
                    className={`${modeTwClass} ${
                      checked ? 'bg-spark-purple-400' : ''
                    }`}
                  >
                    <div className="flex flex-col mr-6">
                      <span className="font-bold">Hash clustering 🔬</span>
                      <span>Good for identical duplicates</span>
                    </div>
                    {checked && <Check className="mr-[-24px]" size={24} />}
                  </div>
                )}
              </RadioGroup.Option>
            </RadioGroup>
          </div>
          <div>
            <p className="text-lg xl:text-xl pb-4 text-center">Easy right?</p>
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
        <div className="flex flex-col items-center gap-y-6 xl:gap-y-12 font-inter">
          <p className="text-lg xl:text-2xl lg:flex lg:items-center gap-x-2">
            <span>Operation completed! </span>
            <span>We deleted: </span>
            <span className="text-spark-purple-500 font-bold whitespace-nowrap">
              {deletedN} file{deletedN > 1 ? 's' : ''}!
            </span>
            <Smile className="hidden xl:visible" size={28} />
          </p>
          <p className="text-base xl:text-xl">
            Hope this website was helpful! You can check out the code on{' '}
            {/* TODO: Add proper link. */}
            <Link
              className="inline-flex items-baseline text-spark-purple-600 font-bold"
              target="_blank"
              href="TODO"
            >
              Github
              <ExternalLink size={12} />
            </Link>
          </p>
          <div className="flex flex-col gap-y-6 items-center text-sm xl:text-base">
            <p className="flex gap-x-6 justify-center ">
              Did you accidentaly deleted a picuture you wanted to keep?
            </p>
            <p>
              Fear not: you can still find them in the{' '}
              <Link
                className="inline-flex items-baseline text-spark-purple-600 font-bold"
                target="_blank"
                href={'https://drive.google.com/drive/trash'}
              >
                Google Drive trash
                <ExternalLink size={12} />
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
        </div>
      </StateWrapper>
    </>
  );
};
