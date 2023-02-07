from fastapi import APIRouter, Depends, Request, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from dependencies.drive_dependency import verify_auth_and_create_drive_handler
from images.images_processing import cluster_images, get_web_content_from_clusters
from custom_types.Drive import DriveMimeType
from typing import List
from routers.fake_drive_responses import fake_get_folders_from_parent_id, fake_delete_files_from_ids, fake_get_clusters_from_folders_ids
import os

router = APIRouter(
    prefix="/api/drive",
    dependencies=[Depends(verify_auth_and_create_drive_handler)]
)

USE_FAKE_DATA = os.environ.get('REDUP_FAKE_DATA', 'False').lower() == "true"
ERROR_RESPONSE = JSONResponse(content={'ok': False})


@router.get("/folders")
async def get_folders(request: Request, folder_id: str = "root"):

    if USE_FAKE_DATA:
        folders = fake_get_folders_from_parent_id(folder_id)
    else:
        folders = request.state.drive_handler.get_files_from_parent_id(
            folder_id, DriveMimeType.FOLDER.value)
        if not folders:
            return ERROR_RESPONSE

    return JSONResponse(content={
        "ok": True,
        "folders": [jsonable_encoder(folder) for folder in folders]
    })


@router.post("/images")
async def get_images_from_folders(request: Request, folders_id: List[str] = Query(None)):
    if not folders_id:
        raise HTTPException(
            status_code=400, detail="<folders_ids> param missing")

    if USE_FAKE_DATA:
        clusters = fake_get_clusters_from_folders_ids(folders_id)
    else:
        images = request.state.drive_handler.get_images_from_folders_ids(
            folders_id)
        if not images:
            return ERROR_RESPONSE
        clusters = get_web_content_from_clusters(cluster_images(images))

    return JSONResponse(content={
        "ok": True,
        "clusters": clusters
    })


@router.post("/delete-images")
def delete_images(request: Request, files_ids: List[str] = Query(...)):
    if not files_ids:
        raise HTTPException(
            status_code=400, detail="<files_ids> param missing")

    if USE_FAKE_DATA:
        deletion_status = fake_delete_files_from_ids(files_ids)
    else:
        deletion_status = request.state.drive_handler.delete_files_from_ids(
            files_ids)
        if not deletion_status:
            return ERROR_RESPONSE

    return JSONResponse(content={
        "ok": True,
        "deleted_images": [{'id': k, 'deleted': v} for k, v in deletion_status.items()]
    })
