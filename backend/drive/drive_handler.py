from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.credentials import Credentials
from custom_types.Image import Image
from custom_types.Drive import DriveMimeType
from custom_types.File import File
from typing import Dict, List
import requests


class DriveHandler:
    def __init__(self, credentials: Credentials):
        self.drive = build('drive', 'v3', credentials=credentials)

    def get_image_bytes_from_url(self, image_url: str) -> str:
        return requests.get(image_url).content

    def get_files_from_parent_id(self, parent_id: str = "root", mime_type: DriveMimeType = DriveMimeType.FOLDER, page_size: int = 1000) -> List[File]:
        if page_size < 1 or page_size > 1000:
            raise Exception("Page size must be between 0 and 1000")

        files = []
        try:
            request_done = False
            page_token = None
            while not request_done:
                res = self.drive.files().list(
                    q=f"'{parent_id}' in parents and mimeType = '{mime_type.value}' and trashed = false",
                    pageSize=page_size,
                    corpora="user",
                    fields=f"nextPageToken, files(id, name {', thumbnailLink' if mime_type == DriveMimeType.IMAGE else ''})",
                    pageToken=page_token,
                ).execute()

                if "nextPageToken" in res:
                    page_token = res["nextPageToken"]
                else:
                    request_done = True

                files += [File(**file) for file in res["files"]]

        except HttpError as e:
            # TODO: handle drive API errors properly
            print(f"An error occurred: {e}")

        return files

    def get_images_from_folder_id(self, folder_id: str) -> List[Image]:
        images = []
        files = self.get_files_from_parent_id(
            folder_id, DriveMimeType.IMAGE)
        for img in files:
            if not img.thumbnailLink:
                continue
            image_bytes = self.get_image_bytes_from_url(img.thumbnailLink)
            images.append(
                Image(img.id, img.name, image_bytes, img.thumbnailLink))
        return images

    def get_images_from_folders_ids(self, folders_ids: List[str]) -> List[Image]:
        folders_image = [self.get_images_from_folder_id(
            folder_id) for folder_id in folders_ids]
        images = []
        for folder_image in folders_image:
            for image in folder_image:
                images.append(image)
        return images

    def delete_file_from_id(self, file_id: str) -> bool:
        try:
            self.drive.files().update(fileId=file_id, body={
                'trashed': True}).execute()
        except HttpError:
            print("ERROR: File not found")
            return False
        return True

    def delete_files_from_ids(self, files_ids: List[str]) -> Dict[str, bool]:
        deletion_status = {}
        for file_id in files_ids:
            deletion_status[file_id] = self.delete_file_from_id(file_id)
        return deletion_status
