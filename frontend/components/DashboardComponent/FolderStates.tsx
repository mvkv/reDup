import { Dispatch, useEffect, useState } from 'react';
import { DashboardState, StateType, Action } from '../../store/dashboard';
import InfiniteSpinner from '../common/InfiniteSpinner';
import { fakeFetchFolders } from '../../apiCalls/Drive';

type StateDispatchArgs = { state: DashboardState; dispatch: Dispatch<Action> };

import { ArrowUp } from 'react-feather';
import { StateWrapper } from './StateWrapper';

export const FolderFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fakeFetchFolders(state.folderPath, 10);
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

export const FolderSelect = ({ state, dispatch }: StateDispatchArgs) => {
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

  const handleFolderClick = (
    evt: React.MouseEvent<HTMLElement>,
    folder: string,
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
          <div className="text-2xl pb-4 border-b-2 border-blue-400 flex justify-between">
            {!selected ? 'Select a folder' : `${selected} selected`}
            {state.folderPath.length == 0 && <p>{`~/root`}</p>}
            {state.folderPath.length > 0 && (
              <div className="flex items-center gap-x-4">
                <button onClick={() => navigateUp()}>
                  <ArrowUp size={24} />
                </button>
                <p>{`~/${state.folderPath.join('/')}`}</p>
              </div>
            )}
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
                    onClick={(evt) => handleFolderClick(evt, folder)}
                  >
                    {folder}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </StateWrapper>
    </>
  );
};
