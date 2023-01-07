import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DashboardState, StateType, Action } from '../../store/dashboard';
import InfiniteSpinner from '../common/InfiniteSpinner';
import { Cluster } from '../../types/api';
import css from './DashboardComponent.module.css';
import { fakeFetchFiles } from '../../apiCalls/Drive';
import Image from 'next/image';
type StateDispatchArgs = { state: DashboardState; dispatch: Dispatch<Action> };

import { StateWrapper } from './StateWrapper';
import { Modal, SetModal } from './Modal';

export const FilesFetch = ({ state, dispatch }: StateDispatchArgs) => {
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

export const FileCluster = ({
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
  return (
    <>
      <StateWrapper
        state={state}
        nextBtn={
          <button
            disabled={selected.length == 0}
            onClick={() =>
              setModal({
                type: Modal.WARNING,
                onWarningDismiss: () => dispatch(nextAction),
                content: <>HIII</>,
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
