import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DashboardState, StateType, Action } from '../../store/dashboard';
import InfiniteSpinner from '../common/InfiniteSpinner';
import { Cluster } from '../../types/api';
import { fetchImagesCluster } from '../../apiCalls/Drive';
import Image from 'next/image';
type StateDispatchArgs = { state: DashboardState; dispatch: Dispatch<Action> };

import { StateWrapper } from './StateWrapper';
import { Modal, SetModal } from './Modal';
import { AlertTriangle, XCircle } from 'react-feather';
import ThemedButton from '../common/ThemedButton';

export const FilesFetch = ({ state, dispatch }: StateDispatchArgs) => {
  useEffect(() => {
    async function foo() {
      const resp = await fetchImagesCluster(state.foldersSelected);
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
        nextBtn={<ThemedButton label={'Next'} isLoading={true} />}
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
    <ul
      className={`flex gap-4 py-8 flex-wrap items-baseline border-b-2 border-spark-purple-500 last:border-none`}
    >
      {cluster.images.map((img, _) => {
        const isSelected = selected.includes(img.id);

        return (
          <li className="basis-1/5 max-w-[300px] cursor-pointer" key={img.id}>
            <div
              className={`min-w-[8em] border-solid border-2 rounded-lg overflow-hidden select-none text-center ${
                isSelected
                  ? 'bg-spark-purple-200 border-spark-purple-700 shadow-lg shadow-spark-purple-500/30'
                  : 'hover:bg-spark-purple-200 border-gray-800'
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
                className={`m-1.5 text-base font-medium relative ${
                  isSelected ? 'text-spark-purple-700' : 'text-gray-800'
                }`}
              >
                {isSelected && <XCircle className="absolute" />}
                {img.name}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
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
      // Should not happen, as the button would be disabled in this circumstance.
    } else {
      setModal(confirmDeletionModal);
    }
  };
  const clustersFetched = state.filesClusterResults.length;
  const filesFetched = state.filesClusterResults
    .map((cluster) => cluster.images.length ?? 0)
    .reduce((acc, v) => acc + v, 0);
  const validSelection = selected.length > 0;

  return (
    <>
      <StateWrapper
        state={state}
        nextBtn={
          <ThemedButton
            label={'Next'}
            onClick={onNextClick}
            isDisabled={!validSelection}
          />
        }
      >
        <div className="place-self-start flex flex-col gap-y-4 min-w-full">
          <div className="text-2xl flex justify-between">
            <div className="flex items-center gap-x-2 font-inter text-base">
              Fetched:
              <p className=" bg-spark-purple-300  rounded-lg px-4 py-1 shadow-md">
                {filesFetched} files
              </p>
              <p className=" bg-spark-purple-300  rounded-lg px-4 py-1 shadow-md">
                {clustersFetched} clusters
              </p>
            </div>
            {selected.length > 0 && (
              <div className="flex items-center gap-x-2">
                <p className="text-base font-inter">Selected:</p>
                <div className="font-mono text-base bg-emerald-50 rounded-lg px-4 py-1 shadow-md">
                  {selected.length} files
                </div>
              </div>
            )}
            {selected.length === 0 && (
              <div className="flex justify-center items-center gap-x-2 font-inter text-base bg-rose-50 rounded-lg px-4 py-1 shadow-md">
                <AlertTriangle size={16} />
                Select files to delete
              </div>
            )}
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
