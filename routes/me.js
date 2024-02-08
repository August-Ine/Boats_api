var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("me.hbs");
  return;
});

module.exports = router;
