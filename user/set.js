var logged_user = "DDD";
var usertoken = "";
const setUser = (uname, accessToken) => {
  logged_user = uname;
  usertoken = accessToken;
};
function getUser() {
  return { logged_user, usertoken };
}

module.exports = { setUser, getUser };
