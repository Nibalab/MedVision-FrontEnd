import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Sidebar from "../../components/Sidebar/Sidebar"; // Assuming you have a Sidebar component
import "./UploadPage.css"; // Add appropriate styling
import axios from "axios";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Use react-dropzone to manage file drop and selection
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
  });

  const [detecting, setDetecting] = useState(false);
  const detectCancerForChestCtScanImages = async (base64) => {
    try {
      setDetecting(true);
      const res = await axios.post(
        "https://6f01-34-125-85-17.ngrok-free.app/detect-ct-scan-image",
        {
          image_base64: base64,
        }
      );

      let { result } = res.data;
      alert(result);
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setDetecting(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload a CT scan image!");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Get base64 part only
      console.log("Base64 String:", base64String);

      // Call the API with the base64 string
      detectCancerForChestCtScanImages(base64String);
    };

    reader.readAsDataURL(selectedFile); // Read the file as a data URL
  };

  return (
    <div className="upload-page-container">
      <Sidebar />
      <div className="upload-content">
        <h1>Upload CT Scan</h1>
        {detecting ? (
          <p>Loading...</p>
        ) : (
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            {selectedFile ? (
              <p>{selectedFile.name}</p>
            ) : (
              <p>Upload the CT Scan here</p>
            )}
          </div>
        )}

        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadPage;