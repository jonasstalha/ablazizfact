import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [showData, setShowData] = useState([]);

  const bringData = () => {
    axios
      .get("http://localhost:3001/factures")
      .then((response) => {
        setShowData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
      <div className="container">
        <h1 className="app-title">Facture Manager</h1>
        <section className="form-section">
          <h2>Add New Facture</h2>
          <form>
            <label htmlFor="file-upload">Upload a File:</label>
            <input id="file-upload" type="file" onChange={handleFileChange} />

            <label htmlFor="price">Price (DH):</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />

            <label htmlFor="category">Select Category:</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">--Please select--</option>
              <option value="option1">Quality Control</option>
              <option value="option2">Packaging</option>
              <option value="option3">Tickets</option>
            </select>

            <label htmlFor="payment-status">Payment Status:</label>
            <select
              id="payment-status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="">--Please select--</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>

            <button type="button" className="btn-primary" onClick={addFacture}>
              Submit
            </button>
          </form>
        </section>

        <section className="data-section">
          <h2>Factures by Category</h2>
          <button className="btn-secondary" onClick={bringData}>
            Refresh Data
          </button>

          {Object.entries(groupedData).map(([category, factures], index) => (
            <div key={index} className="category-section">
              <h3 className="category-title">{getCategoryName(category)}</h3>
              <p className="category-total">
                Total Unpaid:{" "}
                {factures
                  .filter((facture) => facture.paymentStatus === "unpaid")
                  .reduce((sum, facture) => sum + parseFloat(facture.price), 0)}{" "}
                DH
              </p>
              <div className="facture-grid">
                {factures.map((facture, idx) => (
                  <div key={idx} className="facture-card">
                    <p>
                      <strong>Price:</strong> {facture.price} DH
                    </p>
                    <p>
                      <strong>Category:</strong> {getCategoryName(facture.category)}
                    </p>
                    <p>
                      <strong>Status:</strong> {facture.paymentStatus || "Unknown"}
                    </p>
                    {facture.file && (
                      <a
                        href={`http://localhost:3001/${facture.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-link"
                      >
                        View File
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default App;
