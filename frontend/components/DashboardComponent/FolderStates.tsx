import { Dispatch, useEffect, useState } from 'react';
import { DashboardState, StateType, Action } from '../../store/dashboard';
import InfiniteSpinner from '../common/InfiniteSpinner';
import { fetchDriveFolders } from '../../apiCalls/Drive';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';
type StateDispatchArgs = { state: DashboardState; dispatch: Dispatch<Action> };
import { AlertTriangle, ChevronsUp, Folder } from 'react-feather';
import { StateWrapper } from './StateWrapper';
import { Modal, SetModal } from './Modal';
import { Folders } from '../../types/api';
import ThemedButton from '../common/ThemedButton';

const fullConfig = resolveConfig(tailwindConfig) as any;

export const FolderFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function fetchFolders() {
      const folderToFetch = state.folderPath.at(-1)?.id || 'root';
      const resp = await fetchDriveFolders(folderToFetch);
      if (resp.ok) {
        dispatch({
          goTo: StateType.FOLDER_SELECT,
          fetchedFolders: resp.folders,
        });
      }
    }
    fetchFolders();
  }, []);
  return (
    <>
      <StateWrapper
        state={state}
        nextBtn={<ThemedButton label={'Next'} isLoading={true} />}
      >
        <InfiniteSpinner label={'Fetching folders'} />
      </StateWrapper>
    </>
  );
};

export const FolderSelect = ({
  state,
  dispatch,
  setModal,
}: StateDispatchArgs & SetModal) => {
  const [selected, setSelected] = useState<Folders | undefined>(undefined);

  const navigateToRoot = () => {
    if (state.folderPath.length == 0) {
      return;
    }
    dispatch({
      goTo: StateType.FOLDER_FETCH,
      folderPathSelected: [],
    });
  };

  const navigateUp = () => {
    if (state.folderPath.length == 0) {
      return;
    }
    dispatch({
      goTo: StateType.FOLDER_FETCH,
      folderPathSelected: [...state.folderPath.slice(0, -1)],
    });
  };

  const getPathDisplayName = (folders: Folders[]) => {
    const foldersName = folders.map((folder) => folder.name);
    if (folders.length < 3) return `~/${foldersName.join('/')}`;
    // Elipsize the start on very deeply nested paths.
    return `~/.../${foldersName.slice(-2).join('/')}`;
  };

  const handleFolderClick = (
    evt: React.MouseEvent<HTMLElement>,
    folder: Folders,
  ) => {
    switch (evt.detail) {
      case 1:
        setSelected(folder);
        break;
      case 2:
        dispatch({
          goTo: StateType.FOLDER_FETCH,
          folderPathSelected: [...state.folderPath, folder],
        });
        break;
    }
  };

  const onNextClick = () => {
    if (!selected) {
      // Should not happen, as the button would be disabled in this circumstance.
    } else {
      dispatch({
        goTo: StateType.FILES_FETCH,
        foldersSelected: [selected.id],
      });
    }
  };

  return (
    <>
      <StateWrapper
        state={state}
        nextBtn={
          <ThemedButton
            label={'Next'}
            onClick={onNextClick}
            isDisabled={!selected}
          />
        }
      >
        <div className="place-self-start flex flex-col gap-y-4 min-w-full">
          <div className="text-2xl flex justify-between">
            <div className="flex items-center gap-x-2">
              <p className="text-base font-inter">Current path:</p>
              <p className="font-mono text-base bg-spark-purple-300 rounded-lg px-4 py-1 shadow-md">
                {getPathDisplayName(state.folderPath)}
              </p>
              {state.folderPath.length > 0 && (
                <button
                  className=" bg-spark-purple-400 rounded-full px-1 py-1 shadow-md"
                  onClick={() => navigateUp()}
                >
                  <ChevronsUp size={24} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              {selected && (
                <>
                  <p className="text-base font-inter">Selected:</p>
                  <div className="font-mono text-base bg-emerald-50 rounded-lg px-4 py-1 shadow-md">
                    {selected.name}
                  </div>
                </>
              )}
              {!selected && (
                <div className="flex justify-center items-center gap-x-2 font-inter text-base bg-rose-50 rounded-lg px-4 py-1 shadow-md">
                  <AlertTriangle size={16} />
                  Select a folder
                </div>
              )}
            </div>
          </div>
          {state.foldersResults.length == 0 && (
            <div className="min-h-[200px] grid place-content-center text-2xl">
              No folders at this level
              {state.folderPath.length > 0 && (
                <button
                  className="underline text-main"
                  onClick={() => {
                    navigateToRoot();
                  }}
                >
                  Go to root!
                </button>
              )}
            </div>
          )}
          {state.foldersResults.length > 0 && (
            <ul className="flex flex-wrap overflow-y-auto gap-x-8 gap-y-12">
              {state.foldersResults.map(({ id, name }, _) => {
                const isSelected = id === selected?.id;
                return (
                  <button
                    className={`p-4 hover:bg-spark-purple-200 flex flex-col items-center justify-center`}
                    key={id}
                    onClick={(evt) => handleFolderClick(evt, { id, name })}
                  >
                    <Folder
                      strokeWidth={1}
                      size={64}
                      fill={
                        isSelected
                          ? `${fullConfig.theme.colors['spark-purple'][400]}`
                          : `${fullConfig.theme.colors.orange[100]}`
                      }
                    />
                    <li>{name}</li>
                  </button>
                );
              })}
            </ul>
          )}
        </div>
      </StateWrapper>
    </>
  );
};
