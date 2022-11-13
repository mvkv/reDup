from typing import Optional
from fastapi import FastAPI, Cookie
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import auth.google_auth_services as g_auth
from fastapi.responses import JSONResponse
import dotenv
import db_handler

dotenv.load_dotenv("secrets/.env")
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
            response = JSONResponse(
                content={'ok': True, 'email': user_info['email']})
            # db_handler.create_new_user(
            #    user_info['email'], token_data['access_token'], token_data['refresh_token'], user_info['at_hash'])
            # TODO: Replace user_id = email with random token stored db side.
            response.set_cookie(
                key=SESSION_ID, value=user_info['email'], httponly=True)
            return response
        except Exception as e:
            print(e)
            return JSONResponse(content={'ok': False, 'email': ''})


@app.get("/api/auth/logout")
def logout(session_id: Optional[str] = Cookie(None)):
    if session_id:
        print("User was logged in")
        # TODO: Unlink session_id to user_id
    response = JSONResponse(content={'ok': True})
    response.delete_cookie(SESSION_ID)
    return response
