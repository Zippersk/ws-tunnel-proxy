# Tunneling HTTP trafix via websocket proxy
Selfhosted [ngrok](https://ngrok.com/) alternative.

## Server
Deploy this docker compose file on the server with public domain (for example `example.com`).

```yml
version: "3.7"

services:
  proxy-server:
    image: zippersk/ws-tunnel-proxy:server
    restart: unless-stopped
    ports:
      - "80:80"
```

## Clients
Clients can be deployed on any local or public network (i.e. `localhost`). Client container accepts these environment variables:
* `SERVER_ADDR` - public ip or domain of proxy server
* `HOST` - a private host that we want to make public
* `PORT` - port of the private host that we want to make public
* `SUBDOMAIN` - prefix on which 

In the example below, we have two services on private network (`web1` and `web2`). Then we need to create two proxy clients (`proxyclient1` and `proxyclient2`) for these services. 

```yml
version: "3.7"

services:
  proxyclient1:
    image: zippersk/ws-tunnel-proxy:client
    restart: unless-stopped
    environment:
      SERVER_ADDR: http://example.com
      HOST: web1
      PORT: 80
      SUBDOMAIN: webservice1

  proxyclient2:
    image: zippersk/ws-tunnel-proxy:client
    restart: unless-stopped
    environment:
      SERVER_ADDR: http://example.com
      HOST: web2
      PORT: 80
      SUBDOMAIN: webservice2

  web1:
      image: strm/helloworld-http
  web2:
      image: strm/helloworld-http
```

After deploying this docker compose file, you can access `webservice1.example.com` and `webservice2.example.com`.