from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import auth.google_auth_services as g_auth
import db.db_handler as db

router = APIRouter(
    prefix="/api/auth",
    dependencies=[]
)

SESSION_ID = "session_id"


@router.get("/google")
def login(code=None):
    login_error_response = JSONResponse(content={'ok': False, 'email': '', 'profile_pic': ''})
    if not code:
        return login_error_response
    try:    
        token_data = g_auth.get_token_from_code(code)
        email, at_hash, profile_pic = g_auth.get_email_and_hash_from_id_token(
            token_data["id_token"])

        user_id = db.add_user_and_get_uuid(
            email, token_data['access_token'], token_data['refresh_token'], at_hash)
        auth = db.get_session_id_from_uuid(user_id)
        if not auth:
            return login_error_response

        response = JSONResponse(
            content={'ok': True, 'email': email, 'profile_pic': profile_pic})
        response.set_cookie(
            key=SESSION_ID, value=str(auth), httponly=True, max_age=60 * 60 * 24)  # TODO: Add Cookie expiration validation.
        return response
    except Exception as e:
        print(e)
    return login_error_response


@router.get("/logout")
def logout(request: Request):
    session_id = request.cookies.get(SESSION_ID)
    if request.state.user_email and session_id:
        print("User was logged in")
        db.delete_session_id(session_id)
    response = JSONResponse(content={'ok': True})
    response.delete_cookie(SESSION_ID)
    return response


@router.get("/cookie")
def cookie(request: Request):
    if request.state.user_email:
        return JSONResponse(content={'ok': True, 'email': request.state.user_email, 'profile_pic': request.state.profile_pic})
    return JSONResponse(content={'ok': False, 'email': '', 'profile_pic': ''})
