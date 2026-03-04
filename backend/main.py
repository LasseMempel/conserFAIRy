import os
from dotenv import load_dotenv

# Load environment-specific .env file before anything else imports from app.*
# Usage:  APP_ENV=test python3 main.py   →  loads .env.test
#         python3 main.py               →  loads .env  (default)
app_env = os.getenv("APP_ENV", "development")
env_file = ".env.test" if app_env == "test" else ".env"
load_dotenv(env_file)

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.app:app", host="0.0.0.0", log_level="info")