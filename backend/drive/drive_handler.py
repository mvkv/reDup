from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload

import io


class DriveHandler:
    def __init__(self, token):
        # TODO: Implement refresh token
        self.drive = build('drive', 'v3', credentials=Credentials(token))

    def __get_image_from_id(self, image_id: str) -> str:
        try:
            request = self.drive.files().get_media(fileId=image_id)
            file = io.BytesIO()
            downloader = MediaIoBaseDownload(file, request)
            done = False
            while done is False:
                status, done = downloader.next_chunk()
                print(F'Download {int(status.progress() * 100)}%')

        except HttpError as error:
            print(F'An error occurred: {error}')
            file = None

        return file.getvalue()

    def get_folders_or_images_from_parent(self, get_images=False, parent_id="root"):
        mimeType = "application/vnd.google-apps.folder"
        if get_images:
            mimeType = "image/jpeg"

        files = []
        try:
            request_done = False
            page_token = ""
            while not request_done:
                print("Getting files...")
                res = self.drive.files().list(
                    q=f"'{parent_id}' in parents and mimeType = '{mimeType}' and trashed = false",
                    fields="nextPageToken, files(id, name, parents)",
                    pageToken=page_token,
                ).execute()

                if "nextPageToken" in res:
                    page_token = res["nextPageToken"]
                else:
                    request_done = True

                files += res["files"]

        except HttpError as e:
            print(f"An error occurred: {e}")
            files = None

        return files

    def get_images_from_folders_ids(self, folders_ids):
        images_ids = []
        images = []
        for folder_id in folders_ids:
            images_ids += [images.append(self.__get_image_from_id(image["id"])) for image in self.get_folders_or_images_from_parent(
                get_images=True, parent_id=folder_id)]

        return images
