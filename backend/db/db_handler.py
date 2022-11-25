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


def add_user_if_missing(email, access_token, refresh_token, at_hash):
    user = find_user_by_email(email)
    if user:
        return user[0].id
    new_user = users.document()
    new_user.set({
        u"email": email,
        u"access_token": access_token,
        u"refresh_token": refresh_token,
        u"at_hash": at_hash
    })
    auth_cookie = secrets.token_urlsafe(32)
    cookies.document(auth_cookie).set({'uuid': new_user.id})
    return new_user.id


def get_user_auth(uuid):
    auth = cookies.where(u'uuid', u'==', uuid).limit(1).get()
    if auth:
        return auth[0].id
    return None


def auth_cookie_to_email(auth_cookie):
    user_id = cookies.document(auth_cookie).get()
    if user_id.exists:
        uuid = user_id.to_dict()['uuid']
        user2 = users.document(uuid).get()
        if user2.exists:
            return user2.to_dict()["email"]
    return None


def find_user_by_email(email_to_find):
    return users.where(u'email', u'==', email_to_find).limit(1).get()
