import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DashboardState, StateType, Action } from '../../store/dashboard';
import InfiniteSpinner from '../common/InfiniteSpinner';
import { Cluster } from '../../types/api';
import { fakeFetchFiles } from '../../apiCalls/Drive';
import Image from 'next/image';
type StateDispatchArgs = { state: DashboardState; dispatch: Dispatch<Action> };

import { ActionButton, StateWrapper } from './StateWrapper';
import { Modal, SetModal } from './Modal';

export const FilesFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fakeFetchFiles(15);
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
      <StateWrapper
        state={state}
        nextBtn={<ActionButton label={'Next'} isLoading={true} />}
      >
        <InfiniteSpinner label={'Fetching files'} />
      </StateWrapper>
    </>
  );
};

const FileComparison = ({
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
    <li
      className={`flex gap-4 py-8 flex-wrap items-baseline border-b-2 border-blue-400 last:border-none`}
    >
      {cluster.images.map((img, _) => {
        const isSelected = selected.includes(img.id);

        return (
          <ul className="basis-1/5 max-w-[300px] cursor-pointer" key={img.id}>
            <div
              className={`min-w-[8em] border-solid border-2 rounded-lg overflow-hidden select-none text-center ${
                isSelected
                  ? 'bg-yellow-100 border-yellow-800 shadow-lg shadow-yellow-400/30'
                  : 'hover:bg-blue-100 border-gray-800'
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
              <div
                className={`m-1.5 text-base font-medium ${
                  isSelected ? 'text-yellow-700' : 'text-gray-800'
                }`}
              >
                {img.id}
              </div>
            </div>
          </ul>
        );
      })}
    </li>
  );
};

export const FilesSelect = ({
  state,
  dispatch,
  setModal,
}: StateDispatchArgs & SetModal) => {
  const [selected, setSelected] = useState<string[]>([]);

  const nextAction = {
    goTo: StateType.RESULT_FETCH,
    filesSelected: [...selected],
  };

  const confirmDeletionModal = {
    type: Modal.WARNING,
    onWarningDismiss: () => dispatch(nextAction),
    content: (
      <>You are about to delete {selected.length} files. Are you sure?</>
    ),
  };

  const onNextClick = () => {
    if (selected.length == 0) {
      setModal({
        type: Modal.ERROR,
        content: <>No files marked to be deleted!</>,
      });
    } else {
      setModal(confirmDeletionModal);
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
            <p>Select files to delete</p>
            {selected.length > 0 && <p>{`${selected.length} selected`}</p>}
          </div>

          <ul className="flex flex-col overflow-y-auto">
            {state.filesClusterResults.map((cluster, _) => (
              <FileComparison
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
