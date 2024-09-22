import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Sidebar from "../../components/Sidebar/Sidebar"; 
import "./UploadPage.css"; 
import axios from "axios";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState(""); // State to manage alert message
  const [detecting, setDetecting] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
  });

  const detectCancerForChestCtScanImages = async (base64) => {
    try {
      setDetecting(true);
      const res = await axios.post(
        "https://116e-34-34-55-103.ngrok-free.app/detect-ct-scan-image",
        {
          image_base64: base64,
        }
      );

      let { result } = res.data;
      setAlertMessage(result); // Set the alert message
    } catch (error) {
      setAlertMessage("Something went wrong");
    } finally {
      setDetecting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setAlertMessage("Please upload a CT scan image!");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];

      detectCancerForChestCtScanImages(base64String);
    };

    reader.readAsDataURL(selectedFile);
  };

  const closeAlert = () => {
    setAlertMessage("");
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
            {selectedFile ? <p>{selectedFile.name}</p> : <p>Upload the CT Scan here</p>}
          </div>
        )}

        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>

        {/* Custom alert modal */}
        {alertMessage && (
          <div className="upload-alert-modal">
            <div className="upload-alert-content">
              <p>{alertMessage}</p>
              <button className="upload-alert-button" onClick={closeAlert}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
