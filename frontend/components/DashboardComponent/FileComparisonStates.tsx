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
import ThemedButton, { ThemedButtonKind } from '../common/ThemedButton';
import PillBadge from '../common/PillBadge';
import { InteractiveStatesWrapper } from './Shared';

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
      className={`flex gap-4 py-4 xl:py-8 flex-wrap items-baseline border-b-2 border-spark-purple-500 last:border-none`}
    >
      {cluster.images.map((img) => {
        const isSelected = selected.includes(img.id);

        return (
          <li className="basis-1/5 max-w-[300px] cursor-pointer" key={img.id}>
            <div
              className={`min-w-[8em] border-solid border-2 rounded-lg overflow-hidden select-none text-center relative ${
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
                className={`m-1.5 text-base font-medium ${
                  isSelected ? 'text-spark-purple-700' : 'text-gray-800'
                }`}
              >
                {isSelected && (
                  <XCircle className="absolute top-2 right-2 fill-spark-purple-100" />
                )}
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
      <>
        <p className="font-bold pb-2">
          {selected.length} Image{selected.length > 1 ? 's are' : ' is'} about
          to be deleted.{' '}
        </p>
        <p className="text-sm">Are you sure you want to continue?</p>
      </>
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
            buttonKind={
              !validSelection
                ? ThemedButtonKind.PRIMARY_DISABLED
                : ThemedButtonKind.PRIMARY_ACTION
            }
          />
        }
      >
        <InteractiveStatesWrapper
          firstHeaderGroup={
            <>
              <p className="text-base font-inter">Fetched:</p>
              <PillBadge extraClasses={'bg-spark-purple-300'}>
                {filesFetched} files
              </PillBadge>
              <PillBadge extraClasses={'bg-spark-purple-300'}>
                {clustersFetched} clusters
              </PillBadge>
            </>
          }
          secondHeaderGroup={
            <>
              {selected.length === 0 && (
                <PillBadge extraClasses={'bg-rose-50 '}>
                  <AlertTriangle size={16} />
                  Select files to delete
                </PillBadge>
              )}
              {selected.length > 0 && (
                <div className="flex items-center gap-x-2 xl:gap-x-4">
                  <p className="text-sm xl:text-base font-inter">Selected:</p>
                  <PillBadge extraClasses={'bg-emerald-50'}>
                    {selected.length} files
                  </PillBadge>
                </div>
              )}
            </>
          }
        >
          <ul className="flex flex-col overflow-y-auto">
            {state.filesClusterResults.map((cluster) => (
              <FileComparison
                key={cluster.id}
                cluster={cluster}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
          </ul>
        </InteractiveStatesWrapper>
      </StateWrapper>
    </>
  );
};
