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

export const LOADING_STEPS = new Set([
  StateType.FILES_FETCH,
  StateType.FOLDER_FETCH,
  StateType.RESULT_FETCH,
]);

export const LAST_STEP_N = Math.max(...Object.values(STATE_TO_STEP_N));

export type DahsboardState = {
  currState: StateType;
  foldersResults: string[];
  foldersSelected: string[];
  filesResults: string[];
  filesSelected: string[];
  finalSummary: string[];
  error: string;
};

export const DEFAULT_DAHSBOARD_STATE: DahsboardState = {
  currState: StateType.INITIAL,
  foldersResults: [],
  foldersSelected: [],
  filesResults: [],
  filesSelected: [],
  finalSummary: [],
  error: '',
};

export type Action = {
  goTo: StateType;
  fetchedFolders?: string[];
  foldersSelected?: string[];
  fetchedFiles?: string[];
  filesSelected?: string[];
  fetchedSummary?: string[];
};

function validateStateTransition(curr: StateType, goTo: StateType): boolean {
  return curr !== StateType.FINAL && goTo - curr <= 1;
}

export function reducer(state: DahsboardState, action: Action) {
  console.log(state, action, 'doing');
  const errorSameState = {
    ...state,
    error: 'State unchanged, something might be wrong.', // TODO Implement more accurate error handling.
  };
  const validState = { ...state, error: '' };
  if (!validateStateTransition(state.currState, action.goTo)) {
    return errorSameState;
  }
  switch (action.goTo) {
    case StateType.FOLDER_FETCH:
      return { ...validState, currState: StateType.FOLDER_FETCH };
    case StateType.FOLDER_SELECT:
      if (!action.fetchedFolders?.length) {
        return errorSameState;
      }
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
      if (!action.fetchedFiles?.length) {
        return errorSameState;
      }
      return {
        ...validState,
        currState: StateType.FILES_SELECT,
        filesResults: action.fetchedFiles,
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
