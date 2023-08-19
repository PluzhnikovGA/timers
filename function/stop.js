const { stopTimer, findUserBySessionId } = require("../DB/db.js");
const { sendAllTimers } = require("./sendAllTimers.js");
const { errorNeedLogin } = require("./errorNeedLogin.js");

const stop = async (ws, data) => {
  const { sessionId, timerId } = data;

  if (!sessionId) {
    return errorNeedLogin(ws);
  }

  const userId = await findUserBySessionId(sessionId);

  const timer = await stopTimer(timerId, userId);

  if (timer === 0) {
    return ws.send(
      JSON.stringify({
        type: "timer_error",
        error: `You haven't active timer with id: ${timerId}`,
      })
    );
  } else {
    ws.send(
      JSON.stringify({
        type: "timer_stop",
        message: `You stopped timer with id: ${timerId}`,
      })
    );
    return await sendAllTimers(ws, userId);
  }
};
exports.stop = stop;
