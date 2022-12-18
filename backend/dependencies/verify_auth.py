from fastapi import HTTPException, Request
from db.db_handler import get_token_from_email


def verify_auth_and_get_token(request: Request):
    access_token = get_token_from_email(request.state.user_email)
    if not access_token:
        raise HTTPException(status_code=401, detail="User is not authorized")
    request.state.access_token = access_token
