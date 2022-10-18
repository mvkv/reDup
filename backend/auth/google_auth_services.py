from dotenv import load_dotenv
import os
import requests
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


def get_email_and_hash_from_id_token(id_token):
    id_token_decoded = jwt.decode(
        id_token, options={"verify_signature": False})
    return {
        "email": id_token_decoded["email"],
        "at_hash": id_token_decoded["at_hash"]
    }
