from typing import Union
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import auth.google_auth_services as g_auth
import requests
import os

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
            user_email = g_auth.get_email_from_id_token(token_data["id_token"])
            # save user on DB
            return RedirectResponse(f"http://localhost:3000/dashboard?user={user_email}")
        except:
            return error_redirect
