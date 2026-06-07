import { createServer } from "http";
import cookie from "cookie";
import next from "next";
import { Server } from "socket.io";
// import { jwtVerify } from "jose";

// const socketsMap = new Map();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);
  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (cookies) {
        const token = cookie.parse(cookies)["auth-token"];
        if (token) {
          // const secret = new TextEncoder().encode(process.env.JWT_SECRET);
          // const { payload } = await jwtVerify(token, secret);
          // (socket as any).userId = String(payload.userId);
        }
      }
    } catch (e) {
      console.error(e);
    }
    next();
  });

  io.on("connection", async (socket) => {
    console.log("connected");
    // const user = await findUser((socket as any).userId);
    // socketsMap.set(user.id, socket.id);
    // console.log(`The user ${user.username} connected`);
  });
  const port = process.env.PORT || 3000;
  const host = "0.0.0.0";

  server.listen({ port, host }, () => {
    console.log(`> Server listening on port ${port}`);
  });
});
