# Remove duplicates and near-duplicates photos from Google Drive

## Tech stack

**Frontend:** Typescript, NextJs, Tailwind

**Backend:** Python3, FastAPI

## Startup

### Run backend

First install the required dependencies with

```
cd backend &&  pip3 install -r requirements.txt
```

then

```
uvicorn server:app --reload
```

You will need to create a secrets/ directory under backend with :

1. an `.env` file that will contain settings / hardcoded variables.
2. `google_application_credentials.json` that will be used to authenticate with Google APIs.

### Run frontend

First install the required dependencies with

```
cd frontend && npm install
```

then

```
npm run dev
```

## Addresses

**Frontend:** http://127.0.0.1:3000

**Backend:** http://127.0.0.1:8000
