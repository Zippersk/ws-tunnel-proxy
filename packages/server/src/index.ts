import { default as WebSocketServer } from "socket.io";
import http from "http";
var ss = require("socket.io-stream");

process.on("uncaughtException", function(error) {
  console.error(error);
});

var localport = 80;

const server = http.createServer(async (request, response) => {
  console.log(`${request.method} ${request.headers.host}${request.url}`);

  var requestStream = ss.createStream();
  ss(await getWebSocket(request)).emit(
    "request",
    requestStream,
    {
      path: request.url,
      method: request.method,
      headers: request.headers
    },
    responseStream => {
      responseStream.pipe(response);
    }
  );

  request.pipe(requestStream);
});

function getWebSocket(req: http.IncomingMessage) {
  let subdomain = req.headers.host?.slice(0, req.headers.host.indexOf("."));

  if (!subdomain) {
    throw new Error("Invalid subdomain");
  }

  return new Promise((resolve, reject) => {
    websocketServer
      .in(subdomain as string)
      .clients((error: Error, clients: any) => {
        if (error) reject(error);
        if (clients.length === 0)
          reject(`No client registered for ${subdomain} subdomain!`);
        if (clients.length > 1)
          reject(
            `There are more clients registered on ${subdomain} subdomain!`
          );
        resolve(websocketServer.sockets.connected[clients[0]]);
      });
  });
}

const websocketServer = new WebSocketServer(server);
websocketServer.on("connection", socket => {
  socket.on("register", (subdomain, cb) => {
    websocketServer.in(subdomain).clients((error: Error, clients: any) => {
      if (error) {
        cb(`There was an error: ${error.message}`);
        throw error;
      }

      if (clients.length > 0)
        cb(`There is already someone listerning for subdomain ${subdomain}`);
      socket.join(subdomain, () => {
        console.log(`Subdomain ${subdomain} succesfully registered`);
        cb(`Subdomain ${subdomain} succesfully registered`);
      });
    });
  });
});

server.listen(localport);

console.log(`Listening...`);
