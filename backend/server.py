from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import auth.google_auth_services as g_auth
import db.db_handler as db
from fastapi.responses import JSONResponse

from dotenv import load_dotenv

load_dotenv("./secrets/.env")

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSION_ID = "session_id"


@app.get("/api/auth/google")
def login(code=None):
    if code:
        try:
            token_data = g_auth.get_token_from_code(code)
            user_info = g_auth.get_email_and_hash_from_id_token(
                token_data["id_token"])

            user_id = db.add_user_if_missing(
                user_info['email'], token_data['access_token'], token_data['refresh_token'], user_info['at_hash'])
            auth = db.get_user_auth(user_id)

            response = JSONResponse(
                content={'ok': True, 'email': user_info['email']})
            response.set_cookie(
                key=SESSION_ID, value=auth, httponly=True, max_age=60*60*24)  # TODO: Add Cookie expiration validation.
            return response
        except Exception as e:
            print(e)
            return JSONResponse(content={'ok': False, 'email': ''})


@app.get("/api/auth/logout")
def logout(request: Request):
    if request.state.user_email:
        print("User was logged in")
        # TODO: Unlink session_id to user_id
    response = JSONResponse(content={'ok': True})
    response.delete_cookie(SESSION_ID)
    return response


@app.get("/api/auth/cookie")
def cookie(request: Request):
    if request.state.user_email:
        return JSONResponse(content={'ok': True, 'email': request.state.user_email})
    return JSONResponse(content={'ok': False, 'email': ''})


@app.middleware("http")
def auth_middlewere(request: Request, call_next):
    session_id = request.cookies.get("session_id")
    user_email = None
    if session_id:
        user_email = db.auth_cookie_to_email(session_id)
    request.state.user_email = user_email
    return call_next(request)
