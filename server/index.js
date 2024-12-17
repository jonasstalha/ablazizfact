const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Ensure 'uploads' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});
const upload = multer({ storage });

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "myfacture_manager",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// POST Endpoint: Add Facture
app.post("/create", upload.single("file"), (req, res) => {
  const { price, category, paymentStatus } = req.body;

  // Validation
  if (!req.file || !price || !category) {
    return res.status(400).json({ message: "Missing required fields or file." });
  }

  const filePath = `uploads/${req.file.filename}`;
  const status = paymentStatus || "unpaid"; // Default to 'unpaid'

  const query = "INSERT INTO mydata (file, price, category, status) VALUES (?, ?, ?, ?)";
  db.query(query, [filePath, price, category, status], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json({ message: "Facture added successfully.", result });
  });
});

// GET Endpoint: Fetch All Factures
app.get("/factures", (req, res) => {
  const query = "SELECT *, status AS paymentStatus FROM mydata";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching factures:", err);
      return res.status(500).json({ message: "Failed to fetch factures", error: err });
    }
    // Ensure all 'price' values are numbers
    const formattedResults = results.map((facture) => ({
      ...facture,
      price: parseFloat(facture.price), // Ensures price is a number
    }));
    res.status(200).json(formattedResults);
  });
});

// Start Server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
