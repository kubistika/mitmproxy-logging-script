import random
import sys
import os
import json
import signal
import logging

from mitmproxy import ctx
from datetime import datetime
from http.client import responses

# Configuration path
CONFIG_PATH = "config.json"

"""
RequestsLogger is an addon for mitmdump that logs information about request
and response pairs to file. As it does not do any changes to the body of the
request/response, I advise to run it with `--set stream_large_bodies=1`,
which enables streaming of the request/response body.
"""


class RequestsLogger:

    def __init__(self):
        with open(CONFIG_PATH) as f:
            self.config = json.load(f)

        # Logger initialization
        logging.basicConfig(filename=self.config['log_path'],
                            filemode='w', level=logging.INFO, format='%(levelname)s - %(message)s')

    def done(self):
        # close all log handlers.
        for handler in logging.root.handlers[:]:
            handler.close()
            logging.root.removeHandler(handler)

    def add_custom_fields(self, target_obj, src_obj, custom_fields):
        for key in custom_fields:
            if type(key) is str:
                target_obj[key] = getattr(src_obj, key)
            else:
                key_in_http_req = key['original_name']
                key_in_info_obj = key['map_to']
                target_obj[key_in_info_obj] = getattr(src_obj, key_in_http_req)

    """ 
    This hook function is called by `mitmdump` whenever a response is received from a target server.
    the flow object holds information about both request and response (the whole HTTP/s flow).
    """

    def response(self, flow):
        client_conn = flow.client_conn

        info = {
            "request": {
                "time": str(datetime.now()),
                "client_info": {
                    "src_addr": client_conn.address[0],
                    "src_port": client_conn.address[1],
                },
            },
            "response": {
                "status_code": flow.response.status_code,
                "status_desc": responses[flow.response.status_code],
            }
        }

        if 'additional_fields' in self.config['request']:
            self.add_custom_fields(
                info['request'], flow.request, self.config['request']['additional_fields'])

        if 'additional_fields' in self.config['response']:
            self.add_custom_fields(
                info['request'], flow.response, self.config['response']['additional_fields'])

        if self.config['request']['include_headers']:
            info['request']['headers'] = dict(flow.request.headers)

        if self.config['response']['include_headers']:
            info['response']['headers'] = dict(flow.response.headers)

        logging.info(json.dumps(info, indent=2))


plugin = RequestsLogger()

"""
Currently, mitmdump has a bug that causes the `done()` hook not to be called on shutdown.
Therefore, we need to setup a signal handler, catch CTRL+C and call the done() hook in order
to ensure safe termination of the addon.
"""


def signal_handler(sig, frame):
    print('[+] Shutting down logging addon...')
    plugin.done()
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)

addons = [
    plugin
]