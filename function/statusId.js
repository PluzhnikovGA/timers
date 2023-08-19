const { findTimerById, findUserBySessionId } = require("../DB/db.js");
const { errorNeedLogin } = require("./errorNeedLogin.js");

const statusId = async (ws, data) => {
  const { sessionId, timerId } = data;

  if (sessionId === null) {
    return errorNeedLogin(ws);
  }

  const userId = await findUserBySessionId(sessionId);

  const timer = await findTimerById(timerId, userId);

  if (timer.length === 0) {
    return ws.send(
      JSON.stringify({
        type: "timer_error",
        error: `You haven't active timer with id: ${timerId}`,
      })
    );
  } else {
    timer[0].start = Number(timer[0].start);
    timer[0].progress = Date.now() - Number(timer[0].start);

    return ws.send(
      JSON.stringify({
        type: "We found timers",
        timers: timer,
      })
    );
  }
};
exports.statusId = statusId;
