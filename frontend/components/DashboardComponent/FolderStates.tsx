import { Dispatch, useEffect, useState } from 'react';
import { AlertTriangle, ChevronsUp, Folder } from 'react-feather';
import { fetchDriveFolders } from '../../apiCalls/Drive';
import { Action, DashboardState, StateType } from '../../store/dashboard';
import { Folders } from '../../types/api';
import InfiniteSpinner from '../common/InfiniteSpinner';
import PillBadge from '../common/PillBadge';
import ThemedButton, { ThemedButtonKind } from '../common/ThemedButton';
import { InteractiveStatesWrapper } from './Shared';
import { StateWrapper } from './StateWrapper';
type StateDispatchArgs = { state: DashboardState; dispatch: Dispatch<Action> };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <StateWrapper
        state={state}
        nextBtn={
          <ThemedButton
            label={'Next'}
            buttonKind={ThemedButtonKind.PRIMARY_LOADING}
          />
        }
      >
        <InfiniteSpinner label={'Fetching folders'} />
      </StateWrapper>
    </>
  );
};

export const FolderSelect = ({ state, dispatch }: StateDispatchArgs) => {
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

  const handleFolderClick = (folder: Folders) => {
    if (folder.id == selected?.id) {
      dispatch({
        goTo: StateType.FOLDER_FETCH,
        folderPathSelected: [...state.folderPath, folder],
      });
    } else {
      setSelected(folder);
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
            buttonKind={
              !selected
                ? ThemedButtonKind.PRIMARY_DISABLED
                : ThemedButtonKind.PRIMARY_ACTION
            }
          />
        }
      >
        <InteractiveStatesWrapper
          firstHeaderGroup={
            <>
              <p className="text-base font-inter">Current path:</p>
              <PillBadge extraClasses={'bg-spark-purple-300'} isFontMono={true}>
                {getPathDisplayName(state.folderPath)}
              </PillBadge>
              {state.folderPath.length > 0 && (
                <button
                  className=" bg-spark-purple-400 rounded-full px-1 py-1 shadow-md group"
                  onClick={() => navigateUp()}
                >
                  <ChevronsUp
                    size={24}
                    className="group-hover:stroke-gray-200 transition-colors duration-500 ease-in-out group-hover:animate-hop"
                  />
                </button>
              )}
            </>
          }
          secondHeaderGroup={
            <>
              {selected && (
                <>
                  <p className="text-base font-inter">Selected:</p>
                  <PillBadge extraClasses={'bg-emerald-50'} isFontMono={true}>
                    {selected.name}
                  </PillBadge>
                </>
              )}
              {!selected && (
                <>
                  <PillBadge extraClasses={'bg-rose-50'}>
                    <AlertTriangle size={16} />
                    Select a folder
                  </PillBadge>
                </>
              )}
            </>
          }
        >
          <>
            {state.foldersResults.length == 0 && (
              <div className="min-h-[200px] grid place-content-center text-2xl">
                No folders at this level
                {state.folderPath.length > 0 && (
                  <ThemedButton
                    label={'Go to root!'}
                    onClick={() => {
                      navigateToRoot();
                    }}
                  ></ThemedButton>
                )}
              </div>
            )}
            {state.foldersResults.length > 0 && (
              <ul className="grid grid-cols-fill-sm xl:grid-cols-fill-xl overflow-y-auto gap-x-4 xl:gap-x-8 gap-y-2 xl:gap-y-12">
                {state.foldersResults.map(({ id, name }, _) => {
                  const isSelected = id === selected?.id;
                  return (
                    <button
                      className={`p-2 xl:p-4 hover:bg-spark-purple-200 flex flex-col items-center justify-center`}
                      key={id}
                      onClick={() => handleFolderClick({ id, name })}
                    >
                      <Folder
                        strokeWidth={1}
                        className={`h-12 w-12 xl:h-16 xl:w-16 ${
                          isSelected
                            ? 'fill-spark-purple-400'
                            : 'fill-orange-100'
                        }`}
                        size={64}
                      />
                      <li>{name}</li>
                    </button>
                  );
                })}
              </ul>
            )}
          </>
        </InteractiveStatesWrapper>
      </StateWrapper>
    </>
  );
};
