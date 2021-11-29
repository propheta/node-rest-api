const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM Orders", (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      const response = {
        quantity: result.length,
        orders: result.map((order) => {
          return {
            OrderId: order.OrderID,
            ProductId: order.ProductID,
            Quantity: order.OrderQuantity,
            request: {
              type: "GET",
              description: "Gets a specific order",
              url: "http://localhost:5000/orders/" + order.OrderID,
            },
          };
        }),
      };
      return res.status(200).send({ response });
    });
  });
});

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "SELECT * FROM Products WHERE ProductID = ?",
      [req.body.productId],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({
            error: error,
          });
        }
        if (result.length == 0) {
          return res.status(404).send({
            message: "Product not found",
          });
        }
        conn.query(
          "INSERT INTO Orders (ProductId, OrderQuantity) VALUES (?,?)",
          [req.body.productId, req.body.quantity],
          (error, result, field) => {
            conn.release();
            if (error) {
              return res.status(500).send({
                error: error,
                response: null,
              });
            }
            const response = {
              message: "Order inserted successfully",
              order: {
                ProductID: req.body.productId,
                Quantity: req.body.quantity,
                request: {
                  type: "GET",
                  description: "Gets all orders",
                  url: "http://localhost:5000/orders",
                },
              },
            };
            return res.status(201).send({ response });
          }
        );
      }
    );
  });
});

router.get("/:id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM Orders WHERE OrderID = ?",
      [req.params.id],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        if (result.length == 0) {
          return res.status(404).send({
            message: "Order not found",
          });
        }
        const response = {
          order: {
            OrderID: result[0].OrderID,
            ProductID: result[0].ProductID,
            Quantity: result[0].OrderQuantity,
            request: {
              type: "GET",
              description: "Gets all orders",
              url: "http://localhost:5000/orders",
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
});

router.put("/:id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "UPDATE Orders SET ProductID = ?, OrderQuantity = ? WHERE OrderID = ?",
      [req.body.productId, req.body.quantity, req.body.id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          message: "Order updated successfully",
          product: {
            ProductID: req.body.id,
            Name: req.body.name,
            Price: req.body.price,
            request: {
              type: "GET",
              description: "Get order details",
              url: "http://localhost:5000/orders/" + req.body.id,
            },
          },
        };
        return res.status(202).send({ response });
      }
    );
  });
});

router.delete("/:id", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "DELETE FROM Orders WHERE OrderID = ?",
      [req.body.id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          message: "Order deleted",
          request: {
            type: "POST",
            description: "Insert one order",
            url: "http://localhost:5000/orders",
            body: {
              productId: "Number",
              quantity: "Number",
            },
          },
        };
        return res.status(202).send({ response });
      }
    );
  });
});

module.exports = router;
