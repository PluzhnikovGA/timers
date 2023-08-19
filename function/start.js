const { createTimer, findUserBySessionId } = require("../DB/db.js");
const { sendAllTimers } = require("./sendAllTimers.js");
const { errorNeedLogin } = require("./errorNeedLogin.js");

const start = async (ws, data) => {
  const { sessionId, description } = data;

  if (sessionId === null) {
    return errorNeedLogin(ws);
  }

  const userId = await findUserBySessionId(sessionId);

  const timer = await createTimer(userId, description);

  if (timer.length === 0) {
    return ws.send(
      JSON.stringify({
        type: "timer_error",
        error: `We could not create a timer`,
      })
    );
  } else {
    ws.send(
      JSON.stringify({
        type: "timer_create",
        message: `You created new timer with id: ${timer[0].id}`,
      })
    );
    return await sendAllTimers(ws, userId);
  }
};
exports.start = start;
