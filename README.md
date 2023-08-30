# reDup: A Web App to Find and Delete Duplicate Images in Google Drive

reDup is a web app that helps you find and delete duplicate and similar images in your Google Drive. 

It has two modes: similar images and exact images. It uses the CLIP library by OpenAI to compare images and identify those that are visually similar, and difference hash to identify exact duplicates.
It also lets you select which images to delete and moves them to the trash bin.

## Demo video
https://github.com/mvkv/reDup/assets/10170332/efb6afbb-02fd-4fa3-aff9-5f30ca4ba843


## Tech Stack
* Backend: Python, FastAPI
* Frontend: Typescript, NextJS, Tailwind

## Getting Started

To get started with reDup, you will need to:

1. Clone the repository.
2. Install the dependencies.
3. Create a folder in `backend` called `secrets`,
4. Inside `secrets` put the `google_application_credentials.json` file containing the Google Cloud project service account informations
5. Also, inside `secrets` create a `.env` file like the following:

```
ENVIRONMENT="dev"
GOOGLE_CLIENT_ID=<put the Google Cloud project's client id>
GOOGLE_CLIENT_SECRET=<put the Google Cloud project's client secret>
GOOGLE_APPLICATION_ID=<put the Google Cloud project's application id>
GOOGLE_REDIRECT_URI="http://127.0.0.1:3000/auth/google"
FRONTEND_BASE_URL="http://localhost:3000/"
BACKEND_BASE_URL="http://localhost/"
BACKEND_PORT="8000"
```

6. Run the app using the following commands:

```bash
cd reDup/backend
uvicorn server:app
cd ../frontend
npm run dev
```

## Steps to Utilize the App

1. Log in to your Google Drive account.
2. Select the folders that you want to inspect.
3. reDup will analyze the photos in the folders and find near duplicate and similar images.
4. Select the images that you want to delete.
5. Click the "Delete" button to confirm your deletion.
