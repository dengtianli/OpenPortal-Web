const router = require("express").Router(),
  util = require("../common/util.js");

router.route("/home/submitRegisterUerInfo")
  .post(function (request, response) {
    response.json(util.json("/register/data/home_submitRegisterUerInfo.json"));
  });


module.exports = router;
