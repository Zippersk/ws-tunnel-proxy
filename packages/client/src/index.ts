import io from "socket.io-client";
import ss from "socket.io-stream";
import http from "http";

var serverUrl = new URL(process.env.SERVER_ADDR as string);
var remotehost = process.env.HOST || "localhost";
var remoteport = parseInt(process.env.PORT as string);
var subdomain = process.env.SUBDOMAIN;

const client = io(serverUrl.toString());
client.on("connect", () => {
  client.emit("register", subdomain, msg => {
    console.log(msg);
  });

  ss(client).on("request", (requestStream, args, callback) => {
    console.log(`${args.method} ${remotehost}:${remoteport}${args.path}`);

    var responseStream = ss.createStream();
    callback(responseStream);

    const request = http.request(
      { hostname: remotehost, port: remoteport, ...args },
      function(res) {
        res.pipe(responseStream);
      }
    );
    requestStream.pipe(request);
  });
});

console.log(`${remotehost}:${remoteport} --> ${subdomain}.${serverUrl.host}`);
