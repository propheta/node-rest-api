const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "Get all products",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).send({
    message: "Product inserted",
  });
});

router.get("/:id", (req, res, next) => {
  res.status(200).send({
    message: "Get product by ID",
    id: req.params.id,
  });
});

router.patch("/:id", (req, res, next) => {
  res.status(201).send({
    message: "Product updated",
  });
});

router.delete("/:id", (req, res, next) => {
  res.status(201).send({
    message: "Product deleted",
  });
});

module.exports = router;
