export type LoginResponse = {
  ok: boolean;
  email: string;
  profile_pic: string;
};

export type LogoutResponse = {
  ok: boolean;
};

export type Folders = {
  id: string;
  name: string;
};

export type GetFoldersResponse = {
  ok: boolean;
  folders: Folders[];
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
  deleted_images: DeletionStatus[];
};
