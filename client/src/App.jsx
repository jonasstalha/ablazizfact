import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [showData, setShowData] = useState([]);

  // Fetch data from backend
  const bringData = () => {
    axios
      .get("http://localhost:3001/factures")
      .then((response) => {
        console.log(response.data);
        setShowData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Function to upload file and form data
  const addFacture = async () => {
    if (!file || !price || !category || !paymentStatus) {
      alert("Please fill out all fields and select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file); // Add file to formData
      formData.append("price", price);
      formData.append("category", category);
      formData.append("paymentStatus", paymentStatus);

      // POST request to backend
      const response = await axios.post("http://localhost:3001/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      alert("Facture added successfully!");
    } catch (error) {
      console.error("Error adding facture:", error);
      alert("Failed to add facture.");
    }
  };

  // Handle file change and validate file type
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

  return (
    <div className="app">
      <div className="information">
        <h1>Upload Form</h1>
        <form>
          <label>Upload a PDF or Image:</label>
          <input type="file" onChange={handleFileChange} />

          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />

          <label>Select a Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">--Please select--</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>

          <label>Paid or Not:</label>
          <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="">--Please select--</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <button type="button" onClick={addFacture}>
            Submit
          </button>
        </form>

        <hr />

        <section className="showdata">
          <h1>Show Data for All Categories</h1>
          <button onClick={bringData}>Refresh Data</button>
          <div className="facture-cards">
            {showData.length > 0 ? (
              showData.map((facture, index) => (
                <div key={index} className="facture-card">
                  <p>
                    <strong>Price:</strong> {facture.price}<strong>DH</strong>
                  </p>
                  <p>
                    <strong>Category:</strong> {facture.category}
                  </p>
                  <p>
                    <strong>Status:</strong> {facture.status}
                  </p>
                  {facture.file && (
                    <div>
                      <a href={`http://localhost:3001/${facture.file}`} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
