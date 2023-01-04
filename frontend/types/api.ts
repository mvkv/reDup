export type LoginResponse = {
  ok: boolean;
  email: string;
};

export type LogoutResponse = {
  ok: boolean;
};

export type GetFoldersResponse = {
  ok: boolean;
  folders: string[];
};

export type Image = {
  id: string;
  name: string;
  image_url: string;
};

export type Cluster = {
  id: string;
  images: Image[];
};

export type GetFilesResponse = {
  ok: boolean;
  clusters: Cluster[];
};

export type DeletionStatus = {
  id: string;
  deleted: boolean;
};

export type DeleteImagesResponse = {
  ok: boolean;
  deletedImages: DeletionStatus[];
};
