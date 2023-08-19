const { findUserByUsernameAndPassword, createSession } = require("../DB/db.js");
const { sendAllTimers } = require("./sendAllTimers.js");
const { sendActiveTimers } = require("./sendActiveTimers.js");

const login = async (ws, data, clients) => {
  const { username, password, sessionId } = data;

  if (!!sessionId) {
    return ws.send(
      JSON.stringify({
        type: "auth_error",
        error: "You are already logged in!",
      })
    );
  }

  const userId = await findUserByUsernameAndPassword(username, password);

  if (!userId) {
    return ws.send(
      JSON.stringify({
        type: "auth_error",
        error: "Wrong username or password!",
      })
    );
  }

  const newSessionId = await createSession(userId);

  clients.set(userId, {
    ws: ws,
    sessionId: newSessionId,
  });

  sendAllTimers(ws, userId);

  ws.sendActiveTimers = setInterval(
    (
      (ws, userId) => () =>
        sendActiveTimers(ws, userId)
    )(ws, userId),
    1000
  );

  return ws.send(
    JSON.stringify({
      type: "auth_success",
      newSessionId,
    })
  );
};
exports.login = login;
