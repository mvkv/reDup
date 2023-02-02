import { Dispatch, useEffect, useState } from 'react';
import { DashboardState, StateType, Action } from '../../store/dashboard';
import InfiniteSpinner from '../common/InfiniteSpinner';
import { fetchDriveFolders } from '../../apiCalls/Drive';
import colors from 'tailwindcss/colors';
type StateDispatchArgs = { state: DashboardState; dispatch: Dispatch<Action> };
import { ArrowUp, Folder } from 'react-feather';
import { ActionButton, StateWrapper } from './StateWrapper';
import { Modal, SetModal } from './Modal';

export const FolderFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fetchDriveFolders(state.folderPath);
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
      <StateWrapper
        state={state}
        nextBtn={<ActionButton label={'Next'} isLoading={true} />}
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
  const [selected, setSelected] = useState('');

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

  const getPathDisplayName = (folders: string[]) => {
    if (folders.length < 3) return `~/${folders.join('/')}`;
    // Elipsize the start on very deeply nested paths.
    return `~/.../${folders.slice(-2).join('/')}`;
  };

  const handleFolderClick = (
    evt: React.MouseEvent<HTMLElement>,
    folder_id: string,
  ) => {
    switch (evt.detail) {
      case 1:
        setSelected(folder_id);
        break;
      case 2:
        dispatch({
          goTo: StateType.FOLDER_FETCH,
          folderPathSelected: [...state.folderPath, folder_id],
        });
        break;
    }
  };

  const onNextClick = () => {
    if (selected == '') {
      setModal({ type: Modal.ERROR, content: <>No folder selected!</> });
    } else {
      dispatch({
        goTo: StateType.FILES_FETCH,
        foldersSelected: [selected],
      });
    }
  };

  return (
    <>
      <StateWrapper
        state={state}
        nextBtn={<ActionButton label={'Next'} onClick={onNextClick} />}
      >
        <div className="place-self-start flex flex-col gap-y-4 min-w-full">
          <div className="text-2xl pb-4 border-b-2 border-blue-400 flex justify-between">
            {!selected ? 'Select a folder' : `${selected} selected`}
            <div className="flex items-center gap-x-4">
              {state.folderPath.length > 0 && (
                <button onClick={() => navigateUp()}>
                  <ArrowUp size={24} />
                </button>
              )}
              <p className="font-mono">
                {getPathDisplayName(state.folderPath)}
              </p>
            </div>
          </div>
          {state.foldersResults.length == 0 && (
            <div className="min-h-[200px] grid place-content-center text-2xl">
              No folders at this level
              {state.folderPath.length > 0 && (
                <button
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
              {state.foldersResults.map(({ id }, _) => {
                const isSelected = id === selected;
                return (
                  <button
                    className={`p-4 hover:bg-blue-200`}
                    key={id}
                    onClick={(evt) => handleFolderClick(evt, id)}
                  >
                    <Folder
                      strokeWidth={1}
                      size={64}
                      fill={isSelected ? `${colors.sky[400]}` : ''}
                    />
                    <li>{id}</li>
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
