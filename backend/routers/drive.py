from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.encoders import jsonable_encoder
from drive.drive_handler import DriveHandler
from dependencies.verify_auth import verify_auth_and_get_token
from images.images_processing import cluster_images, get_web_content_from_clusters
from typing import List

router = APIRouter(
    prefix="/api/drive",
    dependencies=[Depends(verify_auth_and_get_token)]
)


@router.get("/folders")
async def get_folders(request: Request, folder_id: str = None):
    drive_handler = DriveHandler(request.state.access_token)

    get_files_from_parent_id_args = {}
    if folder_id:
        get_files_from_parent_id_args["parent_id"] = folder_id
    folders = drive_handler.get_files_from_parent_id(
        **get_files_from_parent_id_args)
    return [jsonable_encoder(folder) for folder in folders]


@router.post("/images")
async def get_images_from_folders(request: Request, folders_ids: List[str]):
    if not folders_ids:
        raise HTTPException(
            status_code=400, detail="<folders_ids> param missing")

    drive_handler = DriveHandler(request.state.access_token)
    images = drive_handler.get_images_from_folders_ids(folders_ids)
    return get_web_content_from_clusters(cluster_images(images))


@router.post("/delete-images")
def delete_images(request: Request, ids: List[str]):
    if not ids:
        raise HTTPException(
            status_code=400, detail="<files_ids> param missing")

    drive_handler = DriveHandler(request.state.access_token)
    if not drive_handler.delete_files_from_ids(ids):
        return {"status": "failed"}
    return {"status": "ok"}
