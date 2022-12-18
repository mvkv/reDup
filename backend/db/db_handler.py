from typing import Union
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


def add_user_and_get_uuid(email: str, access_token: str, refresh_token: str, at_hash: str) -> str:
    """ Add the user to the users and cookies database, if not already there. Return the user UUID """
    user_uuid = find_user_uuid_by_email(email)
    if user_uuid:
        # Even if the user is already registered it could be that the cookie <-> session pairing was deleted.
        # Generate a new paring if so.
        if not get_session_id_from_uuid(user_uuid):
            generate_and_store_session_id(user_uuid, email)
        return user_uuid
    new_user_uuid = users.document()
    new_user_uuid.set({
        u"email": email,
        u"access_token": access_token,
        u"refresh_token": refresh_token,
        u"at_hash": at_hash
    })
    generate_and_store_session_id(new_user_uuid.id, email)
    return new_user_uuid.id


def generate_and_store_session_id(uuid: str, email: str) -> str:
    session_id = secrets.token_urlsafe(32)
    cookies.document(session_id).set({'uuid': uuid, 'email': email})
    return session_id


def get_session_id_from_uuid(uuid: str) -> Union[None, str]:
    auth = cookies.where(u'uuid', u'==', uuid).limit(1).get()
    if auth:
        return list(auth)[0].id
    return None


def delete_session_id(session_id: Union[str, None]) -> None:
    if session_id:
        cookies.document(session_id).delete()


def get_email_from_session_id(session_id: str) -> Union[None, str]:
    cookie_to_id = cookies.document(session_id).get()
    if cookie_to_id.exists:
        email = cookie_to_id.to_dict()['email']  # type: ignore
        if email:
            return email
    return None


def find_user_uuid_by_email(email_to_find: str) -> Union[None, str]:
    user = users.where(u'email', u'==', email_to_find).limit(1).get()
    if user:
        return list(user)[0].id
    else:
        return None


def get_token_from_email(email: str) -> str:
    user = users.document(find_user_uuid_by_email(email)).get()
    if user.exists:
        return user.to_dict()["access_token"]
    else:
        return None
