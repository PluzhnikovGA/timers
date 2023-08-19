require("dotenv").config();

const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const { login } = require("./function/login.js");
const { signup } = require("./function/signup.js");
const { logout } = require("./function/logout.js");
const { stop } = require("./function/stop.js");
const { start } = require("./function/start.js");
const { status } = require("./function/status.js");
const { statusId } = require("./function/statusId.js");
const { statusOld } = require("./function/statusOld.js");
const { deleteSession } = require("./DB/db.js");

const app = express();
app.use(express.static("../client"));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    let data;

    try {
      data = JSON.parse(message);
    } catch (err) {
      return ws.send(
        JSON.stringify({
          type: "incorrect_data",
          error: "You sent incorrect data to the server",
        })
      );
    }

    switch (data.type) {
      case "login":
        await login(ws, data, clients);
        break;
      case "signup":
        await signup(ws, data, clients);
        break;
      case "logout":
        await logout(ws, data);
        break;
      case "stop":
        await stop(ws, data);
        break;
      case "start":
        await start(ws, data);
        break;
      case "status":
        await status(ws, data);
        break;
      case "status id":
        await statusId(ws, data);
        break;
      case "status old":
        await statusOld(ws, data);
        break;
      case "invalid_command":
        ws.send(
          JSON.stringify({
            type: "invalid_command",
            error: "You sent an invalid command to the server",
          })
        );
        break;
    }
  });

  ws.on("close", async () => {
    for (const userId of clients.keys()) {
      if (clients.get(userId).ws === ws) {
        clearInterval(ws.sendActiveTimers);
        await deleteSession(clients.get(userId).sessionId);
        clients.delete(userId);
      }
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
