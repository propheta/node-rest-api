const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "Get all orders",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).send({
    message: "Order inserted",
  });
});

router.get("/:id", (req, res, next) => {
  res.status(200).send({
    message: "Get order by ID",
    id: req.params.id,
  });
});

router.patch("/:id", (req, res, next) => {
  res.status(201).send({
    message: "Order updated",
  });
});

router.delete("/:id", (req, res, next) => {
  res.status(201).send({
    message: "Order deleted",
  });
});

module.exports = router;
