from fastapi import HTTPException, Request
from db.db_handler import get_access_and_refresh_token_from_email
from drive.drive_handler import DriveHandler
from auth.google_auth_services import craft_credentials_from_tokens


def verify_auth_and_create_drive_handler(request: Request):
    tokens = get_access_and_refresh_token_from_email(request.state.user_email)
    if not tokens:
        raise HTTPException(status_code=401, detail="User is not authorized")
    credentials = craft_credentials_from_tokens(**tokens)
    request.state.drive_handler = DriveHandler(credentials)
