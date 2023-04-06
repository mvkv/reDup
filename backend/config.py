import os
import logging
from dotenv import load_dotenv

load_dotenv("./secrets/.env")

IS_DEV = os.environ.get("ENVIRONMENT") == "dev"


def setup_logger():
    # TODO: in prod create logging file with only WARNING level
    logging.getLogger("uvicorn").setLevel(logging.DEBUG if IS_DEV else logging.INFO)
