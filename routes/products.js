const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query("SELECT * FROM Products", (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      const response = {
        quantity: result.length,
        products: result.map((prod) => {
          return {
            productId: prod.ProductID,
            name: prod.name,
            price: prod.price,
            request: {
              type: "GET",
              description: "Gets a specific product",
              url: "http://localhost:5000/products/" + prod.ProductID,
            },
          };
        }),
      };
      return res.status(200).send({ response });
    });
  });
});

router.post("/", (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  };

  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "INSERT INTO Products (ProductName, ProductPrice) VALUES (?,?)",
      [product.name, product.price],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          message: "Product inserted successfully",
          product: {
            ProductID: result.ProductID,
            Name: req.body.Name,
            Price: req.body.Price,
            request: {
              type: "GET",
              description: "Gets all products",
              url: "http://localhost:5000/products",
            },
          },
        };
        return res.status(201).send({ response });
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
      "SELECT * FROM Products WHERE ProductID = ?",
      [req.params.id],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        if (result.length == 0) {
          return res.status(404).send({
            message: "Product not found",
          });
        }
        const response = {
          product: {
            ProductID: result[0].ProductID,
            Name: result[0].ProductName,
            Price: result[0].ProductPrice,
            request: {
              type: "GET",
              description: "Gets all products",
              url: "http://localhost:5000/products",
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
});

router.put("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "UPDATE Products SET ProductName = ?, ProductPrice = ? WHERE ProductID = ?",
      [req.body.name, req.body.price, req.body.id],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          message: "Product updated successfully",
          product: {
            ProductID: req.body.id,
            Name: req.body.name,
            Price: req.body.price,
            request: {
              type: "GET",
              description: "Gets product details",
              url: "http://localhost:5000/products/" + req.body.id,
            },
          },
        };
        return res.status(202).send({ response });
      }
    );
  });
});

router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error,
      });
    }
    conn.query(
      "DELETE FROM Products WHERE ProductID = ?",
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
          message: "Product deleted",
          request: {
            type: "POST",
            description: "Insert one product",
            url: "http://localhost:5000/products",
            body: {
              name: "String",
              price: "Number",
            },
          },
        };
        return res.status(202).send({ response });
      }
    );
  });
});

module.exports = router;
