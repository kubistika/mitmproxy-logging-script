from flask import Flask, request, Response, render_template
from flask_kerberos import requires_authentication
from flask_cors import CORS
import json

app = Flask("proxy", static_folder="./static", template_folder="./static")
CORS(app)


def is_config_valid(config):
    if 'logPath' not in config:
        return False

    return True


@app.route('/')
# @requires_authentication
def index():
    return render_template("index.html")


@app.route('/config', methods=['GET'])
# @requires_authentication
def get_config():
    with open('config.json', 'r') as f:
        return f.read()


@app.route('/config', methods=['POST'])
# @requires_authentication
def update_config():
    config = request.json
    if not is_config_valid(config):
        return Response(status=400)

    with open('config.json', 'w') as f:
        f.write(json.dumps(config, indent=4))

    return Response(status=200)


app.run("localhost", 8080)
