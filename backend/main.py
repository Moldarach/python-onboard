from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import json
import os


logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

app = FastAPI()

origins = [
  "http://localhost",
  "http://localhost:5173",
  ]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
async def root():
  return {"message": "Hello World"}
  directory_path = os.path.join(os.path.dirname(__file__), '../content/syntax')
    
  try:
    # List all files in the directory
    files = [f for f in os.listdir(directory_path) if os.path.isfile(os.path.join(directory_path, f))]
    file_count = len(files)
    return {"file_count": file_count}
  except Exception as e:
    return {"error": str(e)}

@app.post("/")
async def root(request: Request):
  #return {"message": "posted"}
  js = await request.json()
  #logger.debug(json.dumps(js, indent=1))
  logger.debug(type(js))
  if (isinstance(js, dict)):
    for key, value in js.items():
      print(key + " " + str(value))
      #REMOVE THIS LATER
      if (key == 'x' and value == 5):
        return {"status": "good"}

  logger.debug("help me")

  #return js
  return {"status": "bad"}

@app.post("/filecount")
async def file_count(request: Request):
  js = await request.json()
  str = js["topic"]
  #return {"message": "Hello World"}
  logger.debug("counting here")
  logger.debug(request)
  directory_path = os.path.join(os.path.dirname(__file__), '../content/' + str)
  try:
    # List all files in the directory
    files = [f for f in os.listdir(directory_path) if os.path.isfile(os.path.join(directory_path, f))]
    file_count = len(files)
    return {"file_count": file_count}
  except Exception as e:
    return {"error": str(e)}