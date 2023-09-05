import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import config from "./src/utils/config.js";
import logger from "./src/utils/log.js";
import cors from "cors";

app.use(cors());
const log = logger("server");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.connected);
  socket.on("request-created", (data) => {
    io.emit("request-created", data);
  });
  socket.on("request-updated", (data) => {
    io.emit("request-updated", data);
  });
});

process.on("uncaughtException", (err) => {
  log.fatal({ err }, `Unhandled exception ${err}`);
  server.close();
});

process.on("unhandledRejection", (reason) => {
  log.error(`Unhandled promise rejection: ${reason}`);
});

const main = async () => {
  log.info(`Listening on 0.0.0.0:${config.PORT}`);
  await server.listen(config.PORT);
};

main();

// export io for use in other modules;
export { io };
