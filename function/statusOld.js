const { findTimersWithKeyIsActive, findUserBySessionId } = require("../DB/db.js");
const { errorNeedLogin } = require("./errorNeedLogin.js");

const statusOld = async (ws, data) => {
  const { sessionId } = data;

  if (!sessionId) {
    return errorNeedLogin(ws);
  }

  const userId = await findUserBySessionId(sessionId);

  const timers = await findTimersWithKeyIsActive(userId, false);

  if (timers.length === 0) {
    return ws.send(
      JSON.stringify({
        type: "timer_error",
        error: `You haven't old timers`,
      })
    );
  } else {
    for (const timer of timers) {
      timer.start = Number(timer.start);
      timer.end = Number(timer.end);
      timer.duration = timer.end - timer.start;
    }

    return ws.send(
      JSON.stringify({
        type: "We found timers",
        timers,
      })
    );
  }
};
exports.statusOld = statusOld;
