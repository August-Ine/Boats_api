var express = require("express");
var router = express.Router();

const { BOAT_SERVICE_PORT, BRAND_SERVICE_PORT } = process.env;

const boatSrv = `http://localhost:${BOAT_SERVICE_PORT}`;
const brandSrv = `http://localhost:${BRAND_SERVICE_PORT}`;

router.get("/:id", async function (req, res, next) {
  const id = req.params.id;
  //int id?
  if (isNaN(Number(id))) res.status(400).send("invalid id parameter");

  //use fetch to get upstream service
  try {
    const signal = AbortSignal.timeout(1250);
    const boatReq = await fetch(`${boatSrv}/${id}`, { signal });

    if (boatReq.status === 400) {
      res.status(400).end();
      return;
    }
    if (boatReq.status === 404) {
      next();
      return;
    }
    if (boatReq.status !== 200) {
      next(new Error("internal server error"));
      return;
    }
    //we have res
    const boatData = await boatReq.json();

    //brand request
    const brandReq = await fetch(`${brandSrv}/${boatData.brand}`);
    if (brandReq.status === 400) {
      res.status(400).end();
      return;
    }
    if (brandReq.status === 404) {
      next();
      return;
    }
    if (brandReq.status !== 200) {
      next(new Error("internal server error"));
      return;
    }
    //we have brand
    const brandData = await brandReq.json();

    res.status(200).send({
      id: boatData.id,
      color: boatData.color,
      brand: brandData.name,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
