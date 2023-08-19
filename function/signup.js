const { findUserByUserName, createUser, createSession } = require("../DB/db.js");
const { sendAllTimers } = require("./sendAllTimers.js");
const { sendActiveTimers } = require("./sendActiveTimers.js");

const signup = async (ws, data, clients) => {
  const { username, password, sessionId } = data;

  if (!!sessionId) {
    return ws.send(
      JSON.stringify({
        type: "signup_error",
        error: "You are already logged in!",
      })
    );
  }

  const user = await findUserByUserName(username);

  if (user) {
    return ws.send(
      JSON.stringify({
        type: "signup_error",
        error: "There is already a user with this nickname",
      })
    );
  } else if (password === "") {
    return ws.send(
      JSON.stringify({
        type: "signup_error",
        error: "You must enter password",
      })
    );
  } else {
    const userId = await createUser(username, password);
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
        type: "signup_success",
        newSessionId,
      })
    );
  }
};
exports.signup = signup;
