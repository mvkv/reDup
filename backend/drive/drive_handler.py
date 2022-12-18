from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload
from custom_types.Image import Image
from enums.mime_types import DriveMimeType
from custom_types.File import File
from typing import List

import io


class DriveHandler:
    def __init__(self, token):
        # TODO: Implement refresh token
        self.drive = build('drive', 'v3', credentials=Credentials(token))

    def _get_image_from_id(self, image_id: str) -> str or None:
        try:
            request = self.drive.files().get_media(fileId=image_id)
            file = io.BytesIO()
            downloader = MediaIoBaseDownload(file, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
                # TODO: add logging library
                print(f'Downloading image: {int(status.progress() * 100)}%')
            file = file.getvalue()

        except HttpError as error:
            print(f'An error occurred: {error}')
            file = None

        return file

    def get_files_from_parent_id(self, parent_id: str = "root", mime_type: str = DriveMimeType.FOLDER.value, page_size: int = 1000) -> List[File]:
        if page_size < 1 or page_size > 1000:
            raise Exception("Page size must be between 0 and 1000")

        files = []
        try:
            request_done = False
            page_token = None
            while not request_done:
                res = self.drive.files().list(
                    q=f"'{parent_id}' in parents and mimeType = '{mime_type}' and trashed = false",
                    pageSize=page_size,
                    corpora="user",
                    fields=f"nextPageToken, files(id, name, parents {', thumbnailLink' if mime_type == DriveMimeType.IMAGE.value else ''})",
                    pageToken=page_token,
                ).execute()

                if "nextPageToken" in res:
                    page_token = res["nextPageToken"]
                else:
                    request_done = True

                files += [File(**file) for file in res["files"]]

        except HttpError as e:
            print(f"An error occurred: {e}")

        return files

    def get_images_from_folder(self, folder_id: str) -> List[Image]:
        images = [Image(img.id, img.name, self._get_image_from_id(img.id), img.thumbnailLink)
                  for img in self.get_files_from_parent_id(folder_id, DriveMimeType.IMAGE.value)]
        return images

    def get_images_from_folders_ids(self, folders_ids: List[dict]) -> List[Image]:
        folders_image = [self.get_images_from_folder(
            folder_id) for folder_id in folders_ids]
        images = [
            image for list_of_images in folders_image for image in list_of_images]
        return images

    def delete_file_from_id(self, file_id: str) -> bool:
        try:
            self.drive.files().delete(fileId=file_id).execute()
        except HttpError:
            print("ERROR: File not found")
            return False
        return True

    def delete_files_from_ids(self, files_ids: List[str]) -> bool:
        for file_id in files_ids:
            if not self.delete_file_from_id(file_id):
                return False
        return True
