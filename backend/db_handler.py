from google.oauth2.service_account import Credentials
from google.cloud import firestore
import os

credentials = Credentials.from_service_account_file(
    "secrets/google_application_credentials.json", scopes=["https://www.googleapis.com/auth/cloud-platform"])
db = firestore.Client(project=os.environ.get(
    "GOOGLE_APPLICATION_ID"), credentials=credentials)

users = db.collection(u'users')


def create_new_user(email, access_token, refresh_token, at_hash):
    users.document(email).set({
        u"email": email,
        u"access_token": access_token,
        u"refresh_token": refresh_token,
        u"at_hash": at_hash
    })


def delete_user(email):
    users.document(email).delete()
