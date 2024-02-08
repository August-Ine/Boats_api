var express = require("express");
var router = express.Router();

const { boat } = require("../model");

const read = boat.read;
const uid = boat.uid;
const create = boat.create;
const del = boat.del;
const update = boat.update;

router.get("/:id", function (req, res, next) {
  const id = req.params.id;

  read(id, (err, result) => {
    if (err) {
      if (err.message === "not found") next();
      else next(err);
    } else {
      res.send(result); //sets headers etc
    }
  });
});

router.post("/", function (req, res, next) {
  const id = uid();
  create(id, req.body.data, (err, id) => {
    if (err) next(err);
    else res.status(201).json({ id }); // ensure json res
  });
});

router.put("/:id", function (req, res, next) {
  const id = req.params.id;
  const data = req.body.data;
  update(id, data, (err) => {
    if (err) {
      if (err.message === "not found") {
        create(id, data, (err, id) => {
          if (err) {
            next(err);
          } else {
            res.status(201).send(id);
          }
          return;
        });
      } else {
        next(err);
        return;
      }
    } else {
      res.status(204).send();
    }
  });
});

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  del(id, (err) => {
    if (err) {
      if (err.message === "not found") next();
      else next(err);
      return;
    } else {
      res.status(204).end();
      return;
    }
  });
});

module.exports = router;
