const { deleteSession } = require("../DB/db.js");
const { errorNeedLogin } = require("./errorNeedLogin.js");

const logout = async (ws, data) => {
  const { sessionId } = data;

  if (!sessionId) {
    return errorNeedLogin(ws);
  }

  await deleteSession(sessionId);
  clearInterval(ws.sendActiveTimers);

  return ws.send(
    JSON.stringify({
      type: "logout_success",
      message: "Logged out successfully!",
    })
  );
};
exports.logout = logout;
