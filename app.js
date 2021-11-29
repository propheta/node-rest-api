const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"),
    res.header(
      "Access-Control-Allow-Header",
      "Content-Type, Origin, X-Requested-With, Accept, Authorization"
    );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
    return res.status(200).send({});
  }
  next();
});

app.use("/products", productsRoute);
app.use("/orders", ordersRoute);

app.use((req, res, next) => {
  const err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.send({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
