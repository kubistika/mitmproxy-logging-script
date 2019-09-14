import random
import sys
import os
import json
import signal
import logging
import socket

from logging.handlers import RotatingFileHandler
from mitmproxy import ctx
from datetime import datetime
from http.client import responses

# Configuration path
CONFIG_PATH = "config.json"

# Max log size
MAX_LOG_FILE_SIZE_BYTES = 1024 * 1024 * 1024

# Max backup log files
BACKUP_COUNT = 10

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
        rotating_handler = RotatingFileHandler(self.config['logPath'],
                                               maxBytes=MAX_LOG_FILE_SIZE_BYTES,
                                               backupCount=BACKUP_COUNT)
        logging.basicConfig(handlers=[rotating_handler],
                            level=logging.INFO,
                            format='%(levelname)s - %(message)s')

    def done(self):
        # close all log handlers.
        for handler in logging.root.handlers[:]:
            handler.close()
            logging.root.removeHandler(handler)

    def add_custom_fields(self, target_obj, src_obj, custom_fields):
        for field_name in custom_fields:
            target_obj[field_name] = getattr(src_obj, field_name)

    def filter_headers(self,  all_headers, wanted_headers):
        # All headers should be returned.
        if len(wanted_headers) == 1 and wanted_headers[0] == '*':
            return all_headers

        result = {}
        for header_name in wanted_headers:
            if header_name in all_headers:
                result[header_name] = all_headers[header_name]

        return result

    """ 
    This hook function is called by `mitmdump` whenever a response is received from a target server.
    the flow object holds information about both request and response (the whole HTTP/s flow).
    """

    def response(self, flow):
        client_conn = flow.client_conn
        server_conn = flow.server_conn

        info = {
            "request": {
                "time": str(datetime.now()),
                "client_info": {
                    "hostname": socket.gethostname(),
                    "src_addr": client_conn.address[0],
                    "src_port": client_conn.address[1],
                },
                "target_info": {
                    "dst_addr": server_conn.ip_address[0],
                    "dst_port": server_conn.ip_address[1],
                }
            },
            "response": {
                "status_code": flow.response.status_code,
                "status_desc": responses[flow.response.status_code],
            }
        }

        if 'fields' in self.config['request']:
            self.add_custom_fields(
                info['request'], flow.request, self.config['request']['fields'])

        if 'fields' in self.config['response']:
            self.add_custom_fields(
                info['response'], flow.response, self.config['response']['fields'])

        info['request']['headers'] = self.filter_headers(
            dict(flow.request.headers), self.config['request']['headers'])
        info['response']['headers'] = self.filter_headers(
            dict(flow.response.headers), self.config['response']['headers'])

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
