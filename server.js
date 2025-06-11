// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Product API! Go to /api/products to see all products."
  );
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.json(product);
});
// POST /api/products - Create a new product
app.post("/api/products", (req, res) => {
  const newProduct = {
    id: uuidv4(),
    ...req.body,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});
// PUT /api/products/:id - Update a product
app.put("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).send("Product not found");
  Object.assign(product, req.body);
  res.json(product);
});
// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", (req, res) => {
  const productIndex = products.findIndex((p) => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).send("Product not found");

  products.splice(productIndex, 1);
  res.status(204).send();
});

//-------------------------------------------------------
// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Authentication middleware (basic token check)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  // Simple token validation (in production, use proper JWT verification)
  if (token !== "valid-token") {
    return res.status(403).json({ error: "Invalid token" });
  }

  next();
};

// Apply authentication to protected routes (POST, PUT, DELETE)
app.use("/api/products", (req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    return authenticateToken(req, res, next);
  }
  next();
});

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// 404 handler for unknown routes
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

//-------------------------------------------------------

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
