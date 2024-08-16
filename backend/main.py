from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import json


logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

app = FastAPI()

origins = ["*"]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  #allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
async def root():
  return {"message": "Hello World"}

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