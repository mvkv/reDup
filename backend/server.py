from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import db.db_handler as db
from routers import drive, auth
from config import setup_logger

load_dotenv("./secrets/.env")


app = FastAPI()
setup_logger()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(drive.router)
app.include_router(auth.router)


@app.middleware("http")
def auth_middlewere(request: Request, call_next):
    session_id = request.cookies.get("session_id")
    request.state.user_email = None
    if session_id:
        request.state.user_email, request.state.profile_pic = db.get_email_and_pic_from_session_id(session_id)
    return call_next(request)
