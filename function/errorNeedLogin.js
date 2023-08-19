const errorNeedLogin = (ws) => {
  return ws.send(
    JSON.stringify({
      type: "error_logout",
      error: "You need to login first",
    })
  );
};
exports.errorNeedLogin = errorNeedLogin;
