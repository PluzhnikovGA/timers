const { findTimersWithKeyIsActive } = require("../DB/db.js");

const sendActiveTimers = async (ws, userId) => {
  const timers = await findTimersWithKeyIsActive(userId, true);

  for (const timer of timers) {
    timer.start = Number(timer.start);
    timer.progress = Date.now() - Number(timer.start);
  }

  ws.send(
    JSON.stringify({
      type: "active_timers",
      timers,
    })
  );
};
exports.sendActiveTimers = sendActiveTimers;
