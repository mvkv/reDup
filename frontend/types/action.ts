import { Folders } from './api';

export enum FolderActions {
  INSERT,
  DELETE,
}

export type FolderAction = {
  type: FolderActions;
  folder: Folders;
};

export const handleFolderAction = (
  action: FolderAction,
  actions: FolderAction[],
) => {
  // Checks if the actions to insert is already in the list of actions
  if (
    actions.find(
      (currAction) =>
        action.folder.id === currAction.folder.id &&
        action.type === currAction.type,
    )
  ) {
    return actions;
  }

  // Checks if there's the opposite action in list, if there is, remove and return
  const oppositeActions = actions.filter(
    (act) => !(act.folder.id === action.folder.id && act.type !== action.type),
  );

  if (oppositeActions.length !== actions.length) {
    return oppositeActions;
  }

  return [...actions, action];
};

export const folderActionsToFolders = (
  folders: Folders[],
  folderActions: FolderAction[],
) => {
  const toDeleteFoldersIds = folderActions
    .filter((action) => action.type === FolderActions.DELETE)
    .map((action) => action.folder.id);

  const toInsertFolders = folderActions
    .filter((action) => action.type === FolderActions.INSERT)
    .map((action) => action.folder);

  return [...folders, ...toInsertFolders].filter(
    (folder) => !toDeleteFoldersIds.includes(folder.id),
  );
};
