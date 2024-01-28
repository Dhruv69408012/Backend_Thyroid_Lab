const jwt = require("jsonwebtoken");
const jwtUtils = {
  generateToken: (data) => {
    return jwt.sign(data, process.env.TOKEN_SECRET_KEY, { expiresIn: "1h" });
  },
};
module.exports = jwtUtils;
