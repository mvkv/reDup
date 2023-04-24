import { Dispatch, useEffect, useState } from 'react';
import { AlertTriangle, ChevronsUp, Folder } from 'react-feather';
import { fetchDriveFolders } from '../../apiCalls/Drive';
import { Action, DashboardState, StateType } from '../../store/dashboard';
import { Folders } from '../../types/api';
import ThemedCheckbox from '../common/ThemedCheckbox';
import InfiniteSpinner from '../common/InfiniteSpinner';
import PillBadge from '../common/PillBadge';
import ThemedButton, { ThemedButtonKind } from '../common/ThemedButton';
import { InteractiveStatesWrapper } from './Shared';
import { StateWrapper } from './StateWrapper';
import FoldersDropdown from '../common/FoldersDropdown';
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
  const [foldersSelected, setFoldersSelected] = useState<Folders[]>(
    state.foldersSelected, // Init foldersSelected with all selected folders to handle G Drive's graph structure.
  );

  const updateFoldersDispatch = (action: Action) => {
    dispatch({
      ...action,
      foldersSelected: foldersSelected,
    });
  };

  const navigateToRoot = () => {
    if (state.folderPath.length == 0) {
      return;
    }
    updateFoldersDispatch({
      goTo: StateType.FOLDER_FETCH,
      currentFolderPath: [],
    });
  };

  const navigateUp = () => {
    if (state.folderPath.length == 0) {
      return;
    }
    updateFoldersDispatch({
      goTo: StateType.FOLDER_FETCH,
      currentFolderPath: [...state.folderPath.slice(0, -1)],
    });
  };

  const getPathDisplayName = (folders: Folders[]) => {
    const foldersName = folders.map((folder) => folder.name);
    if (folders.length < 3) return `~/${foldersName.join('/')}`;
    // Elipsize the start on very deeply nested paths.
    return `~/.../${foldersName.slice(-2).join('/')}`;
  };

  const handleFolderClick = (folder: Folders) => {
    updateFoldersDispatch({
      goTo: StateType.FOLDER_FETCH,
      currentFolderPath: [...state.folderPath, folder],
    });
  };

  const handleSelectFolder = (folder: Folders, isSelected: boolean) => {
    const selected = isSelected
      ? [...foldersSelected, folder]
      : foldersSelected.filter(
          (folderSelected: Folders) => folderSelected.id !== folder.id,
        );

    setFoldersSelected(selected);
  };

  const onNextClick = () => {
    if (!state.foldersSelected.length) {
      // Should not happen, as the button would be disabled in this circumstance.
    } else {
      updateFoldersDispatch({
        goTo: StateType.FILES_FETCH,
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
              !state.foldersSelected.length
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
              {foldersSelected.length > 0 && (
                <FoldersDropdown folders={foldersSelected} />
              )}
              {!foldersSelected.length && (
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
            {!state.foldersResults.length && (
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
                  const isSelected = foldersSelected
                    .map((folder: Folders) => folder.id)
                    .includes(id);
                  return (
                    <button
                      className={`p-2 flex flex-col items-center justify-center truncate`}
                      key={id}
                    >
                      <Folder
                        onClick={() => handleFolderClick({ id, name })}
                        strokeWidth={1}
                        className="h-12 w-12 xl:h-16 xl:w-16  fill-orange-100 hover:fill-spark-purple-200 cursor-pointer"
                        size={64}
                      />
                      <span className="-mt-5 -ml-12 ">
                        <ThemedCheckbox
                          checked={isSelected}
                          onChange={(isChecked: boolean) =>
                            handleSelectFolder({ id, name }, isChecked)
                          }
                        />
                      </span>
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
