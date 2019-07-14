# mitmproxy-logging-script

An addon for `mitmproxy` that dumps http/https requests information.

## Installation

- Install the latest version of mitmproxy, get it from (here)[https://mitmproxy.org/downloads/].
- Configure your proxy settings:
  - Enter Windows search
  - Type in "proxy"
  - Choose proxy settings
  - Set address to localhost:8080
- Run the proxy: `midmdump -q -s dump.py`
  - Can be run at startup by installing it as a service using `NSSM`.
- Open your browser, navigate to http://mitm.it and follow the orders there (install mitmproxy CA certificate).
- Put the config file in the working directory of the proxy.
- Configure what information do you want the proxy to dump.
- Enjoy.

## Example output of a request to `google.com`

```json
{
  "request": {
    "scheme": "https",
    "version": "HTTP/2.0",
    "url": "https://www.google.com/",
    "method": "GET",
    "time": "2019-06-29 21:32:00.765041",
    "host": "www.google.com",
    "dst_port": 443,
    "headers": {
      ":authority": "www.google.com",
      "cache-control": "max-age=0",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "x-client-data": "CIa2yQEIo7bJAQjEtskBCKmdygEIqKPKAQixp8oBCOKoygEI8anKAQiWrcoBCMytygE=",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "cookie": "ANID=AHWqTUmRnbTRZJd5NS_evCQMIulVvI-Tnd_ygEqiIKvYy5MXg_q0R7nFV-GuVX4H; NID=186=g_TKZsXl7eulk5gUWG16Ps5Ppseel-zKGLvkxlcd76CIpaOjXfuG5kcwk1gwgpFFsL-LnEo9pf4SYOu7h3t_8Hjo-7CqW0cxExUbRTKPP_pNISEmTIccRQmaHv55CGwd89d4LIqXdHBEMewI-TJ9Kb5DrNcYaOVC6y-lwuYrOKI; 1P_JAR=2019-6-29-18"
    },
    "client_info": {
      "src_addr": "::1",
      "src_port": 52147
    }
  },
  "response": {
    "status_code": 200,
    "status_desc": "OK",
    "headers": {
      "date": "Sat, 29 Jun 2019 18:32:00 GMT",
      "expires": "-1",
      "cache-control": "private, max-age=0",
      "content-type": "text/html; charset=UTF-8",
      "strict-transport-security": "max-age=31536000",
      "content-encoding": "br",
      "server": "gws",
      "content-length": "61604",
      "x-xss-protection": "0",
      "x-frame-options": "SAMEORIGIN",
      "set-cookie": "1P_JAR=2019-06-29-18; expires=Mon, 29-Jul-2019 18:32:00 GMT; path=/; domain=.google.com",
      "alt-svc": "quic=\":443\"; ma=2592000; v=\"46,44,43,39\""
    }
  }
}
```

## Todo:

- [x] Output to file
- [x] Termination handling (needs to be done because mitmdump done() bug)
- [x] Get information of both request & response
  - [x] Make it configurable
