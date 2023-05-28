from flask import Flask
from sgid_client import SgidClient
import os
app = Flask(__name__)

sgid_client = SgidClient(
    client_id=os.getenv("SGID_CLIENT_ID"),
    client_secret=os.getenv("SGID_CLIENT_SECRET"),
    private_key=os.getenv("SGID_PRIVATE_KEY"),
    redirect_uri=os.getenv("SGID_REDIRECT_URI"),
)


@app.route('/')
def hello_world():
  return 'Hello world!'