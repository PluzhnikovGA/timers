const { findTimersByUser } = require("../DB/db.js");

const sendAllTimers = async (ws, userId) => {
  const activeTimers = [];
  const oldTimers = [];

  const timers = await findTimersByUser(userId);

  for (const timer of timers) {
    if (timer.isActive === "true") {
      timer.start = Number(timer.start);
      timer.progress = Date.now() - Number(timer.start);

      activeTimers.push(timer);
    } else {
      timer.start = Number(timer.start);
      timer.end = Number(timer.end);
      timer.duration = timer.end - timer.start;

      oldTimers.push(timer);
    }
  }

  ws.send(
    JSON.stringify({
      type: "all_timers",
      activeTimers,
      oldTimers,
    })
  );
};
exports.sendAllTimers = sendAllTimers;
