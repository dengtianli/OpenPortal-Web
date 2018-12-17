const router = require("express").Router(),
  util = require("../common/util.js");

router.route("/login")
  .get(function (request, response) {
    response.json(util.json("/login/data/login.json"));
  });
   router.route("/home/getLoginUserInfo")
  .get(function (request, response) {
    response.json(util.json("/login/data/home_getLoginUserInfo.json"));
  });
     router.route("/loginOut")
  .get(function (request, response) {
    response.json(util.json("/login/data/login_loginOut.json"));
  });

module.exports = router;
