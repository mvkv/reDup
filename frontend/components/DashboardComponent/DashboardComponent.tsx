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

import { ActionButton, StateWrapper } from './StateWrapper';
import { FolderFetch, FolderSelect } from './FolderStates';
import { FilesFetch, FilesSelect } from './FileComparisonStates';
import {
  FADED_BACKGROUND_TW_CLASSES,
  Modal,
  ModalData,
  ModalTemplate,
} from './Modal';

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
    <div className="shadow-md bg-slate-300 min-w-full min-h-full rounded-md p-8 flex">
      <div
        className={`${
          hasModal ? FADED_BACKGROUND_TW_CLASSES : ''
        } min-w-full min-h-full flex`}
      >
        {renderCurrStep(state.currState)}
      </div>
      {hasModal && (
        <ModalTemplate
          setModal={setModal}
          onWarningDismiss={modal.onWarningDismiss}
          content={modal.content}
        />
      )}
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
      <StateWrapper
        state={state}
        nextBtn={<ActionButton label={'Next'} onClick={nextAction} />}
      >
        <div className="flex flex-col items-center gap-y-4">
          <div>Well hello there {email}!</div>
          <button onClick={nextAction}>Let's get started</button>
        </div>
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
      <StateWrapper
        state={state}
        nextBtn={
          <ActionButton
            label={'Reset'}
            onClick={() =>
              dispatch({
                goTo: StateType.INITIAL,
              })
            }
          />
        }
      >
        <p>Finish! Deleted {deletedN} media</p>
      </StateWrapper>
    </>
  );
};
