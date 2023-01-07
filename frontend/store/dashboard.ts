import { Cluster, DeletionStatus } from '../types/api';

export enum StateType {
  INITIAL = 1,
  FOLDER_FETCH = 2,
  FOLDER_SELECT = 3,
  FILES_FETCH = 4,
  FILES_SELECT = 5,
  RESULT_FETCH = 6,
  FINAL = 7,
}

export const STATE_TO_STEP_N = {
  [StateType.INITIAL]: 0,
  [StateType.FOLDER_FETCH]: 1,
  [StateType.FOLDER_SELECT]: 1,
  [StateType.FILES_FETCH]: 2,
  [StateType.FILES_SELECT]: 2,
  [StateType.RESULT_FETCH]: 3,
  [StateType.FINAL]: 3,
};

export const STATE_TO_LABEL = {
  [StateType.INITIAL]: 'Welcome',
  [StateType.FOLDER_FETCH]: 'Select Folder',
  [StateType.FOLDER_SELECT]: 'Select Folder',
  [StateType.FILES_FETCH]: 'Select Files',
  [StateType.FILES_SELECT]: 'Select Files',
  [StateType.RESULT_FETCH]: 'Summary',
  [StateType.FINAL]: 'Summary',
};

export const LOADING_STEPS = new Set([
  StateType.FILES_FETCH,
  StateType.FOLDER_FETCH,
  StateType.RESULT_FETCH,
]);

export const LAST_STEP_N = Math.max(...Object.values(STATE_TO_STEP_N));

export type DahsboardState = {
  currState: StateType;
  folderPath: string[];
  foldersResults: string[];
  foldersSelected: string[];
  filesClusterResults: Cluster[];
  filesSelected: string[];
  finalSummary: DeletionStatus[];
  error: string;
};

export const DEFAULT_DAHSBOARD_STATE: DahsboardState = {
  currState: StateType.INITIAL,
  folderPath: [],
  foldersResults: [],
  foldersSelected: [],
  filesClusterResults: [],
  filesSelected: [],
  finalSummary: [],
  error: '',
};

export type Action = {
  goTo: StateType;
  folderPathSelected?: string[];
  fetchedFolders?: string[];
  foldersSelected?: string[];
  fetchedFilesCluster?: Cluster[];
  filesSelected?: string[];
  fetchedSummary?: DeletionStatus[];
};

function validateStateTransition(curr: StateType, goTo: StateType): boolean {
  return goTo == StateType.INITIAL || goTo - curr <= 1;
}

export function reducer(state: DahsboardState, action: Action) {
  const errorSameState = {
    ...state,
    error: 'State unchanged, something might be wrong.', // TODO Implement more accurate error handling.
  };
  const validState = { ...state, error: '' };
  if (!validateStateTransition(state.currState, action.goTo)) {
    return errorSameState;
  }
  switch (action.goTo) {
    case StateType.INITIAL:
      return DEFAULT_DAHSBOARD_STATE;
    case StateType.FOLDER_FETCH:
      if (action.folderPathSelected) {
        return {
          ...validState,
          currState: StateType.FOLDER_FETCH,
          folderPath: [...action.folderPathSelected],
        };
      }
      return { ...validState, currState: StateType.FOLDER_FETCH };
    case StateType.FOLDER_SELECT:
      // We can get into a nested folder where we don't have further inner folders.
      // if (!action.fetchedFolders?.length) { return errorSameState; }
      return {
        ...validState,
        currState: StateType.FOLDER_SELECT,
        foldersResults: action.fetchedFolders,
      };
    case StateType.FILES_FETCH:
      if (!action.foldersSelected?.length) {
        return errorSameState;
      }
      return {
        ...validState,
        currState: StateType.FILES_FETCH,
        foldersSelected: action.foldersSelected,
      };
    case StateType.FILES_SELECT:
      if (!action.fetchedFilesCluster?.length) {
        return errorSameState;
      }
      return {
        ...validState,
        currState: StateType.FILES_SELECT,
        filesClusterResults: action.fetchedFilesCluster,
      };
    case StateType.RESULT_FETCH:
      if (!action.filesSelected?.length) {
        return errorSameState;
      }
      return {
        ...validState,
        currState: StateType.RESULT_FETCH,
        filesSelected: action.filesSelected,
      };
    case StateType.FINAL:
      if (!action.fetchedSummary?.length) {
        return errorSameState;
      }
      return {
        ...validState,
        currState: StateType.FINAL,
        finalSummary: action.fetchedSummary,
      };
    default:
      throw new Error();
  }
}
