require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure 'uploads' directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Assign a unique filename
  },
});

const upload = multer({ storage });

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost", // Use environment variable for DB host
  user: process.env.DB_USER || "root", // Use environment variable for DB user
  password: process.env.DB_PASSWORD || "", // Use environment variable for DB password
  database: process.env.DB_NAME || "myfacture_manager", // Use environment variable for DB name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Root Route: Test if backend is running
app.get("/", (req, res) => {
  res.send("Backend is up and running!");
});

// POST Endpoint: Add Facture
app.post("/create", upload.single("file"), (req, res) => {
  const { price, category, paymentStatus } = req.body;

  // Validation for required fields
  if (!req.file || !price || !category) {
    return res.status(400).json({ message: "Missing required fields or file." });
  }

  const filePath = `uploads/${req.file.filename}`; // Path to the uploaded file
  const status = paymentStatus || "unpaid"; // Default to 'unpaid' if no payment status is provided

  // SQL Query to insert facture data into the database
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
      price: parseFloat(facture.price), // Convert price to a number
    }));
    res.status(200).json(formattedResults);
  });
});

// Start Server
const PORT = process.env.PORT || 3001; // Dynamically use the environment port, default to 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
