import { Folders } from './api';

export enum FolderActions {
  SELECTED,
  UNSELECTED,
}

export type FolderAction = {
  type: FolderActions;
  folder: Folders;
};

export const processAndReturnActions = (
  newAction: FolderAction,
  prevActions: FolderAction[],
) => {
  // Checks if the actions to insert is already in the list of actions
  const isDuplicatedAction = prevActions.find(
    (currAction) =>
      newAction.folder.id === currAction.folder.id &&
      newAction.type === currAction.type,
  );

  if (isDuplicatedAction) {
    return prevActions;
  }

  // Checks if there's the opposite action in list, if there is, remove and return
  const oppositeActions = prevActions.filter(
    (act) =>
      !(act.folder.id === newAction.folder.id && act.type !== newAction.type),
  );

  if (oppositeActions.length !== prevActions.length) {
    return oppositeActions;
  }

  return [...prevActions, newAction];
};

export const folderActionsToFolders = (
  prevSelectedFolders: Folders[],
  folderActions: FolderAction[],
) => {
  const toDeleteFoldersIds = folderActions
    .filter((action) => action.type === FolderActions.UNSELECTED)
    .map((action) => action.folder.id);

  const toInsertFolders = folderActions
    .filter((action) => action.type === FolderActions.SELECTED)
    .map((action) => action.folder);

  return [...prevSelectedFolders, ...toInsertFolders].filter(
    (folder) => !toDeleteFoldersIds.includes(folder.id),
  );
};
