from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from dependencies.drive_dependency import verify_auth_and_create_drive_handler
from images.images_processing import cluster_images, get_web_content_from_clusters
from typing import List

router = APIRouter(
    prefix="/api/drive",
    dependencies=[Depends(verify_auth_and_create_drive_handler)]
)


@router.get("/folders")
async def get_folders(request: Request, folder_id: str = None):

    get_files_from_parent_id_args = {}
    if folder_id:
        get_files_from_parent_id_args["parent_id"] = folder_id
    folders = request.state.drive_handler.get_files_from_parent_id(
        **get_files_from_parent_id_args)
    return JSONResponse(content={
        "ok": True if folders else False,
        "body": {
            "folders": [jsonable_encoder(folder) for folder in folders]
        }
    })


@router.post("/images")
async def get_images_from_folders(request: Request, folders_ids: List[str]):
    if not folders_ids:
        raise HTTPException(
            status_code=400, detail="<folders_ids> param missing")

    images = request.state.drive_handler.get_images_from_folders_ids(
        folders_ids)
    return JSONResponse(content={
        "ok": True if images else False,
        "body": {
            "clusters": get_web_content_from_clusters(cluster_images(images))
        }
    })


@router.post("/delete-images")
def delete_images(request: Request, ids: List[str]):
    if not ids:
        raise HTTPException(
            status_code=400, detail="<files_ids> param missing")

    deletion_status = request.state.drive_handler.delete_files_from_ids(ids)
    return JSONResponse(content={
        "ok": True if deletion_status else False,
        "body": {
            "deleted_images": deletion_status
        }
    })
