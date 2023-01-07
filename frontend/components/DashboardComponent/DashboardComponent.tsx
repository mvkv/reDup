import {
  Dispatch,
  SetStateAction,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useAuth } from '../../providers/auth-context';
import {
  DahsboardState,
  DEFAULT_DAHSBOARD_STATE,
  LAST_STEP_N,
  reducer,
  StateType,
  STATE_TO_STEP_N,
  Action,
  STATE_TO_LABEL,
} from '../../store/dashboard';
import InfiniteSpinner from '../common/InfiniteSpinner';
import { DiscreteProgressBar } from './DiscreteProgressbar';
import { Cluster } from '../../types/api';
import css from './DashboardComponent.module.css';
import {
  fakeFetchFiles,
  fakeFetchFolders,
  fakeFetchResults,
} from '../../apiCalls/Drive';
import Image from 'next/image';
type StateDispatchArgs = { state: DahsboardState; dispatch: Dispatch<Action> };
type Email = { email: string };

function StateWrapper({
  state,
  nextBtn,
  children,
}: {
  state: DahsboardState;
  nextBtn?: any;
  children: any;
}) {
  return (
    <>
      <div className="flex flex-col justify-center flex-grow gap-y-4">
        <div className="shadow-md bg-slate-200 p-8 rounded-md flex justify-between">
          <div>
            <DiscreteProgressBar
              currStep={STATE_TO_STEP_N[state.currState] + 1}
              maxStep={LAST_STEP_N + 1}
              stepLabel={STATE_TO_LABEL[state.currState]}
            ></DiscreteProgressBar>
          </div>
          {nextBtn && <div>{nextBtn}</div>}
        </div>
        <div
          className={`shadow-md bg-slate-200 p-8 rounded-md grow grid place-items-center overflow-y-auto ${css.scrollbar}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}

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
    <div className="shadow-md bg-slate-300 min-w-full min-h-full rounded-md p-8 flex">
      {renderCurrStep(state.currState)}
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
        nextBtn={<button onClick={nextAction}>Next</button>}
      >
        <div className="flex flex-col items-center gap-y-4">
          <div>Well hello there {email}!</div>
          <button onClick={nextAction}>Let's get started</button>
        </div>
      </StateWrapper>
    </>
  );
};

const FolderFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fakeFetchFolders(10);
      if (resp.ok) {
        dispatch({
          goTo: StateType.FOLDER_SELECT,
          fetchedFolders: resp.folders,
        });
      }
    }
    foo();
  }, []);
  return (
    <>
      <StateWrapper state={state}>
        <InfiniteSpinner label={'Fetching folders'} />
      </StateWrapper>
    </>
  );
};

const FolderSelect = ({ state, dispatch }: StateDispatchArgs) => {
  const [selected, setSelected] = useState('');

  return (
    <>
      <StateWrapper
        state={state}
        nextBtn={
          <button
            disabled={selected == ''}
            onClick={() =>
              dispatch({
                goTo: StateType.FILES_FETCH,
                foldersSelected: [selected],
              })
            }
          >
            Next
          </button>
        }
      >
        <div className="place-self-start flex flex-col gap-y-4 min-w-full">
          <p className="text-2xl pb-4 border-b-2 border-blue-400">
            {!selected ? 'Select a folder' : `${selected} selected`}
          </p>

          <ul className="flex flex-col overflow-y-auto">
            {state.foldersResults.map((folder, _) => {
              const isSelected = folder === selected;
              return (
                <li
                  className={`px-2 py-4 ${
                    isSelected
                      ? 'bg-blue-200'
                      : 'even:bg-gray-100 hover:bg-blue-100 '
                  }`}
                  key={folder}
                  onClick={() => setSelected(folder)}
                >
                  {folder}
                </li>
              );
            })}
          </ul>
        </div>
      </StateWrapper>
    </>
  );
};

const FilesFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fakeFetchFiles(30);
      if (resp.ok) {
        dispatch({
          goTo: StateType.FILES_SELECT,
          fetchedFilesCluster: resp.clusters,
        });
      }
    }
    foo();
  }, []);

  return (
    <>
      <StateWrapper state={state}>
        <InfiniteSpinner label={'Fetching files'} />
      </StateWrapper>
    </>
  );
};

const FileCluster = ({
  cluster,
  selected,
  setSelected,
}: {
  cluster: Cluster;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}) => {
  const clickOn = (imgId: string) => {
    if (selected.includes(imgId)) {
      setSelected([...selected.filter((id) => id != imgId)]);
    } else {
      setSelected([...selected, imgId]);
    }
  };

  return (
    <li className={`flex gap-4 py-8 flex-wrap items-baseline ${css.cluster}`}>
      {cluster.images.map((img, _) => {
        const isSelected = selected.includes(img.id);

        return (
          <ul className="basis-1/5 max-w-[300px] cursor-pointer" key={img.id}>
            <div
              className={`min-w-[8em] border-solid border-2 rounded-lg overflow-hidden select-none text-center ${
                isSelected
                  ? 'bg-yellow-100 border-yellow-800 shadow-lg shadow-yellow-400/30'
                  : 'hover:bg-blue-100 border-black'
              }`}
              key={img.id}
              onClick={() => clickOn(img.id)}
            >
              <Image
                src={img.image_url}
                alt=""
                width={300}
                height={300}
              ></Image>
              <div className="m-1">{img.id}</div>
            </div>
          </ul>
        );
      })}
    </li>
  );
};

const FilesSelect = ({ state, dispatch }: StateDispatchArgs) => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <>
      <StateWrapper
        state={state}
        nextBtn={
          <button
            disabled={selected.length == 0}
            onClick={() =>
              dispatch({
                goTo: StateType.RESULT_FETCH,
                filesSelected: [...selected],
              })
            }
          >
            Next
          </button>
        }
      >
        <div className="place-self-start flex flex-col gap-y-4 min-w-full">
          <div className="text-2xl pb-4 border-b-2 border-blue-400 flex justify-between">
            <p>Select files to delete</p>
            {selected.length > 0 && <p>{`${selected.length} selected`}</p>}
          </div>

          <ul className="flex flex-col overflow-y-auto">
            {state.filesClusterResults.map((cluster, _) => (
              <FileCluster
                key={cluster.id}
                cluster={cluster}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </ul>
        </div>
      </StateWrapper>
    </>
  );
};

const ResultFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fakeFetchResults();
      if (resp.ok) {
        dispatch({ goTo: StateType.FINAL, fetchedSummary: resp.deletedImages });
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
          <button
            onClick={() =>
              dispatch({
                goTo: StateType.INITIAL,
              })
            }
          >
            Reset
          </button>
        }
      >
        <p>Finish! Deleted {deletedN} media</p>
      </StateWrapper>
    </>
  );
};
