from images.images_processing import cluster_images_from_bytes
from drive.drive_handler import DriveHandler
from dotenv import load_dotenv
import os

# To run the tests use:
# cd backend
# python -m tests.images_clustering_test

load_dotenv("secrets/.env")
DUMMY_TOKEN = os.environ.get(key="DUMMY_TOKEN")
drive_handler = DriveHandler(DUMMY_TOKEN)


def get_images_from_folders(folders):
    images = drive_handler.get_images_from_folders_ids(folders)
    clusters = cluster_images_from_bytes(images)
    for cluster in clusters:
        print([image["name"] for image in cluster])


def get_all_folders_from_drive():
    all_folders_found = False
    folders = []
    parents = ["root"]
    while not all_folders_found:
        if len(parents) == 0:
            break
        folders_found = drive_handler.get_folders_or_images_from_parent(
            parent_id=parents[-1])
        parents.pop(-1)
        folders += [{"name": folder["name"], "id": folder["id"]}
                    for folder in folders_found]
        parents += [folder["id"] for folder in folders_found]


if __name__ == "__main__":
    get_images_from_folders(["root"])
