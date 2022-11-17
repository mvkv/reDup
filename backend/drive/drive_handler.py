from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


class DriveHandler:
    def __init__(self, token):
        # TODO: Implement refresh token
        self.drive = build('drive', 'v3', credentials=Credentials(token))

    def get_files(self, get_images=False, parent_id=None):
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
                    q=f"'{'root' if not parent_id else parent_id}' in parents and mimeType = '{mimeType}' and trashed = false",
                    fields="nextPageToken, files(id, name, parents)",
                    pageToken=page_token
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
