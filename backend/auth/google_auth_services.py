from dotenv import load_dotenv
import logging
import os
import requests
import json
import jwt

load_dotenv()

GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"


def get_token_from_code(code):
    data = {
        'code': code,
        'client_id': os.environ.get("GOOGLE_CLIENT_ID"),
        'client_secret': os.environ.get("GOOGLE_CLIENT_SECRET"),
        'redirect_uri': os.environ.get("GOOGLE_REDIRECT_URI"),
        'grant_type': 'authorization_code'
    }

    res = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)

    if not res.ok:
        raise Exception("Error getting token from google")
    return res.json()


def get_email_from_id_token(id_token):
    return jwt.decode(id_token)["email"]
