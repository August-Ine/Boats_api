var express = require("express");
var router = express.Router();
const finished = require("stream").finished;

const stream = require("../stream");

router.get("/", function (req, res, next) {
  const mystream = stream();
  mystream.pipe(res, { end: false });

  //don't end downstream in case of upstream error
  finished(mystream, (err) => {
    if (err) {
      return next(err);
    } else {
      return res.end();
    }
  });
});

module.exports = router;
