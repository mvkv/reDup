import {
  DeleteImagesResponse,
  GetFilesResponse,
  GetFoldersResponse,
} from '../types/api';
import config from '../config.json';

export const getDriveFolders = async (): Promise<GetFoldersResponse> => {
  const res = await fetch(`${config.backendAddress}/api/drive/folders`, {
    method: 'GET',
    credentials: 'include',
  });
  const body: GetFoldersResponse = await res.json();
  return body;
};

export const getImagesCluster = async (): Promise<GetFilesResponse> => {
  const res = await fetch(`${config.backendAddress}/api/drive/images`, {
    method: 'POST',
    credentials: 'include',
  });
  const body: GetFilesResponse = await res.json();
  return body;
};

export const deleteImages = async (): Promise<DeleteImagesResponse> => {
  const res = await fetch(`${config.backendAddress}/api/drive/delete-images`, {
    method: 'POST',
    credentials: 'include',
  });
  const body: DeleteImagesResponse = await res.json();
  return body;
};

const getRandomStr = () => Math.random().toString(36).substring(3, 9);

export const fakeFetchFolders = (
  n: number = 1,
): Promise<GetFoldersResponse> => {
  return new Promise((resolve, _) => {
    setTimeout(
      () =>
        resolve({
          ok: true,
          folders: Array.from(Array(n), () => getRandomStr()),
        }),
      1500 + Math.random() * 1000,
    );
  });
};

export const fakeFetchFiles = (n: number = 1): Promise<GetFilesResponse> => {
  const getRandomCluster = () => ({
    id: getRandomStr(),
    images: Array.from(Array(Math.ceil(Math.random() * 4 + 2)), () => ({
      id: 'id_' + getRandomStr(),
      name: 'n_' + getRandomStr(),
      image_url: 'https://cataas.com/cat',
    })),
  });
  return new Promise((resolve, _) => {
    setTimeout(
      () =>
        resolve({
          ok: true,
          clusters: Array.from(Array(n), () => getRandomCluster()),
        }),
      1200 + Math.random() * 1500,
    );
  });
};

export const fakeFetchResults = (
  n: number = 8,
): Promise<DeleteImagesResponse> => {
  return new Promise((resolve, _) => {
    setTimeout(
      () =>
        resolve({
          ok: true,
          deletedImages: Array.from(Array(n), () => ({
            id: getRandomStr(),
            deleted: Math.random() > 0.1,
          })),
        }),
      1200 + Math.random() * 1500,
    );
  });
};
