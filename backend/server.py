from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import auth.google_auth_services as g_auth
import os
import dotenv
import db_handler

dotenv.load_dotenv("secrets/.env")
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/helloworld")
def hello_world():
    return {"status": 200, "message": "Hello world"}


@app.get("/api/login")
def login(code=None, scope=None, error=None):
    error_redirect = RedirectResponse(
        f"{os.environ.get('FRONTEND_BASE_URL')}/login?error='Something went wrong with google authentication'")

    if error:
        return error_redirect

    if code:
        try:
            token_data = g_auth.get_token_from_code(code)
            user_info = g_auth.get_email_and_hash_from_id_token(
                token_data["id_token"])
            db_handler.create_new_user(
                user_info['email'], token_data['access_token'], token_data['refresh_token'], user_info['at_hash'])
            return RedirectResponse(f"http://localhost:3000/dashboard?user={user_info['email']}&token={user_info['at_hash']}")
        except Exception as e:
            print(e)
            return error_redirect
