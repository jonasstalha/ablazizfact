import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  CircularProgress,
} from "@mui/material";

function App() {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [showData, setShowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const bringData = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/factures")
      .then((response) => {
        setShowData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const addFacture = async () => {
    if (!file || !price || !category || !paymentStatus) {
      alert("Please fill out all fields and select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("paymentStatus", paymentStatus);

      await axios.post("http://localhost:3001/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Facture added successfully!");
    } catch (error) {
      console.error("Error adding facture:", error);
      alert("Failed to add facture.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      !["application/pdf", "image/png", "image/jpeg"].includes(selectedFile.type)
    ) {
      alert("Please upload a valid PDF or image file.");
      return;
    }
    setFile(selectedFile);
  };

  const groupedData = showData.reduce((acc, facture) => {
    if (!acc[facture.category]) {
      acc[facture.category] = [];
    }
    acc[facture.category].push(facture);
    return acc;
  }, {});

  const getCategoryName = (category) => {
    switch (category) {
      case "option1":
        return "Quality Control";
      case "option2":
        return "Packaging";
      case "option3":
        return "Tickets";
      default:
        return category;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#2e3b55" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Facture Manager
          </Typography>
          <Button color="inherit" href="#form-section">
            Add Facture
          </Button>
          <Button color="inherit" href="#data-section">
            View Factures
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* Add Facture Form */}
            <Box component="section" id="form-section">
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Add New Facture
              </Typography>

              <TextField
                fullWidth
                type="file"
                onChange={handleFileChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Price (DH)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="option1">Quality Control</MenuItem>
                  <MenuItem value="option2">Packaging</MenuItem>
                  <MenuItem value="option3">Tickets</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  label="Payment Status"
                >
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="unpaid">Unpaid</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={addFacture}
                sx={{ marginTop: 2 }}
              >
                Submit Facture
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* View Factures Section */}
            <Box component="section" id="data-section">
  <Typography
    variant="h5"
    sx={{
      marginBottom: 2,
      color: "black", // Change title color to black
    }}
  >
    Factures by Category
  </Typography>

  <Button
    fullWidth
    variant="outlined"
    color="secondary"
    onClick={bringData}
  >
    Refresh Data
  </Button>

  {loading ? (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
      <CircularProgress />
    </Box>
  ) : (
    Object.entries(groupedData).map(([category, factures], index) => (
      <Box
        key={index}
        sx={{
          marginTop: 4,
          backgroundColor: "#f2f2f2", // Light background for each category
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            marginBottom: 2,
            color: "#333", // Dark text for category names
            fontWeight: "bold",
          }}
        >
          {getCategoryName(category)}
        </Typography>

        {factures.map((facture, idx) => (
          <Card
            key={idx}
            sx={{
              marginBottom: 2,
              borderRadius: "16px",
              boxShadow: 5,
              background: "linear-gradient(135deg, #00d2ff, #3a7bd5)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 1,
                  color: "#fff", // White text inside the card
                }}
              >
                Facture Details
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "#fff", // White text for key info
                }}
              >
                <strong>Price:</strong> {facture.price} DH
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "#fff", // White text for key info
                }}
              >
                <strong>Category:</strong> {getCategoryName(facture.category)}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "#fff", // White text for key info
                }}
              >
                <strong>Status:</strong> {facture.paymentStatus || "Unknown"}
              </Typography>

              {facture.file && (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    marginTop: 2,
                    borderRadius: "20px",
                    backgroundColor: "#3a7bd1",
                    "&:hover": {
                      backgroundColor: "#3a7bd9",
                    },
                  }}
                  href={`http://localhost:3001/${facture.file}`}
                  target="_blank"
                >
                  View File
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    ))
  )}
</Box>

          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "#2e3b55",
          color: "white",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          &copy; 2024 Facture Manager. All rights reserved.
        </Typography>
        <Box>
          <Button color="inherit" href="https://www.example.com">
            Privacy Policy
          </Button>
          <Button color="inherit" href="https://www.example.com">
            Terms of Service
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default App;
