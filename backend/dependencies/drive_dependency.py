from fastapi import HTTPException, Request
from db.db_handler import get_token_from_email
from drive.drive_handler import DriveHandler


def verify_auth_and_create_drive_handler(request: Request):
    access_token = get_token_from_email(request.state.user_email)
    if not access_token:
        raise HTTPException(status_code=401, detail="User is not authorized")
    request.state.drive_handler = DriveHandler(access_token)
