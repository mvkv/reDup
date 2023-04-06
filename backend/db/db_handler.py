from typing import Union, TypedDict, List
from custom_types.UserInfo import UserInfo
from google.oauth2.service_account import Credentials
from google.cloud import firestore
import os
import secrets


credentials = Credentials.from_service_account_file(
    "secrets/google_application_credentials.json", scopes=["https://www.googleapis.com/auth/cloud-platform"])
db = firestore.Client(project=os.environ.get(
    "GOOGLE_APPLICATION_ID"), credentials=credentials)

users = db.collection(u'users')
# TODO Handle Cookie Expiration.
cookies = db.collection(u'cookies')


def add_user_and_get_uuid(email: str, profile_pic_url: str, access_token: str, refresh_token: str, at_hash: str) -> str:
    """ Add the user to the users and cookies database, if not already there. Return the user UUID """
    user_uuid = find_user_uuid_by_email(email)
    if user_uuid:
        # Even if the user is already registered it could be that the cookie <-> session pairing was deleted.
        # Generate a new paring if so.
        if not get_session_id_from_uuid(user_uuid):
            generate_and_store_session_id(user_uuid, email, profile_pic_url)
        return user_uuid
    new_user_uuid = users.document()
    new_user_uuid.set({
        u"email": email,
        u"access_token": access_token,
        u"refresh_token": refresh_token,
        u"at_hash": at_hash
    })
    generate_and_store_session_id(new_user_uuid.id, email, profile_pic_url)
    return new_user_uuid.id


def generate_and_store_session_id(uuid: str, email: str, profile_pic_url: str) -> str:
    session_id = secrets.token_urlsafe(32)
    cookies.document(session_id).set({'uuid': uuid, 'email': email, 'profile_pic_url': profile_pic_url})
    return session_id


def get_session_id_from_uuid(uuid: str) -> Union[None, str]:
    auth = cookies.where(u'uuid', u'==', uuid).limit(1).get()
    if auth:
        return list(auth)[0].id
    return None


def delete_session_id(session_id: Union[str, None]) -> None:
    if session_id:
        cookies.document(session_id).delete()


def get_email_and_pic_from_session_id(session_id: str) -> UserInfo:
    cookie_to_id = cookies.document(session_id).get()
    if cookie_to_id.exists:
        cookie_dict = cookie_to_id.to_dict()
        email = cookie_dict.get('email')  # type: ignore
        profile_pic_url = cookie_dict.get('profile_pic_url')  # type: ignore
        if email:
            return UserInfo(email, profile_pic_url)
    return UserInfo()


def find_user_uuid_by_email(email_to_find: str) -> Union[None, str]:
    user = users.where(u'email', u'==', email_to_find).limit(1).get()
    if user:
        return list(user)[0].id
    else:
        return None

class Tokens(TypedDict):
    access_token: str
    refresh_token: str

def get_access_and_refresh_token_from_email(email: str) -> Union[None, Tokens]:
    user_uuid = find_user_uuid_by_email(email)
    if not user_uuid: return None
    user = users.document(user_uuid).get()
    if not user.exists: return None
    user = user.to_dict()
    access_token, refresh_token = user["access_token"], user["refresh_token"]
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }
