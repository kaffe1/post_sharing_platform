const { verify } = require("jsonwebtoken");
const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  //   const accessToken = req.headers.accesstoken;
  if (!accessToken) {
    return res.json({ error: "user not logged in !" });
  }

  try {
    const validToken = verify(accessToken, "important_secret");
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (error) {
    return res.json({ error: error });
  }
};

module.exports = { validateToken };
