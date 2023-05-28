from flask import (
    Flask,
    request,
    make_response,
    redirect,
    abort,
)
from flask_cors import CORS
import os
from sgid_client import SgidClient, generate_pkce_pair
from dotenv import load_dotenv
from uuid import uuid4
from urllib.parse import urlencode, parse_qs


# In-memory store for user session data
# In a real application, this would be a database.
session_data = {}
SESSION_COOKIE_NAME = "exampleAppSession"

app = Flask(__name__)

sgid_client = SgidClient(
    client_id=os.getenv("SGID_CLIENT_ID"),
    client_secret=os.getenv("SGID_CLIENT_SECRET"),
    private_key=os.getenv("SGID_PRIVATE_KEY"),
    redirect_uri="http://127.0.0.1:5000/api/redirect",
)

#create default root page to show hello world
@app.route('/')
def hello_world():
    return 'Hello world!'


@app.route("/api/auth-url")
def get_auth_url():
    session_id = str(uuid4())
    # Use search params to store state so other key-value pairs
    # can be added easily
 
    # We pass the user's ice cream preference as the state,
    # so after they log in, we can display it together with the
    # other user info.
    code_verifier, code_challenge = generate_pkce_pair()
    url, nonce = sgid_client.authorization_url(
        code_challenge=code_challenge
    )
    session_data[session_id] = {
        "nonce": nonce,
        "code_verifier": code_verifier,
    }
    res = make_response({"url": url})
    res.set_cookie(SESSION_COOKIE_NAME, session_id, httponly=True)
    print(url)
    return res


@app.route("/api/redirect")
def handle_redirect():
    auth_code = request.args.get("code")
    state = request.args.get("state")
    session_id = request.cookies.get(SESSION_COOKIE_NAME)

    session = session_data.get(session_id, None)
    # # Validate that the state matches what we passed to sgID for this session
    # if session is None or session["state"] != state:
    #     return redirect(f"{frontend_host}/error")

    sub, access_token = sgid_client.callback(
        code=auth_code, code_verifier=session["code_verifier"], nonce=session["nonce"]
    )
    session["access_token"] = access_token
    session["sub"] = sub
    session_data[session_id] = session
    sub, data = sgid_client.userinfo(sub=sub, access_token=access_token)
    print({"sub": sub, "data": data})

    return {"sub": sub, "data": data}


@app.route("/api/logout")
def logout():
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    del session_data[session_id]
    res = make_response({})
    res.delete_cookie(SESSION_COOKIE_NAME)
    return res
