import os
from google.oauth2.credentials import Credentials
from typing import Any, Dict
import requests
import jwt
from collections import namedtuple

GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"


def get_token_from_code(code) -> Dict[str, Any]:
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


# TODO: Add scope + decoding for "name"
TokenData = namedtuple('TokenInfo', ['email', 'at_hash', 'profile_pic'])


def get_email_and_hash_from_id_token(id_token) -> TokenData:
    id_token_decoded = jwt.decode(
        id_token, options={"verify_signature": False}, audience=os.environ.get("GOOGLE_CLIENT_ID"))
    return TokenData(id_token_decoded["email"], id_token_decoded["at_hash"], id_token_decoded["picture"])


def craft_credentials_from_tokens(access_token: str, refresh_token: str):
    return Credentials(access_token,
                       refresh_token=refresh_token,
                       client_id=os.environ.get("GOOGLE_CLIENT_ID"),
                       client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
                       token_uri=GOOGLE_ACCESS_TOKEN_OBTAIN_URL)
