import {
  DeleteImagesResponse,
  GetFilesResponse,
  GetFoldersResponse,
} from '../types/api';
import config from '../config.json';

export const fetchDriveFolders = async (
  folder_id: string = 'root',
): Promise<GetFoldersResponse> => {
  const res = await fetch(
    `${config.backendAddress}/api/drive/folders?${new URLSearchParams({
      folder_id: folder_id,
    })}`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );
  const body: GetFoldersResponse = await res.json();
  return body;
};

export const fetchImagesCluster = async (
  folders_id: string[],
): Promise<GetFilesResponse> => {
  const res = await fetch(
    `${config.backendAddress}/api/drive/images?${new URLSearchParams(
      folders_id.map((folder_id) => ['folders_id', folder_id]),
    )}`,
    {
      method: 'POST',
      credentials: 'include',
    },
  );
  const body: GetFilesResponse = await res.json();
  return body;
};

export const deleteImagesAndFetchSummary = async (
  ids: string[],
): Promise<DeleteImagesResponse> => {
  const res = await fetch(
    `${config.backendAddress}/api/drive/delete-images?${new URLSearchParams(
      ids.map((id) => ['files_ids', id]),
    )}`,
    {
      method: 'POST',
      credentials: 'include',
    },
  );
  const body: DeleteImagesResponse = await res.json();
  return body;
};
