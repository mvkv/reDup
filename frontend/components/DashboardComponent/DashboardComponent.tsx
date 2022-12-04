import { Dispatch, useEffect, useReducer } from 'react';
import { useAuth } from '../../providers/auth-context';
import {
  DahsboardState,
  DEFAULT_DAHSBOARD_STATE,
  LAST_STEP_N,
  reducer,
  StateType,
  STATE_TO_STEP_N,
  Action,
} from '../../store/dashboard';

type StateDispatchArgs = { state: DahsboardState; dispatch: Dispatch<Action> };
type Email = { email: string };

export default function DashboardComponent() {
  const {
    authState: { email },
  } = useAuth();
  const [state, dispatch] = useReducer(reducer, DEFAULT_DAHSBOARD_STATE);

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
        return <FilesSelect state={state} dispatch={dispatch} />;
      case StateType.RESULT_FETCH:
        return <ResultFetch state={state} dispatch={dispatch} />;
      case StateType.FINAL:
        return <Final state={state} dispatch={dispatch} />;
      default:
        return '';
    }
  };
  return (
    <div>
      <div>
        Step {STATE_TO_STEP_N[state.currState] + 1} of {LAST_STEP_N + 1}
      </div>
      {renderCurrStep(state.currState)}
    </div>
  );
}

// TODO: Replace these helpers.
const LoadingSpinner = () => <div>LOADING</div>;

const fakeFetch = (): Promise<{ data: string[] }> => {
  return new Promise((resolve, _) => {
    setTimeout(
      () =>
        resolve({
          data: ['resp'],
        }),
      1500 + Math.random() * 1000,
    );
  });
};

const InitialState = ({
  email,
  state,
  dispatch,
}: Email & StateDispatchArgs) => {
  return (
    <>
      <div className="my-4">Well hello there {email}!</div>
      <p>Let's get started</p>
      <button onClick={() => dispatch({ goTo: StateType.FOLDER_FETCH })}>
        Next
      </button>
    </>
  );
};

const FolderFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fakeFetch();
      dispatch({ goTo: StateType.FOLDER_SELECT, fetchedFolders: resp.data });
    }
    foo();
  }, []);
  return (
    <>
      <LoadingSpinner />
    </>
  );
};

const FolderSelect = ({ state, dispatch }: StateDispatchArgs) => {
  return (
    <>
      {' '}
      <p>Select Folders {state.foldersResults}</p>
      <button
        onClick={() =>
          dispatch({
            goTo: StateType.FILES_FETCH,
            foldersSelected: ['example'],
          })
        }
      >
        Next
      </button>
    </>
  );
};

const FilesFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fakeFetch();
      dispatch({ goTo: StateType.FILES_SELECT, fetchedFiles: resp.data });
    }
    foo();
  }, []);

  return (
    <>
      <LoadingSpinner />
    </>
  );
};

const FilesSelect = ({ state, dispatch }: StateDispatchArgs) => {
  return (
    <>
      {' '}
      <p>Select Files {state.filesResults}</p>
      <button
        onClick={() =>
          dispatch({ goTo: StateType.RESULT_FETCH, filesSelected: ['example'] })
        }
      >
        Next
      </button>
    </>
  );
};

const ResultFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fakeFetch();
      dispatch({ goTo: StateType.FINAL, fetchedSummary: resp.data });
    }
    foo();
  }, []);

  return (
    <>
      <LoadingSpinner />
    </>
  );
};

const Final = ({ state, dispatch }: StateDispatchArgs) => {
  return (
    <>
      {' '}
      <p>Finish {state.finalSummary}</p>
    </>
  );
};
