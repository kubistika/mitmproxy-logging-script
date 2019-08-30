from flask import Flask, request, Response
from flask_cors import CORS
import json

app = Flask("proxy")
CORS(app)


def is_config_valid(config):
    if 'logPath' not in config:
        return False

    return True


@app.route('/config', methods=['GET'])
def get_config():
    with open('config.json', 'r') as f:
        return f.read()


@app.route('/config', methods=['POST'])
def update_config():
    config = request.json
    if not is_config_valid(config):
        return Response(status=400)

    with open('config.json', 'w') as f:
        f.write(json.dumps(config, indent=4))

    return Response(status=200)


def run_server():
    app.run("localhost", 9999)
